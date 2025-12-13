import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    jml_misi: number;
    jml_tujuan: number;
    jml_sasaran: number;
    jml_program: number;
    jml_kegiatan: number;
    jml_subkegiatan: number;
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
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-kinerja/summary`, {
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
      jml_misi: data.data.jml_misi,
      jml_tujuan: data.data.jml_tujuan,
      jml_sasaran: data.data.jml_sasaran,
      jml_program: data.data.jml_program,
      jml_kegiatan: data.data.jml_kegiatan,
      jml_subkegiatan: data.data.jml_subkegiatan,
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
