import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from '@/config/server-constant';

export interface SummaryData {
  amdal: number;
  sppl: number;
  total_izin: number;
  ukl_upl: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: SummaryData;
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Integrasikan ke Sentry/LogRocket dsb jika perlu
    // Contoh: Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const url = `${URL_DASHBOAD}teras-lingkungan/summary`;

    const responseAPI = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
    });

    if (!responseAPI.ok) {
      let errMessage = `Error ${responseAPI.status}: ${responseAPI.statusText}`;
      try {
        const maybeJson = await responseAPI.json();
        if (maybeJson?.message) errMessage = maybeJson.message;
      } catch {
        // abaikan jika body bukan JSON
      }

      logError(errMessage);
      return NextResponse.json<IResponse>(
        {
          status: responseAPI.status,
          success: false,
          message: errMessage || 'Data tidak dapat diambil, silakan coba lagi.',
          data: { amdal: 0, sppl: 0, total_izin: 0, ukl_upl: 0 },
        },
        { status: responseAPI.status }
      );
    }

    const json = await responseAPI.json();
    const src = json?.data ?? json;

    const formattedData: SummaryData = {
      amdal: Number(src?.amdal ?? 0),
      sppl: Number(src?.sppl ?? 0),
      total_izin: Number(src?.total_izin ?? 0),
      ukl_upl: Number(src?.ukl_upl ?? 0),
    };

    const payload: IResponse = {
      status: 200,
      success: true,
      message: 'Sukses',
      data: formattedData,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logError('Fetch Error:', error);

    return NextResponse.json<IResponse>(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.',
        data: { amdal: 0, sppl: 0, total_izin: 0, ukl_upl: 0 },
      },
      { status: 500 }
    );
  }
}
