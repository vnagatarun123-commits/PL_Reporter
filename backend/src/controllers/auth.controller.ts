import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { generateOtp, otpExpiresAt, sendOtpSms } from '../utils/otp';
import { signToken } from '../utils/jwt';

// POST /api/auth/send-otp
export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { mobile } = req.body as { mobile: string };

  if (!mobile || !/^\+?[1-9]\d{9,14}$/.test(mobile)) {
    res.status(400).json({ error: 'Invalid mobile number' });
    return;
  }

  const code = generateOtp();
  const expiresAt = otpExpiresAt();

  // Invalidate previous unused OTPs
  await supabase
    .from('otps')
    .update({ used: true })
    .eq('mobile', mobile)
    .eq('used', false);

  await supabase.from('otps').insert({ mobile, code, expires_at: expiresAt, used: false });

  await sendOtpSms(mobile, code);

  const response: Record<string, unknown> = { message: 'OTP sent' };
  if (process.env.NODE_ENV === 'development') {
    response.dev_otp = code;
  }

  res.json(response);
}

// POST /api/auth/verify-otp
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { mobile, code } = req.body as { mobile: string; code: string };

  if (!mobile || !code) {
    res.status(400).json({ error: 'mobile and code are required' });
    return;
  }

  const { data: otp } = await supabase
    .from('otps')
    .select('*')
    .eq('mobile', mobile)
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!otp) {
    res.status(400).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Mark OTP as used
  await supabase.from('otps').update({ used: true }).eq('id', otp.id);

  // Find or create reporter
  let { data: reporter } = await supabase
    .from('reporters')
    .select('*')
    .eq('mobile', mobile)
    .single();

  if (!reporter) {
    const { data: newReporter } = await supabase
      .from('reporters')
      .insert({ mobile, full_name: '', followers: 0, following: 0, is_active: true })
      .select()
      .single();
    reporter = newReporter;
  }

  // Link OTP to reporter
  await supabase.from('otps').update({ reporter_id: reporter.id }).eq('id', otp.id);

  const token = signToken({ reporterId: reporter.id, mobile: reporter.mobile });

  res.json({
    token,
    reporter: {
      id: reporter.id,
      mobile: reporter.mobile,
      fullName: reporter.full_name,
      isNewUser: !reporter.full_name,
    },
  });
}
