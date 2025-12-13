import { NextResponse } from 'next/server';
import { TOKEN_DASHBOARD, URL_DASHBOAD } from '@/config/server-constant';

export interface SpanLaporSummaryItem {
  kode_opd: number;
  nama_opd: string;
  total_aduan: number;
  belum_terverifikasi: number;
  belum_ditindaklanjuti: number;
  proses: number;
  selesai: number;
  tindak_lanjut: number;
  tgl_aduan_terakhir: string;
  updated_at: string;
}

export interface TopTenCategory {
  kategori: string;
  jumlah: number;
  instansi: string;
  periode: string;
  source: string;
}

export interface TotalStats {
  total_aduan: number;
  total_proses: number;
  total_selesai: number;
  total_tindak_lanjut: number;
}

export interface ISpanResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    last_updated: string;
    span_lapor_summary: SpanLaporSummaryItem[];
    top_ten_span_categories: TopTenCategory[];
    total_stats: TotalStats;
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(
      URL_DASHBOAD + 'teras-span-lapor/dashboard',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN_DASHBOARD}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return NextResponse.json(
        {
          status: responseAPI.status,
          success: false,
          message: 'Gagal mengambil data SPAN.',
        },
        { status: responseAPI.status }
      );
    }

    const json = await responseAPI.json();

    const formattedData: ISpanResponse = {
      status: 200,
      success: true,
      message: 'Sukses',
      data: {
        last_updated: json.data.last_updated,
        span_lapor_summary: json.data.span_lapor_summary,
        top_ten_span_categories: json.data.top_ten_span_categories,
        total_stats: json.data.total_stats,
      },
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan server, silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
