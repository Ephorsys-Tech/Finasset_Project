import { videoService } from '@/backend/services/videoService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const videoController = {
  async getPublishedVideos() {
    try {
      const videos = await videoService.getPublishedVideos();
      return sendSuccess(videos);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllVideos(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const videos = await videoService.getAllVideosAdmin();
      return sendSuccess(videos);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createVideo(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.videoUrl) {
        return sendBadRequest('Title and YouTube Video URL are required');
      }

      const video = await videoService.createVideo(body, auth.admin.email, req);
      return sendSuccess(video, 'Video uploaded successfully', 201);
    } catch (err) {
      return sendBadRequest(err.message);
    }
  },

  async updateVideo(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Video ID is required');

      const video = await videoService.updateVideo(id, body, auth.admin.email, req);
      return sendSuccess(video, 'Video updated successfully');
    } catch (err) {
      return sendBadRequest(err.message);
    }
  },

  async deleteVideo(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;

      if (!id) return sendBadRequest('Video ID is required');

      await videoService.deleteVideo(id, auth.admin.email, req);
      return sendSuccess(null, 'Video removed successfully');
    } catch (err) {
      return sendBadRequest(err.message);
    }
  },
};

export default videoController;
