import { investorController } from '@/backend/controllers/investorController';

export async function GET() {
  return investorController.getInvestorTools();
}
