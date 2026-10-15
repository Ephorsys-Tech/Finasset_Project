import { contentController } from '@/backend/controllers/contentController';

export async function GET(req) {
  return contentController.getBlogPosts(req);
}
