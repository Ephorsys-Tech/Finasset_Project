import { connectToDatabase } from '@/backend/config/db';
import Testimonial from '@/backend/models/Testimonial';
import { sendSuccess, sendError } from '@/backend/utils/apiResponse';
import { fallbackTestimonials } from '@/lib/fallbackData';

export async function GET() {
  try {
    await connectToDatabase();
    const list = await Testimonial.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    const data = list && list.length > 0 ? list : fallbackTestimonials || [];
    return sendSuccess(data);
  } catch (err) {
    console.error('Error fetching public testimonials:', err);
    return sendSuccess(fallbackTestimonials || []);
  }
}
