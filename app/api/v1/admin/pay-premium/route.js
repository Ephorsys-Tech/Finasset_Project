import { payPremiumController } from '@/backend/controllers/payPremiumController';

export async function GET(req) {
  return payPremiumController.getAllPayPremiumsAdmin(req);
}

export async function POST(req) {
  return payPremiumController.createPayPremium(req);
}

export async function PUT(req) {
  return payPremiumController.updatePayPremium(req);
}

export async function DELETE(req) {
  return payPremiumController.deletePayPremium(req);
}
