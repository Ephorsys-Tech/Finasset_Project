import { contentController } from '@/backend/controllers/contentController';

export async function GET(req) {
  return contentController.getAllPartnersAdmin(req);
}

export async function POST(req) {
  return contentController.createPartner(req);
}

export async function PUT(req) {
  return contentController.updatePartner(req);
}

export async function DELETE(req) {
  return contentController.deletePartner(req);
}
