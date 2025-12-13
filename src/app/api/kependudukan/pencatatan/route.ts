import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface PencatatanPenduduk {
  capaian: string;
  persen: string;
  target: string;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    akta: PencatatanPenduduk;
    kia: PencatatanPenduduk;
    ktp: PencatatanPenduduk;
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
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-kependudukan/rekap-pencatatan-kependudukan`, {
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

    const data: IResponse = await responseAPI.json();

    const formattedData = {
      akta: {
        capaian: parseInt(data.data.akta.capaian).toLocaleString('id-ID'),
        persen: data.data.akta.persen,
        target: parseInt(data.data.akta.target).toLocaleString('id-ID')
      },
      kia: {
        capaian: parseInt(data.data.kia.capaian).toLocaleString('id-ID'),
        persen: data.data.kia.persen,
        target: parseInt(data.data.kia.target).toLocaleString('id-ID')
      },
      ktp: {
        capaian: parseInt(data.data.ktp.capaian).toLocaleString('id-ID'),
        persen: data.data.ktp.persen,
        target: parseInt(data.data.ktp.target).toLocaleString('id-ID')
      }
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
