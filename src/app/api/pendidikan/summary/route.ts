import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    jumlah_sekolah: number;
    jumlah_ruangan: number;
    jumlah_guru: number;
    jumlah_tendik: number;
    jumlah_siswa: number;
  };
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
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-pendidikan/summary`, {
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
      jumlah_sekolah: data.data.jumlah_sekolah,
      jumlah_ruangan: data.data.jumlah_ruangan,
      jumlah_guru: data.data.jumlah_guru,
      jumlah_tendik: data.data.jumlah_tendik,
      jumlah_siswa: data.data.jumlah_siswa,
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
