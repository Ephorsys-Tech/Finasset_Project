import { homeService } from '@/backend/services/homeService';
import { sendSuccess, sendError } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const homeController = {
  async getHomeData() {
    try {
      const data = await homeService.getHomeData();
      return sendSuccess(data);
    } catch (err) {
      return sendError('Failed to fetch homepage data', 500, err);
    }
  },

  async updateHeroSlides(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      const slides = body.heroSlides || [];
      const updated = await homeService.updateHeroSlides(slides, auth.admin.email, req);
      return sendSuccess(updated, 'Hero slides updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default homeController;
