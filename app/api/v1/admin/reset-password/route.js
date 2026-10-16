import { resetPasswordAdmin } from '@/backend/controllers/authController';

export async function POST(req) {
  return resetPasswordAdmin(req);
}
