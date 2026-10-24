import crypto from 'crypto';
import { connectToDatabase } from '@/backend/config/db';
import Admin from '@/backend/models/Admin';
import RefreshToken from '@/backend/models/RefreshToken';
import { authService } from '@/backend/services/authService';
import {
  validateRegister,
  validateLogin,
} from '@/backend/validators/authValidator';
import { sendSuccess, sendError, sendBadRequest, sendUnauthorized } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';
import sendEmail from '@/backend/utils/sendEmail';
import {
  hashValue,
  normalizeEmail,
  respond,
  getPasswordResetEmail,
  OTP_EXPIRY_MINUTES,
  RESET_TOKEN_EXPIRY_MINUTES,
} from '@/backend/utils/authHelpers';

const parseRequestBody = async (req) => {
  if (typeof req?.json === 'function') {
    return await req.json().catch(() => ({}));
  }
  if (req?.body && typeof req.body === 'object' && typeof req.body.getReader !== 'function') {
    return req.body;
  }
  return {};
};

//-------------------------------------------------------
//@description - Forget Admin Password
//@route - POST /api/v1/admin/forget-password
//@access Public
//-------------------------------------------------------
export const forgetPasswordAdmin = async (req, res) => {
  try {
    await connectToDatabase();
    const body = await parseRequestBody(req);
    const email = normalizeEmail(body?.email);
    if (!email) {
      return respond(res, 400, false, 'Email is Required');
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return respond(res, 404, false, 'No registered administrator account found with this email address');
    }

    // Check if SMTP_PASS is configured in environment
    if (!process.env.SMTP_PASS || !process.env.SMTP_PASS.trim()) {
      console.error('SMTP configuration error: SMTP_PASS is missing in environment variables.');
      return respond(
        res,
        500,
        false,
        'Email delivery failed: SMTP_PASS is missing in server environment (.env.local). Please configure your Gmail App Password.'
      );
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const emailContent = getPasswordResetEmail(otp);

    admin.passwordResetOtp = hashValue(otp);
    admin.passwordResetOtpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    admin.passwordResetToken = undefined;
    admin.passwordResetTokenExpires = undefined;
    admin.passwordResetVerified = false;

    await admin.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        to: admin.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });
    } catch (mailError) {
      // Rollback OTP fields if mail fails
      admin.passwordResetOtp = undefined;
      admin.passwordResetOtpExpires = undefined;
      admin.passwordResetVerified = false;
      await admin.save({ validateBeforeSave: false });

      console.error('Password Reset Mail Error:', mailError.message || mailError);
      return respond(
        res,
        500,
        false,
        `Email delivery failed: ${mailError.message || 'Unable to connect to SMTP server'}`
      );
    }

    return respond(res, 200, true, `A 6-digit verification OTP has been sent to ${admin.email}`);
  } catch (error) {
    console.error('Forget Password Error:', error);
    return respond(res, 500, false, 'Internal Server Error', { error: error.message });
  }
};

//-------------------------------------------------------
//@description - Verify Admin Password Reset OTP
//@route - POST /api/v1/admin/verify-reset-otp
//@access Public
//-------------------------------------------------------
export const verifyResetOtpAdmin = async (req, res) => {
  try {
    await connectToDatabase();
    const body = await parseRequestBody(req);
    const email = normalizeEmail(body?.email);
    const otp = body?.otp?.toString().trim();

    if (!email || !otp) {
      return respond(res, 400, false, 'Email and OTP are Required');
    }

    const admin = await Admin.findOne({ email }).select(
      '+passwordResetOtp +passwordResetOtpExpires +passwordResetToken +passwordResetTokenExpires +passwordResetVerified'
    );

    if (
      !admin ||
      !admin.passwordResetOtp ||
      !admin.passwordResetOtpExpires ||
      admin.passwordResetOtpExpires < new Date() ||
      admin.passwordResetOtp !== hashValue(otp)
    ) {
      return respond(res, 400, false, 'Invalid or expired OTP code. Please verify the 6-digit code sent to your email.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    admin.passwordResetOtp = undefined;
    admin.passwordResetOtpExpires = undefined;
    admin.passwordResetToken = hashValue(resetToken);
    admin.passwordResetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    admin.passwordResetVerified = true;

    await admin.save({ validateBeforeSave: false });

    return respond(res, 200, true, 'OTP verified successfully! You may now set your new password.', {
      data: {
        resetToken,
        expiresInMinutes: RESET_TOKEN_EXPIRY_MINUTES,
      },
    });
  } catch (error) {
    console.error('Verify Reset OTP Error:', error);
    return respond(res, 500, false, 'Internal Server Error', { error: error.message });
  }
};

//-------------------------------------------------------
//@description - Reset Admin Password
//@route - POST /api/v1/admin/reset-password
//@access Public
//-------------------------------------------------------
export const resetPasswordAdmin = async (req, res) => {
  try {
    await connectToDatabase();
    const body = await parseRequestBody(req);
    const email = normalizeEmail(body?.email);
    const resetToken = body?.resetToken?.trim();
    const { password, confirmPassword } = body || {};

    if (!email || !resetToken || !password || !confirmPassword) {
      return respond(res, 400, false, 'Email, reset token, password, and confirm password are Required');
    }

    if (password !== confirmPassword) {
      return respond(res, 400, false, 'Password and confirm password do not match');
    }

    if (password.length < 8) {
      return respond(res, 400, false, 'Password must be at least 8 characters long');
    }

    const admin = await Admin.findOne({ email }).select(
      '+password +passwordResetToken +passwordResetTokenExpires +passwordResetVerified'
    );

    if (
      !admin ||
      !admin.passwordResetVerified ||
      !admin.passwordResetToken ||
      !admin.passwordResetTokenExpires ||
      admin.passwordResetTokenExpires < new Date() ||
      admin.passwordResetToken !== hashValue(resetToken)
    ) {
      return respond(res, 400, false, 'Invalid or expired reset session. Please request a new OTP code.');
    }

    admin.password = password;
    admin.passwordResetToken = undefined;
    admin.passwordResetTokenExpires = undefined;
    admin.passwordResetVerified = false;

    await admin.save();

    // Revoke existing sessions upon password reset
    await RefreshToken.deleteMany({ adminId: admin._id }).catch(() => {});

    return respond(res, 200, true, 'Password updated successfully! Please sign in with your new password.');
  } catch (error) {
    console.error('Reset Password Error:', error);
    return respond(res, 500, false, 'Internal Server Error', { error: error.message });
  }
};

export const authController = {
  async register(req) {
    try {
      const body = await req.json().catch(() => ({}));
      const validation = validateRegister(body);
      if (!validation.success) {
        return sendBadRequest(validation.error.errors[0]?.message || 'Invalid registration input');
      }

      const result = await authService.register({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
        req,
      });

      return sendSuccess(result, 'Administrator registered successfully', 201);
    } catch (err) {
      return sendBadRequest(err.message);
    }
  },

  async login(req) {
    try {
      const body = await req.json().catch(() => ({}));
      const validation = validateLogin(body);
      if (!validation.success) {
        return sendBadRequest(validation.error.errors[0]?.message || 'Invalid input');
      }

      const result = await authService.login({
        email: body.email,
        password: body.password,
        req,
      });

      return sendSuccess(result, 'Authentication successful');
    } catch (err) {
      return sendError(err.message || 'Login failed', 401, err);
    }
  },

  async refresh() {
    try {
      const result = await authService.refreshTokens();
      return sendSuccess(result, 'Token refreshed successfully');
    } catch (err) {
      return sendUnauthorized(err.message || 'Session expired');
    }
  },

  async logout(req) {
    try {
      await authService.logout({ req });
      return sendSuccess(null, 'Logged out successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getMe(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const admin = await authService.getMe(auth.admin._id);
      return sendSuccess(admin);
    } catch (err) {
      return sendError(err.message, 404, err);
    }
  },

  forgetPasswordAdmin,
  verifyResetOtpAdmin,
  resetPasswordAdmin,
  forgotPassword: forgetPasswordAdmin,
  resetPassword: resetPasswordAdmin,
};

export default authController;
