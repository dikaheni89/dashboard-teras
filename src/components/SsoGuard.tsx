'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  NEXT_PUBLIC_SSO_LOGIN_URL,
  NEXT_PUBLIC_SSO_RESTRICTION_URL,
} from '@/config/client-constant';
import {
  clearStoredSsoSession,
  fetchDirectSsoSession,
  fetchStoredSsoSession,
} from '@/libs/utils/sso-client';

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

type VerifyResponse = {
  authenticated?: boolean;
  message?: string;
  profile?: Record<string, unknown> | null;
  redirectTo?: string | null;
};

type SsoGuardProps = {
  children: ReactNode;
};

const matchesProtectedPath = (pathname: string) =>
  PROTECTED_FRONTEND_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export default function SsoGuard({ children }: SsoGuardProps) {
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!pathname) {
      setIsAllowed(false);
      return;
    }

    const mustProtect = matchesProtectedPath(pathname);
    if (!mustProtect) {
      setIsAllowed(true);
      return;
    }

    setIsAllowed(false);

    const verify = async () => {
      try {
        const data: VerifyResponse = await fetchDirectSsoSession();

        if (data?.authenticated && data?.profile) {
          setIsAllowed(true);
          return;
        }

        await clearStoredSsoSession();

        if (data?.message === 'No Valid Authorized') {
          window.location.replace(NEXT_PUBLIC_SSO_RESTRICTION_URL);
          return;
        }

        const redirectTo =
          typeof data?.redirectTo === 'string' && data.redirectTo.trim()
            ? data.redirectTo
            : (() => {
                const base = NEXT_PUBLIC_SSO_LOGIN_URL.replace(/\/+$/, '');
                return base.includes('=') ? base : `${base}/=${window.location.host}`;
              })();

        window.location.replace(redirectTo);
      } catch {
        const storedSession = await fetchStoredSsoSession();

        if (storedSession?.authenticated) {
          setIsAllowed(true);
          return;
        }

        await clearStoredSsoSession();
        const base = NEXT_PUBLIC_SSO_LOGIN_URL.replace(/\/+$/, '');
        const loginUrl = base.includes('=')
          ? base
          : `${base}/=${window.location.host}`;
        window.location.replace(loginUrl);
      }
    };

    verify();
  }, [pathname]);

  return isAllowed ? <>{children}</> : null;
}
