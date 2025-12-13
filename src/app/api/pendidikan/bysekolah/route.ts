import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from '@/config/server-constant';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kabupaten_kota = searchParams.get('kabupaten_kota') || '';
  const bentuk_pendidikan = searchParams.get('bentuk_pendidikan') || '';
  const status_sekolah = searchParams.get('status_sekolah') || '';

  const params = new URLSearchParams({
    kabupaten_kota,
    bentuk_pendidikan,
    status_sekolah,
  });

  try {
    const responseAPI = await fetch(
      `${URL_DASHBOAD}teras-pendidikan/sekolah?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN_DASHBOARD}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );

    if (!responseAPI.ok) {
      return NextResponse.json(
        {
          status: responseAPI.status,
          success: false,
          message: 'Data tidak dapat diambil, silakan coba lagi.',
        },
        { status: responseAPI.status }
      );
    }

    const data = await responseAPI.json();

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: 'Sukses',
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi, ' + error,
      },
      { status: 500 }
    );
  }
}
