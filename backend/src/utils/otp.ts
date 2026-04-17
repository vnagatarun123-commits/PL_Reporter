/**
 * Generates a 6-digit numeric OTP.
 * In production, send this via Twilio / MSG91 / any SMS provider.
 * In development, the OTP is returned in the API response so you can test without SMS.
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function otpExpiresAt(): Date {
  const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES ?? '10', 10);
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Replace this stub with a real SMS send call.
 * Returns true on success, throws on failure.
 */
export async function sendOtpSms(mobile: string, code: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] OTP for ${mobile}: ${code}`);
    return;
  }
  // TODO: integrate Twilio / MSG91 here
  // await twilioClient.messages.create({ to: mobile, from: TWILIO_PHONE, body: `Your PL Reporter OTP is ${code}` });
  throw new Error('SMS provider not configured for production.');
}
