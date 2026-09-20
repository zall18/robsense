import { createAdminToken, verifyAdminToken, getAdminCredentials } from '@/lib/auth';

describe('Admin Authentication Utilities (lib/auth)', () => {
  it('loads default admin credentials if environment variables are not specified', () => {
    const creds = getAdminCredentials();
    expect(creds.email).toBeDefined();
    expect(creds.password).toBeDefined();
    expect(creds.secret).toBeDefined();
  });

  it('generates consistent token and verifies valid token correctly', async () => {
    const token = await createAdminToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64); // SHA-256 hex string

    const isValid = await verifyAdminToken(token);
    expect(isValid).toBe(true);
  });

  it('rejects invalid, null, or empty tokens', async () => {
    expect(await verifyAdminToken('')).toBe(false);
    expect(await verifyAdminToken(null)).toBe(false);
    expect(await verifyAdminToken(undefined)).toBe(false);
    expect(await verifyAdminToken('invalid-fake-token-123')).toBe(false);
  });
});
