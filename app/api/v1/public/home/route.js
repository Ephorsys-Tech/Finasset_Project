import { homeController } from '@/backend/controllers/homeController';

export async function GET() {
  return homeController.getHomeData();
}
