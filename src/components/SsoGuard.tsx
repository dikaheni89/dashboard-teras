'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NEXT_PUBLIC_SSO_LOGIN_URL, NEXT_PUBLIC_SSO_RESTRICTION_URL } from '@/config/client-constant';

const PROTECTED_FRONTEND_PATHS = [
  '/dashboard',
  '/belanja',
  '/cctv',
  '/kebencanaan',
  '/berita',
  '/malimping',
  '/kesehatan',
  '/kependudukan',
  '/ketapang',
  '/perizinan',
  '/tenagakerja',
  '/span',
  '/infrastruktur',
  '/kepegawaian',
  '/kinerja',
  '/pendidikan',
  '/pariwisata',
  '/regulasi',
  '/lingkungan',
  '/pendapatan',
];

export default function SsoGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const mustProtect = PROTECTED_FRONTEND_PATHS.some((p) => pathname.startsWith(p));
    if (!mustProtect) return;

    const verify = async () => {
      try {
        const res = await fetch('/api/sso/verify', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();

        if (!data?.authenticated) {
          if (data?.message === 'No Valid Authorized') {
            window.location.href = NEXT_PUBLIC_SSO_RESTRICTION_URL;
          } else {
            const returnUrl = encodeURIComponent(window.location.href);
            const sep = NEXT_PUBLIC_SSO_LOGIN_URL.includes('?') ? '&' : '?';
            window.location.href = `${NEXT_PUBLIC_SSO_LOGIN_URL}${sep}return_url=${returnUrl}`;
          }
        }
      } catch {
        // jika gagal verifikasi, arahkan ke halaman login
        const returnUrl = encodeURIComponent(window.location.href);
        const sep = NEXT_PUBLIC_SSO_LOGIN_URL.includes('?') ? '&' : '?';
        window.location.href = `${NEXT_PUBLIC_SSO_LOGIN_URL}${sep}return_url=${returnUrl}`;
      }
    };

    verify();
  }, [pathname]);

  return null;
}
