import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// GET /api/profile
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const reporter = await prisma.reporter.findUnique({
    where: { id: req.reporterId },
    select: {
      id: true,
      mobile: true,
      fullName: true,
      email: true,
      address: true,
      reporterLicence: true,
      yearsOfExperience: true,
      artStyle: true,
      bio: true,
      avatarUrl: true,
      followers: true,
      following: true,
      createdAt: true,
    },
  });

  if (!reporter) {
    res.status(404).json({ error: 'Reporter not found' });
    return;
  }

  res.json(reporter);
}

// PATCH /api/profile
// Body: any subset of profile fields
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const allowed = ['fullName', 'email', 'address', 'reporterLicence', 'yearsOfExperience', 'artStyle', 'bio'];
  const data: Record<string, string> = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      data[key] = req.body[key];
    }
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: 'No valid fields provided' });
    return;
  }

  const reporter = await prisma.reporter.update({
    where: { id: req.reporterId },
    data,
  });

  res.json(reporter);
}

// POST /api/profile/avatar
// multipart/form-data with field "avatar"
export async function updateAvatar(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // req.file.location is set by multer-s3; for local storage use req.file.path
  const avatarUrl: string = (req.file as Express.MulterS3.File).location ?? `/uploads/${req.file.filename}`;

  const reporter = await prisma.reporter.update({
    where: { id: req.reporterId },
    data: { avatarUrl },
  });

  res.json({ avatarUrl: reporter.avatarUrl });
}
