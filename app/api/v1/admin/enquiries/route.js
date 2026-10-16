import { enquiryController } from '@/backend/controllers/enquiryController';

export async function GET(req) {
  return enquiryController.getEnquiries(req);
}

export async function PUT(req) {
  return enquiryController.updateEnquiry(req);
}

export async function DELETE(req) {
  return enquiryController.deleteEnquiry(req);
}
