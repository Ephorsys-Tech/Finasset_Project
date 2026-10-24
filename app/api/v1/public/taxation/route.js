import { taxationController } from '@/backend/controllers/taxationController';

export async function GET() {
  return taxationController.getPublishedTaxationItems();
}
