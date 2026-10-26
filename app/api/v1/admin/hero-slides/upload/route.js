import { cloudinary } from '@/backend/config/cloudinary';
import { config } from '@/backend/config/env';
import { sendSuccess, sendError, sendBadRequest } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export async function POST(req) {
  const auth = await authenticateAdmin(req);
  if (!auth.success) return auth.response;

  try {
    if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
      return sendError(
        'Cloudinary is not configured. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.',
        500
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let dataUri = '';
    let originalFilename = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file || typeof file === 'string') {
        return sendBadRequest('No image file provided in form data');
      }

      if (!file.type || !file.type.startsWith('image/')) {
        return sendBadRequest('Invalid file type. Only image files (PNG, JPG, JPEG, WEBP, SVG) are allowed.');
      }

      if (file.size > 10 * 1024 * 1024) {
        return sendBadRequest('File too large. Maximum allowed image size is 10MB.');
      }

      originalFilename = file.name || 'hero-slide-banner';
      const buffer = Buffer.from(await file.arrayBuffer());
      dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      const body = await req.json().catch(() => ({}));
      if (!body.file) {
        return sendBadRequest('No image data provided');
      }

      if (!body.file.startsWith('data:image/')) {
        return sendBadRequest('Invalid file format. Only images (PNG, JPG, JPEG, WEBP, SVG) are allowed.');
      }

      dataUri = body.file;
      originalFilename = body.filename || 'hero-slide-banner';
    }

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'finasset_wealth/hero_slides',
      resource_type: 'image',
      tags: ['finasset_wealth', 'hero_slide', 'banner'],
      filename_override: originalFilename.replace(/\.[^/.]+$/, ''),
    });

    return sendSuccess(
      {
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        publicUrl: uploadResult.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      },
      'Hero banner image uploaded to Cloudinary successfully',
      201
    );
  } catch (err) {
    console.error('Cloudinary hero slide upload error:', err);
    return sendError(`Cloudinary Upload Failed: ${err.message}`, 500, err);
  }
}

export async function DELETE(req) {
  const auth = await authenticateAdmin(req);
  if (!auth.success) return auth.response;

  try {
    const url = new URL(req.url);
    let publicId = url.searchParams.get('publicId');

    if (!publicId) {
      const body = await req.json().catch(() => ({}));
      publicId = body.publicId;
    }

    if (!publicId) {
      return sendBadRequest('Cloudinary publicId is required for deletion');
    }

    const destroyResult = await cloudinary.uploader.destroy(publicId);

    return sendSuccess(
      { result: destroyResult, publicId },
      'Hero banner image deleted from Cloudinary successfully'
    );
  } catch (err) {
    console.error('Cloudinary hero slide delete error:', err);
    return sendError(`Cloudinary Delete Failed: ${err.message}`, 500, err);
  }
}
