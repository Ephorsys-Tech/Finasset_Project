import { contentController } from '@/backend/controllers/contentController';

export async function GET(req) {
  return contentController.getAllTestimonialsAdmin(req);
}

export async function POST(req) {
  return contentController.createTestimonial(req);
}

export async function PUT(req) {
  return contentController.updateTestimonial(req);
}

export async function DELETE(req) {
  return contentController.deleteTestimonial(req);
}
