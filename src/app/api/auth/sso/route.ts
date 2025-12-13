import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const encoded = req.headers.get('x-user-info');
  const user = encoded ? JSON.parse(decodeURIComponent(encoded)) : null;
  return new Response(JSON.stringify({ ok: true, user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
