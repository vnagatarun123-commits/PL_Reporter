import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthRequest } from '../middleware/auth';

const VIDEO_STATUSES = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'REJECTED', 'REPORTED'];
const VIDEO_TYPES = ['VIDEO', 'SHORTS'];

// GET /api/videos?status=PUBLISHED&page=1&limit=20
export async function listVideos(req: AuthRequest, res: Response): Promise<void> {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;

  const take = Math.min(parseInt(limit, 10), 100);
  const skip = (parseInt(page, 10) - 1) * take;

  let query = supabase
    .from('videos')
    .select('id, title, description, type, status, thumbnail_url, video_url, duration, views, likes, rejection_note, report_reason, created_at, updated_at', { count: 'exact' })
    .eq('reporter_id', req.reporterId)
    .order('created_at', { ascending: false })
    .range(skip, skip + take - 1);

  if (status && VIDEO_STATUSES.includes(status)) {
    query = query.eq('status', status);
  }

  const { data: videos, count, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ videos, total: count ?? 0, page: parseInt(page, 10), limit: take });
}

// GET /api/videos/:id
export async function getVideo(req: AuthRequest, res: Response): Promise<void> {
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', req.params.id)
    .eq('reporter_id', req.reporterId)
    .single();

  if (error || !video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  res.json(video);
}

// POST /api/videos
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

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const videoFile = files?.video?.[0] as any;
  const thumbFile = files?.thumbnail?.[0] as any;

  const videoUrl = videoFile ? (videoFile.location ?? `/uploads/${videoFile.filename}`) : null;
  const thumbnailUrl = thumbFile ? (thumbFile.location ?? `/uploads/${thumbFile.filename}`) : null;

  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      title,
      description,
      type: VIDEO_TYPES.includes(type) ? type : 'VIDEO',
      status: 'DRAFT',
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      reporter_id: req.reporterId,
      views: 0,
      likes: 0,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(video);
}

// PATCH /api/videos/:id
export async function updateVideo(req: AuthRequest, res: Response): Promise<void> {
  const { data: video, error: fetchError } = await supabase
    .from('videos')
    .select('id, status')
    .eq('id', req.params.id)
    .eq('reporter_id', req.reporterId)
    .single();

  if (fetchError || !video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== 'DRAFT') {
    res.status(400).json({ error: 'Only DRAFT videos can be edited' });
    return;
  }

  const allowed = ['title', 'description', 'type'];
  const data: Record<string, string> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }

  const { data: updated, error } = await supabase
    .from('videos')
    .update(data)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(updated);
}

// POST /api/videos/:id/submit
export async function submitVideo(req: AuthRequest, res: Response): Promise<void> {
  const { data: video, error: fetchError } = await supabase
    .from('videos')
    .select('id, status, video_url')
    .eq('id', req.params.id)
    .eq('reporter_id', req.reporterId)
    .single();

  if (fetchError || !video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== 'DRAFT') {
    res.status(400).json({ error: 'Only DRAFT videos can be submitted for review' });
    return;
  }

  if (!video.video_url) {
    res.status(400).json({ error: 'Cannot submit a video without a video file' });
    return;
  }

  const { data: updated, error } = await supabase
    .from('videos')
    .update({ status: 'IN_REVIEW' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(updated);
}

// DELETE /api/videos/:id
export async function deleteVideo(req: AuthRequest, res: Response): Promise<void> {
  const { data: video, error: fetchError } = await supabase
    .from('videos')
    .select('id, status')
    .eq('id', req.params.id)
    .eq('reporter_id', req.reporterId)
    .single();

  if (fetchError || !video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (!['DRAFT', 'REJECTED'].includes(video.status)) {
    res.status(400).json({ error: 'Only DRAFT or REJECTED videos can be deleted' });
    return;
  }

  const { error } = await supabase.from('videos').delete().eq('id', req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ message: 'Deleted' });
}

// POST /api/videos/:id/report
export async function reportVideo(req: AuthRequest, res: Response): Promise<void> {
  const { reason } = req.body as { reason?: string };

  const { data: video, error: fetchError } = await supabase
    .from('videos')
    .select('id, status')
    .eq('id', req.params.id)
    .eq('reporter_id', req.reporterId)
    .single();

  if (fetchError || !video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  if (video.status !== 'PUBLISHED') {
    res.status(400).json({ error: 'Only PUBLISHED videos can be reported' });
    return;
  }

  const { data: updated, error } = await supabase
    .from('videos')
    .update({ status: 'REPORTED', report_reason: reason ?? '' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(updated);
}
