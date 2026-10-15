import { authController } from '@/backend/controllers/authController';

export async function POST(req) {
  return authController.login(req);
}
