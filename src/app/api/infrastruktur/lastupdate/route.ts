import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface LastUpdatedResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    updated_at: string;
  }[];
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
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-pupr/last-update`, {
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
    const data: LastUpdatedResponse = await responseAPI.json();

    const updatedAt = data.data?.[0]?.updated_at ?? null;

    if (!updatedAt) {
      return NextResponse.json(
        {
          status: 204,
          success: false,
          message: 'Data kosong atau tidak tersedia.',
        },
        { status: 204 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Sukses",
        data: {
          updated_at: updatedAt,
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
        message: 'Terjadi kesalahan pada server, silakan coba lagi.'
      },
      { status: 500 }
    );
  }
}
