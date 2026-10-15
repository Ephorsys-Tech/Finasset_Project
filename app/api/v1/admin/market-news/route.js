import { contentController } from '@/backend/controllers/contentController';

export async function GET() {
  return contentController.getMarketData();
}

export async function PUT(req) {
  return contentController.updateMarketNews(req);
}
