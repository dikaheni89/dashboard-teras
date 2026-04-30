import { NextRequest, NextResponse } from 'next/server';
import { SSO_VERIFY_URL } from '@/config/server-constant';

type SsoVerifyPayload = {
  Auth?: boolean;
  authenticated?: boolean;
  message?: string;
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const origin = req.nextUrl.origin;
    const referer = req.headers.get('referer') || origin;
    const xff = req.headers.get('x-forwarded-for') || '';
    const host = req.headers.get('host') || '';

    const res = await fetch(SSO_VERIFY_URL, {
      headers: {
        cookie,
        'User-Agent': userAgent,
        'Accept': 'application/json',
        'Origin': origin,
        'Referer': referer,
        'X-Forwarded-For': xff,
        'X-Forwarded-Host': host,
      },
      cache: 'no-store',
      redirect: 'follow',
    });

    const text = await res.text();
    let data: SsoVerifyPayload | null = null;

    try {
      data = text ? (JSON.parse(text) as SsoVerifyPayload) : null;
    } catch {
      data = { message: text || 'Invalid SSO verify response' };
    }

    const authenticated = Boolean(data?.Auth ?? data?.authenticated);
    const message =
      data?.message || (!authenticated && res.ok ? 'No Valid Authorized' : undefined);
    const profile =
      data && typeof data === 'object'
        ? { ...data, Auth: authenticated }
        : null;

    return NextResponse.json(
      {
        authenticated,
        message,
        profile,
      },
      { status: res.status }
    );
  } catch (error) {
    console.error('Error calling SSO verify:', error);
    return NextResponse.json(
      { authenticated: false, message: 'SSO verify failed' },
      { status: 500 }
    );
  }
}
