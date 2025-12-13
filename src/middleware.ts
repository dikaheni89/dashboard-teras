import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ALLOWED_ORIGINS } from '@/config/server-constant';

const PROTECTED_API_PATHS = [
  // '/api/bmkg',
  '/api/cctv',
  '/api/keuangan',
  '/api/peringatan',
  '/api/selectdata',
  '/api/token',
  '/api/media',
  '/api/ketapang',
  '/api/kependudukan',
  '/api/perizinan',
  '/api/kesehatan',
  '/api/siloker',
  '/api/spanlapor',
  '/api/infrastruktur',
  '/api/malimping',
  '/api/kepegawaian',
  '/api/pendidikan',
  '/api/kinerja'
];

const allowedHosts = ALLOWED_ORIGINS.map((origin) => {
  try {
    return new URL(origin).host || origin.replace(/^https?:\/\//, '');
  } catch {
    return origin.replace(/^https?:\/\//, '');
  }
}).filter(Boolean);

const isAllowedHost = (host?: string | null) => {
  if (!host) return false;
  const h = host.toLowerCase();
  return allowedHosts.some((allowed) => h === allowed || h.endsWith(`.${allowed}`));
};

// SSO untuk halaman frontend tidak lagi ditangani di middleware.
// Lihat: src/app/api/sso/verify/route.ts dan komponen client SsoGuard.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip _next, favicon, public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // ---------------- Middleware khusus API ----------------
  if (pathname.startsWith('/api')) {
    // Batasi akses API hanya dari host/origin yang diizinkan.
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const hostHeader = request.headers.get('host') || '';
    const originHost = origin ? safeHost(origin) : '';
    const refererHost = referer ? safeHost(referer) : '';
    const requestHost = request.nextUrl.host || hostHeader;

    const hostAllowed =
      isAllowedHost(originHost) ||
      isAllowedHost(refererHost) ||
      isAllowedHost(requestHost) ||
      isAllowedHost(hostHeader);

    if (!hostAllowed) {
      return NextResponse.json(
        { message: 'Forbidden: origin not allowed' },
        { status: 403 }
      );
    }

    if (PROTECTED_API_PATHS.some((path) => pathname.startsWith(path))) {
      const host = request.headers.get('host') || '';
      const baseUrl = request.nextUrl.origin;

      const isValidReferer = referer.includes(baseUrl) || referer.includes(host);
      const isValidOrigin = origin.includes(baseUrl) || origin.includes(host);

      if (!isValidReferer && !isValidOrigin) {
        console.warn("⛔ Akses Ditolak: Hanya bisa diakses dari aplikasi Next.js");
        return NextResponse.json(
          { message: 'hey jangan nakal yaaa kamu jangan ganggu' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  }

  // Catatan: Proteksi SSO untuk halaman frontend dipindahkan ke guard client.

  // Default: route lain yang tidak perlu SSO
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

function safeHost(url: string): string {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
}
