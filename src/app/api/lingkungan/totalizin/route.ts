import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IzinPerKabKotaByDokumen {
  jenis_dokumen: 'amdal' | 'belum_proses' | 'sppl' | 'ukl_upl' | string;
  kabkota: string;
  total: number;
}

export interface IResponseIzinPerKabKotaByDokumen {
  status: number;
  success: boolean;
  message: string;
  data: IzinPerKabKotaByDokumen[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Integrasi ke Sentry/LogRocket dsb bila perlu.
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
      URL_DASHBOAD + 'teras-lingkungan/izin-perkabkota',
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

    const formattedData: IzinPerKabKotaByDokumen[] = sourceArray.map((item: any) => ({
      jenis_dokumen: String(item?.jenis_dokumen ?? ''),
      kabkota: String(item?.kabkota ?? ''),
      total: toNum(item?.total),
    }));

    return NextResponse.json<IResponseIzinPerKabKotaByDokumen>(
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
