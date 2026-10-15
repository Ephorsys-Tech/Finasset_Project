import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/backend/config/db';
import { config } from '@/backend/config/env';
import Admin from '@/backend/models/Admin';
import RefreshToken from '@/backend/models/RefreshToken';
import ActivityLog from '@/backend/models/ActivityLog';

export const ACCESS_COOKIE_NAME = 'finasset_access_token';
export const REFRESH_COOKIE_NAME = 'finasset_refresh_token';

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 12);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(admin) {
  return jwt.sign(
    {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
    },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY || '15m' }
  );
}

export function generateRefreshToken(admin, family) {
  return jwt.sign(
    {
      id: admin._id.toString(),
      family: family || admin._id.toString() + '_' + Date.now(),
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY || '7d' }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
}

/**
 * Verify request has valid admin credentials
 * Checks HttpOnly cookie or Authorization: Bearer <token>
 */
export async function verifyAdminRequest(req) {
  await connectToDatabase();

  let token = null;

  // 1. Try to read from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Try to read from cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      const cookieToken = cookieStore.get(ACCESS_COOKIE_NAME);
      if (cookieToken) {
        token = cookieToken.value;
      }
    } catch {
      // Cookie reading fallback
    }
  }

  if (!token) {
    return { authorized: false, error: 'Unauthorized: No token provided' };
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || !decoded.id) {
    return { authorized: false, error: 'Unauthorized: Invalid or expired access token', isExpired: true };
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin || !admin.isActive) {
    return { authorized: false, error: 'Unauthorized: Admin account is inactive or not found' };
  }

  // Check lockout status
  if (admin.lockoutUntil && new Date(admin.lockoutUntil) > new Date()) {
    return { authorized: false, error: 'Unauthorized: Account is temporarily locked due to security policy' };
  }

  return { authorized: true, admin, tokenData: decoded };
}

/**
 * Audit log helper
 */
export async function logAdminActivity({
  adminEmail,
  action,
  entity,
  entityId = '',
  summary,
  req = null,
}) {
  try {
    await connectToDatabase();
    let ipAddress = 'unknown';
    if (req) {
      ipAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';
    }

    await ActivityLog.create({
      adminEmail,
      action,
      entity,
      entityId: String(entityId),
      summary,
      ipAddress,
    });
  } catch (err) {
    console.error('Failed to write audit activity log:', err.message);
  }
}

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAdminRequest,
  logAdminActivity,
};
