import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface UrusanPemerintahanItem {
  up_name: string;
  total_berlaku: number;
  total_tidak_berlaku: number;
}

export interface IResponseUrusanPemerintahanItem {
  status: number;
  success: boolean;
  message: string;
  data: UrusanPemerintahanItem[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa disambungkan ke logger eksternal seperti Sentry
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-regulasi/urusanpemerintahan-regulasi`, {
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

    const data: IResponseUrusanPemerintahanItem = await responseAPI.json();

    const formattedData = data.data.map((item) => ({
      up_name: item.up_name,
      total_berlaku: item.total_berlaku,
      total_tidak_berlaku: item.total_tidak_berlaku
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
