import { enquiryController } from '@/backend/controllers/enquiryController';

export async function POST(req) {
  return enquiryController.createEnquiry(req);
}
