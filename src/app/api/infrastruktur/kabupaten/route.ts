import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface KabupatenKota {
  total_panjang: number;
  nama_kab_kota: string;
}

export interface IResponseKabupatenKota {
  status: number;
  success: boolean;
  message: string;
  data: KabupatenKota[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(`${URL_DASHBOAD}teras-pupr/ruas/per-kabupaten`, {
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
          message: 'Data tidak dapat diambil, silakan coba lagi.',
        },
        { status: responseAPI.status }
      );
    }

    const data = await responseAPI.json();

    const formattedData: KabupatenKota[] = (data.data || [])
      .filter((item: KabupatenKota) => item.nama_kab_kota !== '-')
      .map((item: KabupatenKota) => ({
        total_panjang: item.total_panjang,
        nama_kab_kota: item.nama_kab_kota,
      }));

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: 'Sukses',
        data: formattedData,
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
