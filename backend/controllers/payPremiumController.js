import { payPremiumService } from '@/backend/services/payPremiumService';
import { sendSuccess, sendError, sendBadRequest } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const payPremiumController = {
  async getPublishedPayPremiums() {
    try {
      const items = await payPremiumService.getPublishedPayPremiums();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllPayPremiumsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const items = await payPremiumService.getAllPayPremiumsAdmin();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createPayPremium(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.description || !body.link) {
        return sendBadRequest('Title, description, and payment link are required');
      }

      const item = await payPremiumService.createPayPremium(body, auth.admin.email, req);
      return sendSuccess(item, 'Pay Premium item created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updatePayPremium(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Pay Premium item ID is required');

      const { id: _bodyId, _id, ...updateData } = body;
      const item = await payPremiumService.updatePayPremium(id, updateData, auth.admin.email, req);
      return sendSuccess(item, 'Pay Premium item updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deletePayPremium(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Pay Premium item ID is required');

      await payPremiumService.deletePayPremium(id, auth.admin.email, req);
      return sendSuccess(null, 'Pay Premium item deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default payPremiumController;
