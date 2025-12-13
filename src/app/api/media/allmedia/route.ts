import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface News {
  id: number;
  title: string;
  link: string;
  content: string;
  description: string;
  pub_date: string;
  media: string;
  guid: string;
}

export interface DataResponse {
  id: number;
  sumber: string;
  url: string;
  kategori: string;
  news: News[];
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: DataResponse[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
    // Contoh: Sentry.captureException(error);
  }
};

const TIMEOUT_MS = 10000;
const fetchWithTimeout = (url: string, options: RequestInit, timeout = TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal })
    .then((response) => {
      clearTimeout(id);
      return response;
    })
    .catch((err) => {
      clearTimeout(id);
      throw err;
    });
};

export async function GET() {
  try {
    const res = NextResponse;
    const responseAPI = await fetchWithTimeout(`${URL_DASHBOAD}teras-media/summary`, {
      headers: {
        'Authorization': `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    });

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return res.json(
        { success: false, message: 'Data tidak dapat diambil, silakan coba lagi.' },
        { status: responseAPI.status }
      );
    }

    const responseText = await responseAPI.text();
    if (responseText.startsWith("<html")) {
      console.error("Response berupa HTML, kemungkinan error server atau redirect.");
      return res.json(
        { success: false, message: 'Server mengembalikan halaman HTML, bukan JSON.' },
        { status: 500 }
      );
    }
    let data: IResponse;
    try {
      data = JSON.parse(responseText);
    } catch {
      return res.json(
        { success: false, message: 'Data tidak valid, tidak dapat di-parse.' },
        { status: 500 }
      );
    }

    if (!data || !data.data) {
      return res.json(
        { success: false, message: 'Data tidak sesuai struktur yang diharapkan.' },
        { status: 500 }
      );
    }

    return res.json({
      status: 200,
      success: true,
      message: "Sukses",
      data: data.data
    }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Fetch Error:", error.message);

    if (error.name === 'AbortError') {
      logError('Fetch aborted: Request timeout');
      return NextResponse.json(
        {
          success: false,
          message: 'Permintaan gagal karena waktu habis (timeout), coba lagi.',
        },
        { status: 504 }
      );
    } else {
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
}
