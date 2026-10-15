import { adminController } from '@/backend/controllers/adminController';

export async function GET(req) {
  return adminController.getDashboard(req);
}
