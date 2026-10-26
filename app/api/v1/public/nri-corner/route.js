import { nriController } from '@/backend/controllers/nriController';

export async function GET() {
  return nriController.getPublishedNriItems();
}
