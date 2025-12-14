import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key_change_in_prod';
const key = new TextEncoder().encode(SECRET_KEY);

interface SessionPayload {
  sub: string;      // User ID
  username: string;
  role: string;
  tenant_id: string; // Enterprise Multi-tenancy
}

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
