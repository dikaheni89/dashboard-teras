import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

interface TrendPerTanggal {
  tanggal: string;
  jumlah: number;
  selesai: number;
  proses: number;
  belum_ditindaklanjuti: number;
  belum_terverifikasi: number;
}

interface TrendPerOpd {
  tanggal: string;
  nama_opd: string;
  jumlah: number;
}

interface TrendPerBulan {
  bulan: string;
  jumlah: number;
}

export interface IResponseTrend {
  status: number;
  success: boolean;
  message: string;
  data: {
    trend_per_tanggal: TrendPerTanggal[];
    trend_per_opd: TrendPerOpd[];
    trend_per_bulan: TrendPerBulan[];
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Contoh untuk production: Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(URL_DASHBOAD + 'teras-span-lapor/trend', {
      headers: {
        'Authorization': `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
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
    const { trend_per_tanggal, trend_per_opd, trend_per_bulan } = data.data;

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Sukses",
        data: {
          trend_per_tanggal,
          trend_per_opd,
          trend_per_bulan,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
