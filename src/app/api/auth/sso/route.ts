import { NextRequest } from 'next/server';
import {
  readSsoSessionValue,
  SSO_SESSION_COOKIE_NAME,
} from '@/libs/auth/sso-session';

export async function GET(req: NextRequest) {
  const user = readSsoSessionValue(req.cookies.get(SSO_SESSION_COOKIE_NAME)?.value);

  return new Response(JSON.stringify({ ok: Boolean(user), user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
