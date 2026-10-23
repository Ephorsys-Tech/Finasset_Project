import { videoController } from '@/backend/controllers/videoController';

export async function GET() {
  return videoController.getPublishedVideos();
}
