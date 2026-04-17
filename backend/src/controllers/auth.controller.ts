import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateOtp, otpExpiresAt, sendOtpSms } from '../utils/otp';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

// POST /api/auth/send-otp
// Body: { mobile: "+919876543210" }
export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { mobile } = req.body as { mobile: string };

  if (!mobile || !/^\+?[1-9]\d{9,14}$/.test(mobile)) {
    res.status(400).json({ error: 'Invalid mobile number' });
    return;
  }

  const code = generateOtp();
  const expiresAt = otpExpiresAt();

  // Invalidate any unused previous OTPs for this number
  await prisma.otp.updateMany({
    where: { mobile, used: false },
    data: { used: true },
  });

  await prisma.otp.create({ data: { mobile, code, expiresAt } });

  await sendOtpSms(mobile, code);

  const response: Record<string, unknown> = { message: 'OTP sent' };
  if (process.env.NODE_ENV === 'development') {
    response.dev_otp = code; // expose OTP only in dev
  }

  res.json(response);
}

// POST /api/auth/verify-otp
// Body: { mobile: "+919876543210", code: "123456" }
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { mobile, code } = req.body as { mobile: string; code: string };

  if (!mobile || !code) {
    res.status(400).json({ error: 'mobile and code are required' });
    return;
  }

  const otp = await prisma.otp.findFirst({
    where: { mobile, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) {
    res.status(400).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Mark OTP as used
  await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });

  // Find or create reporter
  let reporter = await prisma.reporter.findUnique({ where: { mobile } });
  if (!reporter) {
    reporter = await prisma.reporter.create({ data: { mobile } });
  }

  // Link OTP to reporter
  await prisma.otp.update({ where: { id: otp.id }, data: { reporterId: reporter.id } });

  const token = signToken({ reporterId: reporter.id, mobile: reporter.mobile });

  res.json({
    token,
    reporter: {
      id: reporter.id,
      mobile: reporter.mobile,
      fullName: reporter.fullName,
      isNewUser: !reporter.fullName, // hint for onboarding
    },
  });
}
