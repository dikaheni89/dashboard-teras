import { createHmac, timingSafeEqual } from 'crypto';
import { AUTH_SECRET } from '@/config/server-constant';

export type SsoSessionProfile = Record<string, unknown> & {
  Auth?: boolean;
  authenticated?: boolean;
};

export const SSO_SESSION_COOKIE_NAME = 'teras_sso_session';

const SSO_SESSION_MAX_AGE = 60 * 60 * 8;
const SSO_SESSION_COOKIE_PATH = '/';

const getSigningSecret = () => AUTH_SECRET || 'teras-sso-session-fallback-secret';

const signPayload = (payload: string) =>
  createHmac('sha256', getSigningSecret()).update(payload).digest('hex');

const normalizeProfile = (value: unknown): SsoSessionProfile | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const profile = value as SsoSessionProfile;
  const authenticated = Boolean(profile.Auth ?? profile.authenticated);

  if (!authenticated) {
    return null;
  }

  return {
    ...profile,
    Auth: true,
  };
};

export const createSsoSessionValue = (profile: unknown): string | null => {
  const normalized = normalizeProfile(profile);
  if (!normalized) {
    return null;
  }

  const payload = Buffer.from(JSON.stringify(normalized), 'utf8').toString('base64url');
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
};

export const readSsoSessionValue = (value?: string | null): SsoSessionProfile | null => {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split('.');
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (
    !timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    )
  ) {
    return null;
  }

  try {
    const decoded = Buffer.from(payload, 'base64url').toString('utf8');
    return normalizeProfile(JSON.parse(decoded));
  } catch {
    return null;
  }
};

export const getSsoSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: SSO_SESSION_COOKIE_PATH,
  maxAge: SSO_SESSION_MAX_AGE,
});
