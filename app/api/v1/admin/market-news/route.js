import { connectToDatabase } from '@/backend/config/db';
import NewsItem from '@/backend/models/NewsItem';
import MarketIndex from '@/backend/models/MarketIndex';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';
import { logAdminActivity } from '@/backend/lib/auth';
import { cloudinary } from '@/backend/config/cloudinary';
import { fallbackMarketIndices } from '@/lib/fallbackData';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';

/**
 * Helper to delete Cloudinary asset safely
 */
async function deleteCloudinaryAsset(publicId) {
  if (!publicId || typeof publicId !== 'string') return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Failed to delete asset from Cloudinary:', err?.message || err);
  }
}

/**
 * GET - Retrieve all news items (admin view) & market indices
 */
export async function GET(req) {
  try {
    await connectToDatabase();

    let [indices, newsItems] = await Promise.all([
      MarketIndex.find({}).sort({ symbol: 1 }).lean().catch(() => []),
      NewsItem.find({}).sort({ order: 1, publishedAt: -1, createdAt: -1 }).lean().catch(() => []),
    ]);

    newsItems = newsItems || [];

    if (!indices || indices.length === 0) {
      indices = fallbackMarketIndices;
    }

    // Normalize any legacy documents
    const normalized = newsItems.map((item) => {
      const dateVal =
        item.date ||
        (item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '');
      return {
        ...item,
        description: item.description || item.summary || '',
        summary: item.summary || item.description || '',
        tag: item.tag || item.badge || 'Market Alert',
        badge: item.badge || item.tag || 'Market Alert',
        subTag: item.subTag || item.source || 'Advisory Desk',
        source: item.source || item.subTag || 'Advisory Desk',
        date: dateVal,
        readTime: item.readTime || '3 min Read',
        imageUrl: item.imageUrl || '',
      };
    });

    return sendSuccess({
      news: normalized,
      newsItems: normalized,
      indices: indices,
      total: normalized.length,
    });
  } catch (err) {
    console.error('Error fetching admin market news:', err);
    return sendError(err.message, 500, err);
  }
}

/**
 * POST - Create a new news story
 */
export async function POST(req) {
  const auth = await authenticateAdmin(req);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    // Validation
    const { title, description, summary, tag, badge, date, readTime, subTag, source, imageUrl, imagePublicId, tab, isPublished, isFeatured, order } = body;

    const finalTitle = (title || '').trim();
    const finalDescription = (description || summary || '').trim();
    const finalTag = (tag || badge || 'Tax Alert').trim();
    const finalSubTag = (subTag || source || 'Tax & Compliance Desk').trim();
    const finalDate = (date || '').trim();
    const finalReadTime = (readTime || '3 min Read').trim();
    const finalImageUrl = (imageUrl || '').trim();

    if (!finalTitle) {
      return sendBadRequest('Title is required');
    }
    if (!finalDescription) {
      return sendBadRequest('Description is required');
    }
    if (!finalTag) {
      return sendBadRequest('Tag is required (e.g. "Tax Alert")');
    }
    if (!finalSubTag) {
      return sendBadRequest('Sub tag is required (e.g. "Tax & Compliance Desk")');
    }
    if (!finalDate) {
      return sendBadRequest('Date with year is required (e.g. "11 Jan, 2025")');
    }
    if (!finalReadTime) {
      return sendBadRequest('Minutes of read is required (e.g. "3 min Read")');
    }
    if (!finalImageUrl) {
      return sendBadRequest('An image is required. Please upload an image.');
    }

    // Determine publishedAt date object from input date or current date
    let publishedAtDate = new Date();
    if (finalDate) {
      const parsed = new Date(finalDate);
      if (!isNaN(parsed.getTime())) {
        publishedAtDate = parsed;
      }
    }

    const currentCount = await NewsItem.countDocuments();

    const newNewsItem = await NewsItem.create({
      title: finalTitle,
      description: finalDescription,
      summary: finalDescription,
      tag: finalTag,
      badge: finalTag,
      subTag: finalSubTag,
      source: finalSubTag,
      date: finalDate,
      readTime: finalReadTime,
      imageUrl: finalImageUrl,
      imagePublicId: imagePublicId || '',
      publicUrl: finalImageUrl,
      tab: tab || 'market',
      order: typeof order === 'number' ? order : currentCount,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      publishedAt: publishedAtDate,
    });

    await logAdminActivity({
      adminEmail: auth.admin.email,
      action: 'CREATE_NEWS_ITEM',
      entity: 'NewsItem',
      entityId: newNewsItem._id,
      summary: `Published news article: "${finalTitle}"`,
      req,
    });

    return sendSuccess(newNewsItem, 'News item published successfully', 201);
  } catch (err) {
    console.error('Error creating news item:', err);
    return sendError(err.message, 500, err);
  }
}

/**
 * PUT - Update a news story (or update bulk indices)
 */
export async function PUT(req) {
  const auth = await authenticateAdmin(req);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    // If bulk indices or newsItems update
    if (body.indices && Array.isArray(body.indices)) {
      await MarketIndex.deleteMany({});
      await MarketIndex.insertMany(body.indices);
      await logAdminActivity({
        adminEmail: auth.admin.email,
        action: 'UPDATE_MARKET_INDICES',
        entity: 'MarketIndex',
        summary: 'Updated market indices',
        req,
      });
      return sendSuccess(null, 'Market indices updated successfully');
    }

    const id = body.id || body._id;
    if (!id) {
      return sendBadRequest('News item ID is required for updating');
    }

    const existing = await NewsItem.findById(id);
    if (!existing) {
      return sendNotFound('News item not found');
    }

    // Validation
    const finalTitle = body.title !== undefined ? body.title.trim() : existing.title;
    const finalDescription = body.description !== undefined ? body.description.trim() : (body.summary !== undefined ? body.summary.trim() : existing.description);
    const finalTag = body.tag !== undefined ? body.tag.trim() : (body.badge !== undefined ? body.badge.trim() : existing.tag);
    const finalSubTag = body.subTag !== undefined ? body.subTag.trim() : (body.source !== undefined ? body.source.trim() : existing.subTag);
    const finalDate = body.date !== undefined ? body.date.trim() : existing.date;
    const finalReadTime = body.readTime !== undefined ? body.readTime.trim() : existing.readTime;
    const finalImageUrl = body.imageUrl !== undefined ? body.imageUrl.trim() : existing.imageUrl;
    const finalImagePublicId = body.imagePublicId !== undefined ? body.imagePublicId.trim() : existing.imagePublicId;

    if (!finalTitle) return sendBadRequest('Title cannot be empty');
    if (!finalDescription) return sendBadRequest('Description cannot be empty');
    if (!finalTag) return sendBadRequest('Tag cannot be empty');
    if (!finalSubTag) return sendBadRequest('Sub tag cannot be empty');
    if (!finalDate) return sendBadRequest('Date cannot be empty');
    if (!finalReadTime) return sendBadRequest('Read time cannot be empty');
    if (!finalImageUrl) return sendBadRequest('Image URL cannot be empty');

    // If image has changed and old image had a Cloudinary publicId, delete old asset from Cloudinary
    if (existing.imagePublicId && finalImagePublicId && existing.imagePublicId !== finalImagePublicId) {
      await deleteCloudinaryAsset(existing.imagePublicId);
    }

    let publishedAtDate = existing.publishedAt;
    if (finalDate && finalDate !== existing.date) {
      const parsed = new Date(finalDate);
      if (!isNaN(parsed.getTime())) {
        publishedAtDate = parsed;
      }
    }

    existing.title = finalTitle;
    existing.description = finalDescription;
    existing.summary = finalDescription;
    existing.tag = finalTag;
    existing.badge = finalTag;
    existing.subTag = finalSubTag;
    existing.source = finalSubTag;
    existing.date = finalDate;
    existing.readTime = finalReadTime;
    existing.imageUrl = finalImageUrl;
    existing.imagePublicId = finalImagePublicId;
    existing.publicUrl = finalImageUrl;
    if (body.tab !== undefined) existing.tab = body.tab;
    if (body.isPublished !== undefined) existing.isPublished = Boolean(body.isPublished);
    if (body.isFeatured !== undefined) existing.isFeatured = Boolean(body.isFeatured);
    if (typeof body.order === 'number') existing.order = body.order;
    existing.publishedAt = publishedAtDate;

    await existing.save();

    await logAdminActivity({
      adminEmail: auth.admin.email,
      action: 'UPDATE_NEWS_ITEM',
      entity: 'NewsItem',
      entityId: existing._id,
      summary: `Updated news article: "${finalTitle}"`,
      req,
    });

    return sendSuccess(existing, 'News item updated successfully');
  } catch (err) {
    console.error('Error updating news item:', err);
    return sendError(err.message, 500, err);
  }
}

/**
 * DELETE - Delete a news story and clean up remote Cloudinary asset
 */
export async function DELETE(req) {
  const auth = await authenticateAdmin(req);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id || body._id;
    }

    if (!id) {
      return sendBadRequest('News item ID is required for deletion');
    }

    const item = await NewsItem.findById(id);
    if (!item) {
      return sendNotFound('News item not found');
    }

    // Clean up remote asset on Cloudinary if publicId exists
    if (item.imagePublicId) {
      await deleteCloudinaryAsset(item.imagePublicId);
    }

    await NewsItem.findByIdAndDelete(id);

    await logAdminActivity({
      adminEmail: auth.admin.email,
      action: 'DELETE_NEWS_ITEM',
      entity: 'NewsItem',
      entityId: id,
      summary: `Deleted news article: "${item.title}"`,
      req,
    });

    return sendSuccess({ id }, 'News item deleted and remote asset removed successfully');
  } catch (err) {
    console.error('Error deleting news item:', err);
    return sendError(err.message, 500, err);
  }
}
