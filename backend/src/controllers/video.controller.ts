import { Response } from 'express';
import { PrismaClient, VideoStatus, VideoType } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// GET /api/videos?status=PUBLISHED&page=1&limit=20
export async function listVideos(req: AuthRequest, res: Response): Promise<void> {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;

  const where: Record<string, unknown> = { reporterId: req.reporterId };
  if (status && Object.values(VideoStatus).includes(status as VideoStatus)) {
    where.status = status as VideoStatus;
  }

  const take = Math.min(parseInt(limit, 10), 100);
  const skip = (parseInt(page, 10) - 1) * take;

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        thumbnailUrl: true,
        videoUrl: true,
        duration: true,
        views: true,
        likes: true,
        rejectionNote: true,
        reportReason: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.video.count({ where }),
  ]);

  res.json({ videos, total, page: parseInt(page, 10), limit: take });
}

// GET /api/videos/:id
export async function getVideo(req: AuthRequest, res: Response): Promise<void> {
  const video = await prisma.video.findFirst({
    where: { id: req.params.id, reporterId: req.reporterId },
  });

  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  res.json(video);
}

// POST /api/videos  (creates a DRAFT)
// multipart/form-data with fields: title, description, type + file "video" + optional "thumbnail"
export async function createVideo(req: AuthRequest, res: Response): Promise<void> {
  const { title, description = '', type = 'VIDEO' } = req.body as {
    title: string;
    description?: string;
    type?: string;
  };

  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] } | undefined;
  const videoFile = files?.video?.[0];
  const thumbFile = files?.thumbnail?.[0];

  const videoUrl = videoFile
    ? (videoFile.location ?? `/uploads/${videoFile.filename}`)
    : undefined;
  const thumbnailUrl = thumbFile
    ? (thumbFile.location ?? `/uploads/${thumbFile.filename}`)
    : undefined;

  const video = await prisma.video.create({
    data: {
      title,
      description,
      type: Object.values(VideoType).includes(type as VideoType) ? (type as VideoType) : VideoType.VIDEO,
      status: VideoStatus.DRAFT,
      videoUrl,
      thumbnailUrl,
      reporterId: req.reporterId as string,
    },
  });

  res.status(201).json(video);
}

// PATCH /api/videos/:id  (update title/description while still a DRAFT)
export async function updateVideo(req: AuthRequest, res: Response): Promise<void> {
  const video = await prisma.video.findFirst({
    where: { id: req.params.id, reporterId: req.reporterId },
  });

  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== VideoStatus.DRAFT) {
    res.status(400).json({ error: 'Only DRAFT videos can be edited' });
    return;
  }

  const allowed = ['title', 'description', 'type'];
  const data: Record<string, string> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }

  const updated = await prisma.video.update({ where: { id: req.params.id }, data });
  res.json(updated);
}

// POST /api/videos/:id/submit  (DRAFT → IN_REVIEW)
export async function submitVideo(req: AuthRequest, res: Response): Promise<void> {
  const video = await prisma.video.findFirst({
    where: { id: req.params.id, reporterId: req.reporterId },
  });

  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== VideoStatus.DRAFT) {
    res.status(400).json({ error: 'Only DRAFT videos can be submitted for review' });
    return;
  }

  if (!video.videoUrl) {
    res.status(400).json({ error: 'Cannot submit a video without a video file' });
    return;
  }

  const updated = await prisma.video.update({
    where: { id: req.params.id },
    data: { status: VideoStatus.IN_REVIEW },
  });

  res.json(updated);
}

// DELETE /api/videos/:id  (only DRAFT or REJECTED)
export async function deleteVideo(req: AuthRequest, res: Response): Promise<void> {
  const video = await prisma.video.findFirst({
    where: { id: req.params.id, reporterId: req.reporterId },
  });

  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  const deletable: VideoStatus[] = [VideoStatus.DRAFT, VideoStatus.REJECTED];
  if (!deletable.includes(video.status)) {
    res.status(400).json({ error: 'Only DRAFT or REJECTED videos can be deleted' });
    return;
  }

  await prisma.video.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
}

// POST /api/videos/:id/report
// Body: { reason: "..." }
export async function reportVideo(req: AuthRequest, res: Response): Promise<void> {
  const { reason } = req.body as { reason?: string };

  const video = await prisma.video.findFirst({
    where: { id: req.params.id, reporterId: req.reporterId },
  });

  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== VideoStatus.PUBLISHED) {
    res.status(400).json({ error: 'Only PUBLISHED videos can be reported' });
    return;
  }

  const updated = await prisma.video.update({
    where: { id: req.params.id },
    data: { status: VideoStatus.REPORTED, reportReason: reason ?? '' },
  });

  res.json(updated);
}
