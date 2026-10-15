import crypto from 'crypto';
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
  let authHeader = null;
  if (req && req.headers) {
    if (typeof req.headers.get === 'function') {
      authHeader = req.headers.get('authorization');
    } else if (typeof req.headers === 'object' && req.headers.authorization) {
      authHeader = req.headers.authorization;
    }
  }
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Try to read from cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      const cookieToken =
        cookieStore.get(ACCESS_COOKIE_NAME)?.value ||
        cookieStore.get('admin_access_token')?.value;
      if (cookieToken) {
        token = cookieToken;
      }
    } catch {
      // Cookie reading fallback
    }
  }

  // 3. Fallback to raw cookie header from request
  if (!token && req) {
    try {
      const rawCookies =
        (typeof req.headers?.get === 'function'
          ? req.headers.get('cookie')
          : req.headers?.cookie) || '';
      const match = rawCookies.match(/(?:finasset_access_token|admin_access_token)=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    } catch {
      // Fallback ignore
    }
  }

  let decoded = token ? verifyAccessToken(token) : null;

  // If access token is missing or expired, attempt automatic session recovery via refresh token:
  if (!decoded || !decoded.id) {
    let refreshToken = null;
    try {
      const cookieStore = await cookies();
      refreshToken =
        cookieStore.get(REFRESH_COOKIE_NAME)?.value ||
        cookieStore.get('admin_refresh_token')?.value;
    } catch {}

    if (!refreshToken && req) {
      try {
        const rawCookies =
          (typeof req.headers?.get === 'function'
            ? req.headers.get('cookie')
            : req.headers?.cookie) || '';
        const match = rawCookies.match(/(?:finasset_refresh_token|admin_refresh_token)=([^;]+)/);
        if (match) {
          refreshToken = decodeURIComponent(match[1]);
        }
      } catch {}
    }

    if (refreshToken) {
      const refreshDecoded = verifyRefreshToken(refreshToken);
      if (refreshDecoded && refreshDecoded.id) {
        const tokenHash = crypto.createHash('sha256').update(String(refreshToken)).digest('hex');
        const stored = await RefreshToken.findOne({
          $or: [{ tokenHash }, { token: refreshToken }],
          isRevoked: false,
          expiresAt: { $gt: new Date() },
        });

        if (stored) {
          const admin = await Admin.findById(refreshDecoded.id);
          if (admin && admin.isActive) {
            if (admin.lockoutUntil && new Date(admin.lockoutUntil) > new Date()) {
              return { authorized: false, error: 'Unauthorized: Account is temporarily locked' };
            }

            // Issue fresh access token (only set cookies on mutating methods to avoid Next.js GET cookie errors)
            const newAccessToken = generateAccessToken(admin);
            const reqMethod = req?.method || 'GET';
            if (reqMethod !== 'GET') {
              try {
                const cookieStore = await cookies();
                const opts = {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  path: '/',
                  maxAge: 15 * 60,
                };
                cookieStore.set(ACCESS_COOKIE_NAME, newAccessToken, opts);
                cookieStore.set('admin_access_token', newAccessToken, opts);
              } catch {}
            }

            return {
              authorized: true,
              admin,
              tokenData: {
                id: admin._id.toString(),
                email: admin.email,
                name: admin.name,
                role: admin.role,
              },
            };
          }
        }
      }
    }

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
