import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IRoomClass {
  jenis_ruangan: string;
  jumlah_kamar: number;
}

export interface IResponseRoomClass {
  status: number;
  success: boolean;
  message: string;
  data: {
    last_updated: IRoomClass[];
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Integrasi ke monitoring tools seperti Sentry dapat ditambahkan di sini
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(`${URL_DASHBOAD}rsud-malingping/dashboard/available-room`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
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

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: 'Sukses',
        data: {
          last_updated: data.data.last_updated,
        },
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
