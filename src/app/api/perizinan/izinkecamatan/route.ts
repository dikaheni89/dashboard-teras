import {NextResponse} from "next/server";
import {TOKEN_DASHBOARD, URL_DASHBOAD} from "@/config/server-constant";

interface TrenData {
  kecamatan: string;
  jumlah: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: TrenData[];
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
    const res = NextResponse;
    const responseAPI = await fetch(URL_DASHBOAD + 'teras-investasi/izin-kecamatan', {
      headers: {
        'Authorization': `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    });
    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return NextResponse.json(
        { success: false, message: 'Data tidak dapat diambil, silakan coba lagi.' },
        { status: responseAPI.status }
      );
    }
    if (!responseAPI.ok || responseAPI.status !== 200) {
      const responseText = await responseAPI.text();
      return res.json({
        status: responseAPI.status,
        message: responseText
      }, { status: responseAPI.status });
    }

    const data = await responseAPI.json();

    return res.json({
      status: 200,
      data: data.data
    }, { status: 200 });
  } catch (error) {
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
