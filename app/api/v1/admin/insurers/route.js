import { investorController } from '@/backend/controllers/investorController';

export async function GET(req) {
  return investorController.getAllInsurersAdmin(req);
}

export async function POST(req) {
  return investorController.createInsurer(req);
}

export async function PUT(req) {
  return investorController.updateInsurer(req);
}

export async function DELETE(req) {
  return investorController.deleteInsurer(req);
}
