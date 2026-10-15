import { adminController } from '@/backend/controllers/adminController';

export async function GET(req) {
  return adminController.getActivityLogs(req);
}
