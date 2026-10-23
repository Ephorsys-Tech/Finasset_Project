import { videoController } from '@/backend/controllers/videoController';

export async function GET(req) {
  return videoController.getAllVideos(req);
}

export async function POST(req) {
  return videoController.createVideo(req);
}

export async function PUT(req) {
  return videoController.updateVideo(req);
}

export async function DELETE(req) {
  return videoController.deleteVideo(req);
}
