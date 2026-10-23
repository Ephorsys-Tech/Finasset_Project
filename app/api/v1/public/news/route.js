import { connectToDatabase } from '@/backend/config/db';
import NewsItem from '@/backend/models/NewsItem';
import { sendSuccess } from '@/backend/utils/apiResponse';

export async function GET() {
  try {
    await connectToDatabase();
    const items = await NewsItem.find({ isPublished: true })
      .sort({ order: 1, publishedAt: -1, createdAt: -1 })
      .lean();

    if (!items || items.length === 0) {
      return sendSuccess([]);
    }

    // Normalize any legacy documents
    const normalized = items.map((item) => {
      const dateVal =
        item.date ||
        (item.publishedAt
          ? typeof item.publishedAt === 'string'
            ? item.publishedAt
            : new Date(item.publishedAt).toLocaleDateString('en-GB', {
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

    return sendSuccess(normalized);
  } catch (err) {
    console.error('Error fetching public news:', err);
    return sendSuccess([]);
  }
}
