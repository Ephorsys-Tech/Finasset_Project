import { homeController } from '@/backend/controllers/homeController';

export async function GET() {
  return homeController.getHomeData();
}

export async function PUT(req) {
  return homeController.updateHeroSlides(req);
}
