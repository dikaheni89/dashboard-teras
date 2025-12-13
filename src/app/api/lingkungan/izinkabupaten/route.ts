import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IzinPerWilayah {
  kabupaten_lebak: number;
  kabupaten_pandeglang: number;
  kabupaten_serang: number;
  kabupaten_tangerang: number;
  kota_cilegon: number;
  kota_serang: number;
  kota_tangerang: number;
  kota_tanggerang_selatan: number;
  total_izin: number;
}

export interface IResponseIzinPerWilayah {
  status: number;
  success: boolean;
  message: string;
  data: IzinPerWilayah[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Integrasikan ke Sentry/LogRocket dsb bila perlu.
  }
};

const toNum = (v: unknown): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export async function GET() {
  try {
    const responseAPI = await fetch(
      URL_DASHBOAD + 'teras-lingkungan/total-izin-perkabkota',
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
          message: 'Data tidak dapat diambil, silakan coba lagi.',
        },
        { status: responseAPI.status }
      );
    }

    const data = await responseAPI.json();
    const sourceArray = Array.isArray(data?.data) ? data.data : [data?.data].filter(Boolean);

    const formattedData: IzinPerWilayah[] = sourceArray.map((item: any) => ({
      kabupaten_lebak: toNum(item?.kabupaten_lebak),
      kabupaten_pandeglang: toNum(item?.kabupaten_pandeglang),
      kabupaten_serang: toNum(item?.kabupaten_serang),
      kabupaten_tangerang: toNum(item?.kabupaten_tangerang),
      kota_cilegon: toNum(item?.kota_cilegon),
      kota_serang: toNum(item?.kota_serang),
      kota_tangerang: toNum(item?.kota_tangerang),
      kota_tanggerang_selatan: toNum(item?.kota_tanggerang_selatan),
      total_izin: toNum(item?.total_izin),
    }));

    return NextResponse.json<IResponseIzinPerWilayah>(
      {
        status: 200,
        success: true,
        message: 'Sukses',
        data: formattedData,
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
