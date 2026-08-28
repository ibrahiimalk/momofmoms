// Custom admin auth for Cloudflare Workers runtime — no Node crypto module,
// uses Web Crypto (available natively in Workers) for both password hashing
// and signed session cookies.

const PBKDF2_ITERATIONS = 100_000;
const SESSION_COOKIE = 'momofmoms_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return `${toHex(salt.buffer)}:${toHex(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = fromHex(saltHex);
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const computedHex = toHex(derived);
  // constant-time compare
  if (computedHex.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) diff |= computedHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
  return diff === 0;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toHex(sig);
}

export async function createSessionCookie(adminId: string, secret: string): Promise<string> {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${adminId}.${expires}`;
  const sig = await hmacSign(payload, secret);
  const value = `${payload}.${sig}`;
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function verifySessionCookie(cookieHeader: string | null, secret: string): Promise<string | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const [adminId, expiresStr, sig] = parts;
  const expected = await hmacSign(`${adminId}.${expiresStr}`, secret);
  if (expected !== sig) return null;
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return null;
  return adminId;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

// Use inside any /api/admin/* route handler — middleware does NOT cover /api routes,
// so every admin-mutating API route must call this itself before touching D1/R2.
export async function requireAdmin(req: Request, secret: string): Promise<string | null> {
  return verifySessionCookie(req.headers.get('cookie'), secret);
}
