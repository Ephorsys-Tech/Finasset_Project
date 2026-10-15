import { forgetPasswordAdmin } from '@/backend/controllers/authController';

export async function POST(req) {
  return forgetPasswordAdmin(req);
}
