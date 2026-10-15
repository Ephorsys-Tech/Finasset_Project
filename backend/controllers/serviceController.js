import { serviceService } from '@/backend/services/serviceService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const serviceController = {
  async getPublishedServices() {
    try {
      const services = await serviceService.getPublishedServices();
      return sendSuccess(services);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getServiceBySlug(slug) {
    try {
      const service = await serviceService.getServiceBySlug(slug);
      return sendSuccess(service);
    } catch {
      return sendNotFound('Service not found');
    }
  },

  async getAllServicesAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const services = await serviceService.getAllServicesAdmin();
      return sendSuccess(services);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createService(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.slug) return sendBadRequest('Title and slug are required');
      const service = await serviceService.createService(body, auth.admin.email, req);
      return sendSuccess(service, 'Service created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateService(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Service ID required');

      const body = await req.json().catch(() => ({}));
      const service = await serviceService.updateService(id, body, auth.admin.email, req);
      return sendSuccess(service, 'Service updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteService(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Service ID required');

      await serviceService.deleteService(id, auth.admin.email, req);
      return sendSuccess(null, 'Service deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default serviceController;
