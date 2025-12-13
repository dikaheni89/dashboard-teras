import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface KinerjaBulanan {
  bulan: string;
  nm_unit: string;
  target_fisik: number;
  realisasi_fisik: number;
  capaian_fisik: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: KinerjaBulanan[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa integrasi Sentry di sini
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let bulan = searchParams.get("bulan");

    if (!bulan) {
      const now = new Date();
      bulan = (now.getMonth() + 1).toString(); // Default ke bulan saat ini
    }

    const responseAPI = await fetch(
      `${URL_DASHBOAD}teras-kinerja/kinerja-bulanan?bulan=${bulan}`,
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

    const formattedData: KinerjaBulanan[] = data.data.map((item: KinerjaBulanan) => ({
      bulan: item.bulan,
      nm_unit: item.nm_unit,
      target_fisik: item.target_fisik,
      realisasi_fisik: item.realisasi_fisik,
      capaian_fisik: item.capaian_fisik,
    }));

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Sukses",
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
