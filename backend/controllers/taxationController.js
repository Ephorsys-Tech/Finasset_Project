import { taxationService } from '@/backend/services/taxationService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const taxationController = {
  async getPublishedTaxationItems() {
    try {
      const items = await taxationService.getPublishedTaxationItems();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllTaxationItemsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const items = await taxationService.getAllTaxationItemsAdmin();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createTaxationItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.description) {
        return sendBadRequest('Title and description are required');
      }

      const item = await taxationService.createTaxationItem(body, auth.admin.email, req);
      return sendSuccess(item, 'Taxation topic created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateTaxationItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Taxation topic ID is required');

      const { id: _bodyId, _id, ...updateData } = body;
      const item = await taxationService.updateTaxationItem(id, updateData, auth.admin.email, req);
      return sendSuccess(item, 'Taxation topic updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteTaxationItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Taxation topic ID is required');

      await taxationService.deleteTaxationItem(id, auth.admin.email, req);
      return sendSuccess(null, 'Taxation topic deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default taxationController;
