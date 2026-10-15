import { serviceController } from '@/backend/controllers/serviceController';

export async function GET(req) {
  return serviceController.getAllServicesAdmin(req);
}

export async function POST(req) {
  return serviceController.createService(req);
}

export async function PUT(req) {
  return serviceController.updateService(req);
}

export async function DELETE(req) {
  return serviceController.deleteService(req);
}
