import { adminService } from '@/backend/services/adminService';
import { sendSuccess, sendError, sendBadRequest } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const adminController = {
  async getDashboard(req) {
    try {
      const auth = await authenticateAdmin(req);
      if (!auth.success) return auth.response;

      const data = await adminService.getDashboard();
      return sendSuccess(data);
    } catch (err) {
      console.error('getDashboard Error:', err);
      return sendError(err.message, 500, err);
    }
  },

  async getActivityLogs(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const limit = url.searchParams.get('limit') || 100;
      const logs = await adminService.getActivityLogs(limit);
      return sendSuccess(logs);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getMedia(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const media = await adminService.getMedia();
      return sendSuccess(media);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async uploadMedia(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.url || !body.filename) return sendBadRequest('URL and filename required');
      const media = await adminService.uploadMedia(body, auth.admin.email, req);
      return sendSuccess(media, 'Media item saved successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteMedia(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Media ID required');

      await adminService.deleteMedia(id, auth.admin.email, req);
      return sendSuccess(null, 'Media item deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default adminController;
