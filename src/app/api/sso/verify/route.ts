import { NextRequest, NextResponse } from 'next/server';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { APP_BASE_PATH, SSO_LOGIN_URL, SSO_VERIFY_URL } from '@/config/server-constant';
import {
  createSsoSessionValue,
  getSsoSessionCookieOptions,
  readSsoSessionValue,
  SSO_SESSION_COOKIE_NAME,
} from '@/libs/auth/sso-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CurlSiteResponse = {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  url: string;
  bodyText: string;
  errorNo: number;
  errorMessage?: string;
};

type SsoVerifyPayload = {
  Auth?: boolean;
  authenticated?: boolean;
  message?: string;
  profile?: Record<string, unknown> | null;
  [key: string]: unknown;
};

const withAppBasePath = (path: string) => {
  const base = APP_BASE_PATH?.replace(/\/+$/, '') || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}` || normalizedPath;
};

const buildLoginUrl = (host: string | null) => {
  const base = SSO_LOGIN_URL.replace(/\/+$/, '');
  if (base.includes('=')) {
    return base;
  }

  const resolvedHost = host?.trim() || 'dashboard.bantenprov.go.id';
  return `${base}/=${resolvedHost}`;
};

const isRedirectStatus = (status: number) =>
  status === 301 || status === 302 || status === 303 || status === 307 || status === 308;

const singleRequest = async (
  url: string,
  {
    cookie,
    headers,
    timeoutMs,
  }: { cookie: string; headers: Record<string, string>; timeoutMs: number }
): Promise<CurlSiteResponse> =>
  new Promise((resolve) => {
    const targetUrl = new URL(url);
    const isHttps = targetUrl.protocol === 'https:';
    const requester = isHttps ? httpsRequest : httpRequest;

    const req = requester(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port ? Number(targetUrl.port) : undefined,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method: 'GET',
        headers: {
          ...headers,
          Cookie: cookie,
          Accept: headers.Accept || 'application/json',
        },
        rejectUnauthorized: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers as Record<string, string | string[] | undefined>,
            url,
            bodyText: Buffer.concat(chunks).toString('utf8'),
            errorNo: 0,
          });
        });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('Request timeout'));
    });

    req.on('error', (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      resolve({
        status: 0,
        headers: {},
        url,
        bodyText: '',
        errorNo: 1,
        errorMessage: message,
      });
    });

    req.end();
  });

const getSite = async (
  url: string,
  {
    cookie,
    headers,
    timeoutMs,
    maxRedirects,
  }: {
    cookie: string;
    headers: Record<string, string>;
    timeoutMs: number;
    maxRedirects: number;
  }
) => {
  let currentUrl = url;
  let redirectCount = 0;
  let referer = headers.Referer;

  while (true) {
    const response = await singleRequest(currentUrl, {
      cookie,
      timeoutMs,
      headers: {
        ...headers,
        ...(referer ? { Referer: referer } : {}),
      },
    });

    if (!isRedirectStatus(response.status)) {
      return response;
    }

    const locationHeader = response.headers.location;
    const location = Array.isArray(locationHeader) ? locationHeader[0] : locationHeader;
    if (!location) {
      return response;
    }

    redirectCount += 1;
    if (redirectCount > maxRedirects) {
      return response;
    }

    referer = currentUrl;
    currentUrl = new URL(location, currentUrl).toString();
  }
};

const getNormalizedProfile = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as SsoVerifyPayload;
  const profile =
    record.profile && typeof record.profile === 'object'
      ? record.profile
      : record;
  const authenticated = Boolean(record.Auth ?? record.authenticated ?? profile.Auth);

  if (!authenticated) {
    return null;
  }

  return {
    ...profile,
    Auth: true,
  };
};

export async function GET(req: NextRequest) {
  const storedProfile = readSsoSessionValue(
    req.cookies.get(SSO_SESSION_COOKIE_NAME)?.value
  );

  const accept = req.headers.get('accept') || '';
  const isBrowser = accept.includes('text/html');

  if (storedProfile) {
    if (isBrowser) {
      const redirectUrl = new URL(withAppBasePath('/dashboard'), req.nextUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.json(
      {
        authenticated: true,
        profile: storedProfile,
      },
      { status: 200 }
    );
  }

  if (!storedProfile) {
    const cookie = req.headers.get('cookie') || '';
    const host = req.headers.get('host');
    const loginUrl = buildLoginUrl(host);

    if (!cookie) {
      if (isBrowser) {
        return NextResponse.redirect(loginUrl);
      }

      const response = NextResponse.json(
        {
          authenticated: false,
          message: 'Tidak ada cookie (belum login)',
          profile: null,
          redirectTo: loginUrl,
        },
        { status: 401 }
      );

      response.cookies.set(SSO_SESSION_COOKIE_NAME, '', {
        ...getSsoSessionCookieOptions(),
        maxAge: 0,
      });

      return response;
    }

    try {
      const curlResult = await getSite(SSO_VERIFY_URL, {
        cookie,
        timeoutMs: 3120_000,
        maxRedirects: 10,
        headers: {
          Accept: 'application/json',
          ...(req.headers.get('user-agent')
            ? { 'User-Agent': req.headers.get('user-agent') as string }
            : {}),
          ...(req.headers.get('accept-language')
            ? { 'Accept-Language': req.headers.get('accept-language') as string }
            : {}),
          Referer: req.headers.get('referer') || loginUrl,
        },
      });

      if (curlResult.errorNo) {
        return NextResponse.json(
          {
            authenticated: false,
            message: curlResult.errorMessage || 'SSO verify error',
            profile: null,
          },
          { status: 500 }
        );
      }

      let payload: Record<string, unknown> | null = null;
      if (curlResult.bodyText.trim()) {
        try {
          payload = JSON.parse(curlResult.bodyText) as Record<string, unknown>;
        } catch {
          payload = null;
        }
      }

      const message =
        payload && typeof payload.message === 'string' && payload.message.trim()
          ? payload.message
          : undefined;

      const normalizedProfile = getNormalizedProfile(payload?.profile ?? payload);

      if (!normalizedProfile) {
        if (isBrowser) {
          return NextResponse.redirect(loginUrl);
        }

        const response = NextResponse.json(
          {
            authenticated: false,
            message: message || 'Unauthorized dari SSO',
            profile: null,
            redirectTo: loginUrl,
          },
          { status: 401 }
        );

        response.cookies.set(SSO_SESSION_COOKIE_NAME, '', {
          ...getSsoSessionCookieOptions(),
          maxAge: 0,
        });

        return response;
      }

      const cookieValue = createSsoSessionValue(normalizedProfile);
      if (!cookieValue) {
        return NextResponse.json(
          {
            authenticated: false,
            message: 'Failed to create SSO session',
            profile: null,
          },
          { status: 500 }
        );
      }

      if (isBrowser) {
        const redirectUrl = new URL(withAppBasePath('/dashboard'), req.nextUrl.origin);
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set(
          SSO_SESSION_COOKIE_NAME,
          cookieValue,
          getSsoSessionCookieOptions()
        );
        return response;
      }

      const response = NextResponse.json(
        {
          authenticated: true,
          message,
          profile: normalizedProfile,
        },
        { status: 200 }
      );

      response.cookies.set(
        SSO_SESSION_COOKIE_NAME,
        cookieValue,
        getSsoSessionCookieOptions()
      );

      return response;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('SSO ERROR:', error);
      }

      return NextResponse.json(
        {
          authenticated: false,
          message: 'SSO verify error',
          profile: null,
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SsoVerifyPayload;
    const profile = getNormalizedProfile(body?.profile ?? body);

    if (!profile) {
      const invalidResponse = NextResponse.json(
        {
          authenticated: false,
          message: 'Invalid SSO profile payload',
          profile: null,
        },
        { status: 400 }
      );

      invalidResponse.cookies.set(SSO_SESSION_COOKIE_NAME, '', {
        ...getSsoSessionCookieOptions(),
        maxAge: 0,
      });

      return invalidResponse;
    }

    const cookieValue = createSsoSessionValue(profile);
    if (!cookieValue) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'Failed to create SSO session',
          profile: null,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        authenticated: true,
        profile,
      },
      { status: 200 }
    );

    response.cookies.set(
      SSO_SESSION_COOKIE_NAME,
      cookieValue,
      getSsoSessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error('Error storing SSO session:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Failed to store SSO session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    {
      authenticated: false,
      message: 'SSO session cleared',
      profile: null,
    },
    { status: 200 }
  );

  response.cookies.set(SSO_SESSION_COOKIE_NAME, '', {
    ...getSsoSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
