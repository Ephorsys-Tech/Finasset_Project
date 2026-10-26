import { connectToDatabase } from '@/backend/config/db';
import Video from '@/backend/models/Video';
import { logAdminActivity } from '@/backend/lib/auth';
import { fallbackFinancialVideo } from '@/lib/fallbackData';

function getYouTubeId(url = '') {
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const videoService = {
  getYouTubeId,

  /**
   * Fetch published videos for public showcase (Max 4)
   */
  async getPublishedVideos() {
    try {
      await connectToDatabase();
      const videos = await Video.find({ isPublished: true })
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(4)
        .lean();

      if (videos && videos.length > 0) {
        return videos;
      }
      return [fallbackFinancialVideo];
    } catch (err) {
      console.warn('Failed to load published videos from DB, using fallback:', err.message);
      return [fallbackFinancialVideo];
    }
  },

  /**
   * Fetch all videos for admin management (Max 4)
   */
  async getAllVideosAdmin() {
    await connectToDatabase();
    return Video.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
  },

  /**
   * Create a new video link
   * Strictly enforces MAX 4 VIDEOS
   */
  async createVideo(data, adminEmail, req) {
    await connectToDatabase();

    const count = await Video.countDocuments();
    if (count >= 4) {
      throw new Error('Maximum limit reached: You can only upload up to 4 videos. Please delete an existing video to upload a new one.');
    }

    const title = (data.title || '').trim();
    const videoUrl = (data.videoUrl || data.url || '').trim();
    if (!title) throw new Error('Video title is required.');
    if (!videoUrl) throw new Error('YouTube video URL is required.');

    const ytId = getYouTubeId(videoUrl);
    if (!ytId && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      throw new Error('Please provide a valid YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).');
    }

    const thumbnailUrl =
      data.thumbnailUrl ||
      (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

    const video = await Video.create({
      title,
      videoUrl,
      description: (data.description || '').trim(),
      duration: (data.duration || '').trim(),
      thumbnailUrl,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : count,
      isPublished: data.isPublished !== false,
    });

    await logAdminActivity({
      adminEmail,
      action: 'CREATE',
      entity: 'Video',
      entityId: video._id.toString(),
      summary: `Uploaded YouTube video: "${video.title}" (${video.videoUrl}).`,
      req,
    });

    return video;
  },

  /**
   * Update an existing video
   */
  async updateVideo(id, data, adminEmail, req) {
    await connectToDatabase();

    const video = await Video.findById(id);
    if (!video) throw new Error('Video not found');

    const updateFields = {};
    if (data.title !== undefined) updateFields.title = String(data.title).trim();
    if (data.description !== undefined) updateFields.description = String(data.description).trim();
    if (data.duration !== undefined) updateFields.duration = String(data.duration).trim();
    if (data.displayOrder !== undefined) updateFields.displayOrder = Number(data.displayOrder);
    if (data.isPublished !== undefined) updateFields.isPublished = Boolean(data.isPublished);

    if (data.videoUrl !== undefined) {
      const videoUrl = String(data.videoUrl).trim();
      const ytId = getYouTubeId(videoUrl);
      if (!ytId && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        throw new Error('Please provide a valid YouTube video link.');
      }
      updateFields.videoUrl = videoUrl;
      if (!data.thumbnailUrl && ytId) {
        updateFields.thumbnailUrl = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
    if (data.thumbnailUrl !== undefined) updateFields.thumbnailUrl = String(data.thumbnailUrl).trim();

    const updated = await Video.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE',
      entity: 'Video',
      entityId: id,
      summary: `Updated video: "${updated.title}".`,
      req,
    });

    return updated;
  },

  /**
   * Delete a video
   */
  async deleteVideo(id, adminEmail, req) {
    await connectToDatabase();

    const video = await Video.findById(id);
    if (!video) throw new Error('Video not found');

    await Video.findByIdAndDelete(id);

    await logAdminActivity({
      adminEmail,
      action: 'DELETE',
      entity: 'Video',
      entityId: id,
      summary: `Deleted video: "${video.title}" (${video.videoUrl}).`,
      req,
    });

    return true;
  },
};

export default videoService;
