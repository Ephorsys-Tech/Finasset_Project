import { investorController } from '@/backend/controllers/investorController';

export async function GET(req) {
  return investorController.getAllInvestorToolsAdmin(req);
}

export async function PUT(req) {
  return investorController.updateInvestorTools(req);
}
