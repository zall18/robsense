/**
 * Helper autentikasi admin RobSense (DSDC 2026 MVP)
 * Menggunakan Web Crypto API murni (Web Standards) yang didukung penuh di Edge Runtime, Next.js Middleware, dan Node.js
 */

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || 'admin@robsense.id';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const secret = process.env.ADMIN_SESSION_SECRET || 'robsense_admin_session_secret_dsdc_2026';
  return { email, password, secret };
}

export async function createAdminToken(): Promise<string> {
  const { email, secret } = getAdminCredentials();
  const rawString = `${secret}:${email}:admin_session_token_2026`;

  const encoder = new TextEncoder();
  const data = encoder.encode(rawString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expectedToken = await createAdminToken();
  return token === expectedToken;
}
