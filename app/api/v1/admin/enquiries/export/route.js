import { enquiryController } from '@/backend/controllers/enquiryController';

export async function GET(req) {
  return enquiryController.exportCsv(req);
}
