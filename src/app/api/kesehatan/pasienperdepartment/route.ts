import { NextResponse } from 'next/server';
import {TOKEN_DASHBOARD, URL_DASHBOAD} from "@/config/server-constant";

export interface Pasien {
    jumlah: number;
    departemen: string;
}

export interface IResponsePasien {
  status: number;
  success: boolean;
  message: string;
  data: Pasien[];
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
    const responseAPI = await fetch(URL_DASHBOAD + 'teras-kesehatan/pasien-per-deartemen', {
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

    const formattedData: Pasien[] = data.data.map((item: Pasien) => ({
        jumlah: item.jumlah,
        departemen: `${item.departemen} : ${item.jumlah}`,
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
