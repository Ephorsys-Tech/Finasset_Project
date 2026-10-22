import { nriService } from '@/backend/services/nriService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const nriController = {
  async getPublishedNriItems() {
    try {
      const items = await nriService.getPublishedNriItems();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllNriItemsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const items = await nriService.getAllNriItemsAdmin();
      return sendSuccess(items);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createNriItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.description) {
        return sendBadRequest('Title and description are required');
      }

      const item = await nriService.createNriItem(body, auth.admin.email, req);
      return sendSuccess(item, 'NRI topic created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateNriItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('NRI topic ID is required');

      const { id: _bodyId, _id, ...updateData } = body;
      const item = await nriService.updateNriItem(id, updateData, auth.admin.email, req);
      return sendSuccess(item, 'NRI topic updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteNriItem(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('NRI topic ID is required');

      await nriService.deleteNriItem(id, auth.admin.email, req);
      return sendSuccess(null, 'NRI topic deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default nriController;
