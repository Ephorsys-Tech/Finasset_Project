import { homeController } from '@/backend/controllers/homeController';

export async function GET(req) {
  return homeController.getHomeData(req, true);
}

export async function POST(req) {
  return homeController.createHeroSlide(req);
}

export async function PUT(req) {
  return homeController.updateHeroSlides(req);
}

export async function DELETE(req) {
  return homeController.deleteHeroSlide(req);
}

