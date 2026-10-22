import { nriController } from '@/backend/controllers/nriController';

export async function GET(req) {
  return nriController.getAllNriItemsAdmin(req);
}

export async function POST(req) {
  return nriController.createNriItem(req);
}

export async function PUT(req) {
  return nriController.updateNriItem(req);
}

export async function DELETE(req) {
  return nriController.deleteNriItem(req);
}
