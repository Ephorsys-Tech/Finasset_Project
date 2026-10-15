import { contentController } from '@/backend/controllers/contentController';

export async function GET() {
  return contentController.getSettings();
}

export async function PUT(req) {
  return contentController.updateSettings(req);
}
