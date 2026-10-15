import { contentController } from '@/backend/controllers/contentController';

export async function GET() {
  return contentController.getSettings();
}
