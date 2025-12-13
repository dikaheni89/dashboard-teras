import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IResponsePariwisata {
  status: number;
  success: boolean;
  message: string;
  data: {
    total_lokasi_pariwisata: number;
    total_mancanegara_bulan_ini: number;
    total_mancanegara_bulan_lalu: number;
    total_nusantara_bulan_ini: number;
    total_nusantara_bulan_lalu: number;
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Contoh integrasi dengan Sentry, jika diperlukan di production
    // Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-pariwisata/summary`, {
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    });

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

    const formattedData = {
      total_lokasi_pariwisata: data.data.total_lokasi_pariwisata,
      total_mancanegara_bulan_ini: data.data.total_mancanegara_bulan_ini,
      total_mancanegara_bulan_lalu: data.data.total_mancanegara_bulan_lalu,
      total_nusantara_bulan_ini: data.data.total_nusantara_bulan_ini,
      total_nusantara_bulan_lalu: data.data.total_nusantara_bulan_lalu,
    };

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
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.'
      },
      { status: 500 }
    );
  }
}
