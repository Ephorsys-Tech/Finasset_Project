import { contentController } from '@/backend/controllers/contentController';

export async function GET(req) {
  return contentController.getAllBlogPostsAdmin(req);
}

export async function POST(req) {
  return contentController.createBlogPost(req);
}

export async function PUT(req) {
  return contentController.updateBlogPost(req);
}

export async function DELETE(req) {
  return contentController.deleteBlogPost(req);
}
