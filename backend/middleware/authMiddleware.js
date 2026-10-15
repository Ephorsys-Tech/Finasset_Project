import { verifyAdminRequest } from '@/backend/lib/auth';
import { sendUnauthorized, sendForbidden } from '@/backend/utils/apiResponse';

export async function authenticateAdmin(req) {
  const result = await verifyAdminRequest(req);
  if (!result.authorized) {
    return {
      success: false,
      response: sendUnauthorized(result.error),
    };
  }
  return {
    success: true,
    admin: result.admin,
    tokenData: result.tokenData,
  };
}

export default authenticateAdmin;
