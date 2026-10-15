import { contentController } from '@/backend/controllers/contentController';

export async function GET(req) {
  return contentController.getAllPagesAdmin(req);
}

export async function POST(req) {
  return contentController.createPage(req);
}

export async function PUT(req) {
  return contentController.updatePage(req);
}

export async function DELETE(req) {
  return contentController.deletePage(req);
}
