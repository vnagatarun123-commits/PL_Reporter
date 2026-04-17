import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export function signToken(payload: { reporterId: string; mobile: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): { reporterId: string; mobile: string } {
  return jwt.verify(token, SECRET) as { reporterId: string; mobile: string };
}
