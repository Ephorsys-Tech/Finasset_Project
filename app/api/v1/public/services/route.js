import { serviceController } from '@/backend/controllers/serviceController';

export async function GET() {
  return serviceController.getPublishedServices();
}
