import { authService } from '@/backend/services/authService';
import { validateLogin, validateForgotPassword, validateResetPassword } from '@/backend/validators/authValidator';
import { sendSuccess, sendError, sendBadRequest, sendUnauthorized } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const authController = {
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

  async forgotPassword(req) {
    try {
      const body = await req.json().catch(() => ({}));
      const validation = validateForgotPassword(body);
      if (!validation.success) {
        return sendBadRequest(validation.error.errors[0]?.message || 'Invalid email');
      }

      await authService.forgotPassword({ email: body.email, req });
      return sendSuccess(null, 'If an account exists, a password reset link has been dispatched.');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async resetPassword(req) {
    try {
      const body = await req.json().catch(() => ({}));
      const validation = validateResetPassword(body);
      if (!validation.success) {
        return sendBadRequest(validation.error.errors[0]?.message || 'Invalid input');
      }

      await authService.resetPassword({
        token: body.token,
        newPassword: body.newPassword,
        req,
      });
      return sendSuccess(null, 'Password updated successfully. Please log in.');
    } catch (err) {
      return sendBadRequest(err.message);
    }
  },
};

export default authController;
