import { contentController } from '@/backend/controllers/contentController';

export async function GET(req, { params }) {
  const { slug } = await params;
  return contentController.getBlogPostBySlug(slug);
}
