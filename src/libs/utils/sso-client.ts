'use client';

import { APP_BASE_PATH } from '@/config/client-constant';

export type SsoProfile = Record<string, unknown> & {
  Auth?: boolean;
  authenticated?: boolean;
  message?: string;
};

export type SsoVerifyResponse = {
  authenticated: boolean;
  message?: string;
  profile?: SsoProfile | null;
  redirectTo?: string | null;
};

const withBasePath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_BASE_PATH}${normalizedPath}` || normalizedPath;
};

const normalizeVerifyResponse = (data: unknown): SsoVerifyResponse => {
  if (!data || typeof data !== 'object') {
    return {
      authenticated: false,
      message: 'Invalid SSO verify response',
      profile: null,
    };
  }

  const payload = data as SsoProfile;
  const authenticated = Boolean(payload.Auth ?? payload.authenticated);

  return {
    authenticated,
    message:
      typeof payload.message === 'string' && payload.message.trim()
        ? payload.message
        : undefined,
    profile: authenticated
      ? {
          ...payload,
          Auth: true,
        }
      : null,
  };
};

async function parseResponse(res: Response): Promise<SsoVerifyResponse> {
  const text = await res.text();

  if (!text.trim()) {
    return {
      authenticated: false,
      message: res.ok ? undefined : 'Empty SSO verify response',
      profile: null,
    };
  }

  try {
    return normalizeVerifyResponse(JSON.parse(text));
  } catch {
    return {
      authenticated: false,
      message: text || 'Invalid SSO verify response',
      profile: null,
    };
  }
}

export async function fetchStoredSsoSession(): Promise<SsoVerifyResponse> {
  const res = await fetch(withBasePath('/api/sso/verify'), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  return parseResponse(res);
}

export async function persistSsoSession(profile: SsoProfile): Promise<SsoVerifyResponse> {
  const res = await fetch(withBasePath('/api/sso/verify'), {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile }),
  });

  return parseResponse(res);
}

export async function clearStoredSsoSession(): Promise<void> {
  await fetch(withBasePath('/api/sso/verify'), {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
  });
}

export async function fetchDirectSsoSession(): Promise<SsoVerifyResponse> {
  const res = await fetch(withBasePath('/api/sso/verify'), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  return parseResponse(res);
}
