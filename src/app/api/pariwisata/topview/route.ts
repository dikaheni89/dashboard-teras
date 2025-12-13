import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IResponsePariwisataPerLokasi {
  status: number;
  success: boolean;
  message: string;
  data: {
    lokasi_id: number;
    nama_lokasi: string;
    total_kunjungan: string;
    total_mancanegara: string;
    total_nusantara: string;
  }[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Integrasi logging eksternal (misal: Sentry)
    // Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-pariwisata/top-lokasi`, {
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

    const formattedData = data.data.map((item: any) => ({
      lokasi_id: item.lokasi_id,
      nama_lokasi: item.nama_lokasi,
      total_kunjungan: item.total_kunjungan,
      total_mancanegara: item.total_mancanegara,
      total_nusantara: item.total_nusantara,
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
