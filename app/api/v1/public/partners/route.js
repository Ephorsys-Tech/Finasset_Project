import { connectToDatabase } from '@/backend/config/db';
import Partner from '@/backend/models/Partner';
import { sendSuccess } from '@/backend/utils/apiResponse';

export async function GET() {
  try {
    await connectToDatabase();
    const list = await Partner.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return sendSuccess(list || []);
  } catch (err) {
    console.error('Error fetching public partners:', err);
    return sendSuccess([]);
  }
}
