import { investorController } from '@/backend/controllers/investorController';

export async function GET(req) {
  return investorController.getInsurers(req);
}
