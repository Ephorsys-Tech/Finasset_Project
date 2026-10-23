import { homeService } from '@/backend/services/homeService';
import { sendSuccess, sendError } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const homeController = {
  async getHomeData(req, isAdmin = false) {
    try {
      const data = await homeService.getHomeData(isAdmin);
      return sendSuccess(data);
    } catch (err) {
      return sendError('Failed to fetch homepage data', 500, err);
    }
  },

  async createHeroSlide(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      const slide = await homeService.createHeroSlide(body, auth.admin.email, req);
      return sendSuccess(slide, 'Hero slide created successfully', 201);
    } catch (err) {
      return sendError(err.message, 400, err);
    }
  },

  async updateHeroSlides(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      // Single slide update if ID is provided and no bulk heroSlides array
      if (id && !Array.isArray(body.heroSlides)) {
        const updated = await homeService.updateHeroSlide(id, body, auth.admin.email, req);
        return sendSuccess(updated, 'Hero slide updated successfully');
      }

      // Bulk update
      const slides = body.heroSlides || [];
      const updated = await homeService.updateHeroSlides(slides, auth.admin.email, req);
      return sendSuccess(updated, 'Hero slides updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteHeroSlide(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendError('Slide ID required', 400);

      const deleted = await homeService.deleteHeroSlide(id, auth.admin.email, req);
      return sendSuccess(deleted, 'Hero slide and associated Cloudinary image deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default homeController;
