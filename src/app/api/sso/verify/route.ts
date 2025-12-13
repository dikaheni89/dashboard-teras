import { NextRequest, NextResponse } from 'next/server';
import { SSO_VERIFY_URL } from '@/config/server-constant';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const userAgent = req.headers.get('user-agent') || '';

    const res = await fetch(SSO_VERIFY_URL, {
      headers: {
        cookie,
        'User-Agent': userAgent,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error calling SSO verify:', error);
    return NextResponse.json(
      { authenticated: false, message: 'SSO verify failed' },
      { status: 500 }
    );
  }
}

