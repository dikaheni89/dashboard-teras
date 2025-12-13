import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const token = process.env.TOKEN_SPLP || process.env.TOKEN_DASHBOARD || "";
    if (!token) {
      return NextResponse.json({ message: 'Token not configured' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'Token fetched successfully',
      data: { access_token: token }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
