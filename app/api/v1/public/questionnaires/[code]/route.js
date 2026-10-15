import { investorController } from '@/backend/controllers/investorController';

export async function GET(req, { params }) {
  const { code } = await params;
  return investorController.getQuestionnaire(code);
}
