import { adminController } from '@/backend/controllers/adminController';

export async function GET(req) {
  return adminController.getMedia(req);
}

export async function POST(req) {
  return adminController.uploadMedia(req);
}

export async function DELETE(req) {
  return adminController.deleteMedia(req);
}
