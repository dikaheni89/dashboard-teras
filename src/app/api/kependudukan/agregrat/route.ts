import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface PendudukData {
  jlh_pddk: number;
  nama_kabkota: string;
  target: number;
  value: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    aktv_ikd: {
      items: PendudukData[];
      label: string;
    };
    mmlk_akt_lhr_0018: {
      items: PendudukData[];
      label: string;
    };
    mmlk_kia: {
      items: PendudukData[];
      label: string;
    };
    rek_wktpd: {
      items: PendudukData[];
      label: string;
    };
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
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-kependudukan/agregat-penduduk-chart`, {
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
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
      aktv_ikd: {
        label: data.data.aktv_ikd.label,
        items: data.data.aktv_ikd.items.map((item) => ({
          jlh_pddk: item.jlh_pddk,
          target: item.target,
          nama_kabkota: item.nama_kabkota,
          value: item.value,
        })),
      },
      mmlk_akt_lhr_0018: {
        label: data.data.mmlk_akt_lhr_0018.label,
        items: data.data.mmlk_akt_lhr_0018.items.map((item) => ({
          jlh_pddk: item.jlh_pddk,
          target: item.target,
          nama_kabkota: item.nama_kabkota,
          value: item.value,
        })),
      },
      mmlk_kia: {
        label: data.data.mmlk_kia.label,
        items: data.data.mmlk_kia.items.map((item) => ({
          jlh_pddk: item.jlh_pddk,
          target: item.target,
          nama_kabkota: item.nama_kabkota,
          value: item.value,
        })),
      },
      rek_wktpd: {
        label: data.data.rek_wktpd.label,
        items: data.data.rek_wktpd.items.map((item) => ({
          jlh_pddk: item.jlh_pddk,
          target: item.target,
          nama_kabkota: item.nama_kabkota,
          value: item.value,
        })),
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
