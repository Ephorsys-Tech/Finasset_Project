import { contentController } from '@/backend/controllers/contentController';

export async function GET() {
  return contentController.getMenus();
}

export async function PUT(req) {
  return contentController.updateMenu(req);
}
