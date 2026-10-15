import { connectToDatabase } from '@/backend/config/db';
import Enquiry from '@/backend/models/Enquiry';
import Service from '@/backend/models/Service';
import BlogPost from '@/backend/models/BlogPost';
import ActivityLog from '@/backend/models/ActivityLog';
import Media from '@/backend/models/Media';
import { logAdminActivity } from '@/backend/lib/auth';
import { cloudinary } from '@/backend/config/cloudinary';
import { config } from '@/backend/config/env';

export const adminService = {
  async getDashboard() {
    await connectToDatabase();

    const [
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      resolvedEnquiries,
      servicesCount,
      blogCount,
      recentEnquiries,
      recentActivities,
    ] = await Promise.all([
      Enquiry.countDocuments({}),
      Enquiry.countDocuments({ status: 'NEW' }),
      Enquiry.countDocuments({ status: 'IN_PROGRESS' }),
      Enquiry.countDocuments({ status: 'RESOLVED' }),
      Service.countDocuments({ isPublished: true }),
      BlogPost.countDocuments({ isPublished: true }),
      Enquiry.find({}).sort({ createdAt: -1 }).limit(6).lean(),
      ActivityLog.find({}).sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    return {
      metrics: {
        totalEnquiries,
        newEnquiries,
        inProgressEnquiries,
        resolvedEnquiries,
        servicesCount,
        blogCount,
      },
      recentEnquiries,
      recentActivities,
    };
  },

  async getActivityLogs(limit = 100) {
    await connectToDatabase();
    return ActivityLog.find({}).sort({ createdAt: -1 }).limit(Number(limit)).lean();
  },

  async getMedia() {
    await connectToDatabase();
    return Media.find({}).sort({ createdAt: -1 }).lean();
  },

  async uploadMedia(data, adminEmail, req) {
    await connectToDatabase();

    let mediaData = {
      filename: data.filename || 'media-asset',
      url: data.url,
      altText: data.altText || data.filename || '',
      category: data.category || 'general',
      publicId: data.publicId || '',
      mimeType: data.mimeType || 'image/jpeg',
      fileSizeBytes: data.fileSizeBytes || 0,
    };

    // If base64 file data is passed, upload to Cloudinary
    if (data.file && data.file.startsWith('data:')) {
      if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
        throw new Error(
          'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local'
        );
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(data.file, {
          folder: 'finasset_wealth',
          resource_type: 'auto',
          tags: ['finasset_wealth', data.category || 'general'],
        });

        mediaData = {
          filename: data.filename || uploadResult.original_filename || 'cloudinary-image',
          url: uploadResult.secure_url,
          altText: data.altText || data.filename || '',
          category: data.category || 'general',
          publicId: uploadResult.public_id,
          mimeType: `${uploadResult.resource_type}/${uploadResult.format}`,
          fileSizeBytes: uploadResult.bytes || 0,
        };
      } catch (cloudErr) {
        throw new Error(`Cloudinary Upload Failed: ${cloudErr.message}`);
      }
    }

    const media = await Media.create(mediaData);
    await logAdminActivity({
      adminEmail,
      action: 'UPLOAD_MEDIA',
      entity: 'Media',
      entityId: media._id,
      summary: `Uploaded media: ${media.filename} (${media.url})`,
      req,
    });

    return media;
  },

  async deleteMedia(id, adminEmail, req) {
    await connectToDatabase();
    const media = await Media.findById(id);
    if (!media) throw new Error('Media not found');

    // If hosted on Cloudinary, delete remote asset
    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
      } catch (err) {
        console.warn('Could not delete asset from Cloudinary:', err.message);
      }
    }

    await Media.findByIdAndDelete(id);

    await logAdminActivity({
      adminEmail,
      action: 'DELETE_MEDIA',
      entity: 'Media',
      entityId: id,
      summary: `Deleted media: ${media.filename}`,
      req,
    });

    return true;
  },
};

export default adminService;
