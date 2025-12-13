import { NextResponse } from 'next/server';
import {TOKEN_DASHBOARD, URL_DASHBOAD} from "@/config/server-constant";

export interface ByBentukPendidikan {
  bentuk_pendidikan: string;
  jumlah: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: ByBentukPendidikan[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
    // Contoh: Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(URL_DASHBOAD + 'teras-pendidikan/bentukpendidikan', {
      headers: {
        'Authorization': `Bearer ${TOKEN_DASHBOARD}`,
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

    const formattedData: ByBentukPendidikan[] = data.data.map((item: ByBentukPendidikan) => ({
      bentuk_pendidikan: item.bentuk_pendidikan,
      jumlah: item.jumlah,
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
