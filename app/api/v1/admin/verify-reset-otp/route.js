import { verifyResetOtpAdmin } from '@/backend/controllers/authController';

export async function POST(req) {
  return verifyResetOtpAdmin(req);
}
