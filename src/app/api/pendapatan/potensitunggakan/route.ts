import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from '@/config/server-constant';
export interface JumlahKendaraan {
  total_potensi: number;
  total_tunggakan: number;
  wilayah: string;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: JumlahKendaraan[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
    // Contoh: Sentry.captureException(error);
  }
};
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kabupaten_kota = searchParams.get('kabupaten_kota') || '';
  const kendaraan = searchParams.get('kendaraan') || '';
  const plat = searchParams.get('plat') || '';

  const params = new URLSearchParams({
    kabupaten_kota,
    kendaraan,
    plat,
  });

  try {
    const responseAPI = await fetch(
      `${URL_DASHBOAD}teras-pendapatan/potensi-tunggakan?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN_DASHBOARD}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );

    if (!responseAPI.ok) {
          logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
          return NextResponse.json(
            {
              status: responseAPI.status,
              success: false,
              message: 'Data tidak dapat diambil, silakan coba lagi.'
            },
            { status: responseAPI.status }
          );
        }

    const data = await responseAPI.json();

    const formattedData: JumlahKendaraan[] = data.data.map((item: JumlahKendaraan) => ({
          total_potensi: item.total_potensi,
          total_tunggakan: item.total_tunggakan,
          wilayah: item.wilayah,
        }));

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Sukses",
        data: formattedData
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
