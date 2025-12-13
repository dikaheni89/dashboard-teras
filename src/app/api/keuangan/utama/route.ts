
import { NextResponse } from 'next/server';
import {TOKEN_DASHBOARD, URL_DASHBOAD} from "@/config/server-constant";

export interface DataUtama {
  target_pendapatan_daerah: number;
  realisasi_pendapatan_daerah: number;
  pagu_belanja_daerah: number;
  realisasi_belanja_daerah: number;
}

export interface Grafik {
  target: number;
  realisasi: number;
  persen: number;
}

export interface Chart {
  anggaran_kas: number;
  bulan: string;
  realisasi_anggaran: number;
}

export interface Rincian {
  uraian: string;
  target_rp: number;
  realisasi_rp: number;
  persen: number;
}

export interface IResponse {
  status: number;
  data: {
    data_utama: DataUtama;
    grafik_belanja_daerah: Grafik;
    grafik_pendapatan_daerah: Grafik;
    rincian_belanja_daerah: Rincian[];
    rincian_pendapatan_daerah: Rincian[];
    chart_belanja: Chart[];
    chart_pendapatan: Chart[];
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
    // Contoh: Sentry.captureException(error);
  }
};

export async function GET() {
  try {
    const res = NextResponse;
    const responseAPI = await fetch(URL_DASHBOAD + 'teras-keuangan/utama', {
      headers: {
        'Authorization': `Bearer ${TOKEN_DASHBOARD}`,
        'Content-Type': 'application/json',
      },
      method: "GET",
    });

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak dapat diambil, silakan coba lagi.",
        },
        { status: responseAPI.status }
      );
    }
    if (!responseAPI.ok || responseAPI.status !== 200) {
      const responseText = await responseAPI.text();
      return res.json(
        {
          status: responseAPI.status,
          message: responseText,
        },
        { status: responseAPI.status }
      );
    }

    const data = await responseAPI.json();

    return res.json(
      {
        status: 200,
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Fetch Error:", error as Error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server, silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
