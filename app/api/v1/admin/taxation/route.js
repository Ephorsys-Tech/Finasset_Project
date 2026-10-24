import { taxationController } from '@/backend/controllers/taxationController';

export async function GET(req) {
  return taxationController.getAllTaxationItemsAdmin(req);
}

export async function POST(req) {
  return taxationController.createTaxationItem(req);
}

export async function PUT(req) {
  return taxationController.updateTaxationItem(req);
}

export async function DELETE(req) {
  return taxationController.deleteTaxationItem(req);
}
