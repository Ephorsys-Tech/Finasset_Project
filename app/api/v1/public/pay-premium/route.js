import { payPremiumController } from '@/backend/controllers/payPremiumController';

export async function GET() {
  return payPremiumController.getPublishedPayPremiums();
}
