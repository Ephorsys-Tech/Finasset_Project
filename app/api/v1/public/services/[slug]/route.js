import { serviceController } from '@/backend/controllers/serviceController';

export async function GET(req, { params }) {
  const { slug } = await params;
  return serviceController.getServiceBySlug(slug);
}
