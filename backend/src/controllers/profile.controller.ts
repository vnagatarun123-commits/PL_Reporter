import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthRequest } from '../middleware/auth';

// GET /api/profile
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const { data: reporter, error } = await supabase
    .from('reporters')
    .select('id, mobile, full_name, email, address, reporter_licence, years_of_experience, art_style, bio, avatar_url, followers, following, created_at')
    .eq('id', req.reporterId)
    .single();

  if (error || !reporter) {
    res.status(404).json({ error: 'Reporter not found' });
    return;
  }

  res.json({
    id: reporter.id,
    mobile: reporter.mobile,
    fullName: reporter.full_name,
    email: reporter.email,
    address: reporter.address,
    reporterLicence: reporter.reporter_licence,
    yearsOfExperience: reporter.years_of_experience,
    artStyle: reporter.art_style,
    bio: reporter.bio,
    avatarUrl: reporter.avatar_url,
    followers: reporter.followers,
    following: reporter.following,
    createdAt: reporter.created_at,
  });
}

// PATCH /api/profile
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const fieldMap: Record<string, string> = {
    fullName: 'full_name',
    email: 'email',
    address: 'address',
    reporterLicence: 'reporter_licence',
    yearsOfExperience: 'years_of_experience',
    artStyle: 'art_style',
    bio: 'bio',
  };

  const data: Record<string, string> = {};
  for (const [key, col] of Object.entries(fieldMap)) {
    if (req.body[key] !== undefined) data[col] = req.body[key];
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: 'No valid fields provided' });
    return;
  }

  const { data: reporter, error } = await supabase
    .from('reporters')
    .update(data)
    .eq('id', req.reporterId)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(reporter);
}

// POST /api/profile/avatar
export async function updateAvatar(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const avatarUrl: string = (req.file as Express.MulterS3.File).location ?? `/uploads/${req.file.filename}`;

  const { error } = await supabase
    .from('reporters')
    .update({ avatar_url: avatarUrl })
    .eq('id', req.reporterId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ avatarUrl });
}
