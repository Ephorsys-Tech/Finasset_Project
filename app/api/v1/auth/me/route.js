import { authController } from '@/backend/controllers/authController';

export async function GET(req) {
  return authController.getMe(req);
}
