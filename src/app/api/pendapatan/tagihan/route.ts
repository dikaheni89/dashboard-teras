import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from '@/config/server-constant';
export interface JumlahKendaraan {
  bulan: number;
  sum_sts_1: number;
  sum_sts_2: number;
  sum_sts_3: number;
  sum_sts_4: number;
  tahun: number;
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
  const keterangan_kode = searchParams.get('keterangan_kode') || '';
  const kabupaten_kota = searchParams.get('kabupaten_kota') || 'Provinsi Banten';
  const tahun = searchParams.get('tahun') || '2025';

  const params = new URLSearchParams({
    keterangan_kode,
    kabupaten_kota,
    tahun,
  });

  try {
    const responseAPI = await fetch(
      `${URL_DASHBOAD}teras-pendapatan/tagihan?${params.toString()}`,
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
          bulan: item.bulan,
          sum_sts_1: item.sum_sts_1,
          sum_sts_2: item.sum_sts_2,
          sum_sts_3: item.sum_sts_3,
          sum_sts_4: item.sum_sts_4,
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
