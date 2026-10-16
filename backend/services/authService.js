import { cookies } from 'next/headers';
import { connectToDatabase } from '@/backend/config/db';
import Admin from '@/backend/models/Admin';
import RefreshToken from '@/backend/models/RefreshToken';
import PasswordResetToken from '@/backend/models/PasswordResetToken';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  logAdminActivity,
} from '@/backend/lib/auth';
import { hashValue } from '@/backend/utils/authHelpers';

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

export const authService = {
  async register({ name, email, password, role = 'ADMIN', req }) {
    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error(`An administrator account with email "${normalizedEmail}" already exists.`);
    }

    const hashedPassword = await hashPassword(password);

    const admin = await Admin.create({
      name: name || 'Finasset Administrator',
      email: normalizedEmail,
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      failedLogins: 0,
      lastLogin: null,
      lastActive: new Date(),
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'ADMIN_REGISTERED',
      entity: 'Admin',
      entityId: admin._id,
      summary: `New administrator account registered: ${admin.email} (${admin.name}).`,
      req,
    });

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    };
  },

  async login({ email, password, req }) {
    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      throw new Error('Invalid email or password credentials.');
    }

    if (!admin.isActive) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Check Lockout
    if (admin.lockoutUntil && new Date(admin.lockoutUntil) > new Date()) {
      const waitMinutes = Math.ceil((new Date(admin.lockoutUntil) - new Date()) / 60000);
      throw new Error(`Account is locked due to repeated failed logins. Try again in ${waitMinutes} minutes.`);
    }

    // Verify Password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      admin.failedLogins = (admin.failedLogins || 0) + 1;
      if (admin.failedLogins >= MAX_FAILED_LOGINS) {
        admin.lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        await admin.save();
        await logAdminActivity({
          adminEmail: admin.email,
          action: 'ACCOUNT_LOCKOUT',
          entity: 'Admin',
          entityId: admin._id,
          summary: `Account locked for 15 minutes after 5 consecutive failed login attempts.`,
          req,
        });
        throw new Error('Account locked for 15 minutes due to multiple failed login attempts.');
      }
      await admin.save();
      throw new Error('Invalid email or password credentials.');
    }

    // Reset failed logins & update lastLogin
    admin.failedLogins = 0;
    admin.lockoutUntil = null;
    admin.lastLogin = new Date();
    admin.lastActive = new Date();
    await admin.save();

    // Generate tokens
    const family = admin._id.toString() + '_' + Date.now();
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin, family);

    // Save refresh token record in DB with tokenHash and 7-day expiration
    const tokenHash = hashValue(refreshToken);
    await RefreshToken.create({
      tokenHash,
      token: refreshToken,
      adminId: admin._id,
      family,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Set Cookies (both finasset and admin cookies for full compatibility)
    const cookieStore = await cookies();
    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 mins (short-term)
    };
    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days (long-term)
    };

    cookieStore.set(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
    cookieStore.set('admin_access_token', accessToken, accessCookieOptions);
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    cookieStore.set('admin_refresh_token', refreshToken, refreshCookieOptions);

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'LOGIN',
      entity: 'Admin',
      entityId: admin._id,
      summary: `Admin successfully authenticated session.`,
      req,
    });

    return {
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      accessToken,
    };
  },

  async refreshTokens() {
    await connectToDatabase();
    const cookieStore = await cookies();
    const oldRefreshToken =
      cookieStore.get(REFRESH_COOKIE_NAME)?.value ||
      cookieStore.get('admin_refresh_token')?.value;

    if (!oldRefreshToken) {
      throw new Error('No refresh token provided');
    }

    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded || !decoded.id) {
      throw new Error('Invalid refresh token');
    }

    const oldTokenHash = hashValue(oldRefreshToken);
    const storedToken = await RefreshToken.findOne({
      $or: [{ tokenHash: oldTokenHash }, { token: oldRefreshToken }],
    });

    // Reuse detection
    if (!storedToken) {
      if (decoded.family) {
        await RefreshToken.deleteMany({ family: decoded.family });
      }
      throw new Error('Refresh token reuse detected. All sessions invalidated.');
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      throw new Error('Admin not found or inactive');
    }

    // Rotate refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin, storedToken.family);

    const newTokenHash = hashValue(newRefreshToken);
    await RefreshToken.create({
      tokenHash: newTokenHash,
      token: newRefreshToken,
      adminId: admin._id,
      family: storedToken.family,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    };
    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    };

    cookieStore.set(ACCESS_COOKIE_NAME, newAccessToken, accessCookieOptions);
    cookieStore.set('admin_access_token', newAccessToken, accessCookieOptions);
    cookieStore.set(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);
    cookieStore.set('admin_refresh_token', newRefreshToken, refreshCookieOptions);

    return {
      accessToken: newAccessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  },

  async logout({ req }) {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token =
      cookieStore.get(REFRESH_COOKIE_NAME)?.value ||
      cookieStore.get('admin_refresh_token')?.value;

    if (token) {
      const tokenHash = hashValue(token);
      await RefreshToken.deleteOne({
        $or: [{ tokenHash }, { token }],
      }).catch(() => {});
    }

    cookieStore.delete(ACCESS_COOKIE_NAME);
    cookieStore.delete('admin_access_token');
    cookieStore.delete(REFRESH_COOKIE_NAME);
    cookieStore.delete('admin_refresh_token');

    return true;
  },

  async getMe(adminId) {
    await connectToDatabase();
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  },

  async forgotPassword({ email, req }) {
    await connectToDatabase();
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // Return true to avoid revealing existence
      return true;
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await PasswordResetToken.create({
      email: admin.email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'Admin',
      entityId: admin._id,
      summary: `Password reset token generated.`,
      req,
    });

    return true;
  },

  async resetPassword({ token, newPassword, req }) {
    await connectToDatabase();
    const resetRecord = await PasswordResetToken.findOne({ token, isUsed: false });
    if (!resetRecord || new Date(resetRecord.expiresAt) < new Date()) {
      throw new Error('Invalid or expired password reset token.');
    }

    const admin = await Admin.findOne({ email: resetRecord.email });
    if (!admin) {
      throw new Error('Account associated with reset token not found.');
    }

    admin.password = await hashPassword(newPassword);
    admin.failedLogins = 0;
    admin.lockoutUntil = null;
    await admin.save();

    resetRecord.isUsed = true;
    await resetRecord.save();

    // Revoke all existing sessions
    await RefreshToken.deleteMany({ adminId: admin._id });

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'Admin',
      entityId: admin._id,
      summary: `Admin password successfully updated via reset token.`,
      req,
    });

    return true;
  },
};

export default authService;
