import { NextResponse } from "next/server";
import {TOKEN_DASHBOARD, URL_DASHBOAD} from "@/config/server-constant";

interface Tren {
  harga: string;
  tanggal: string;
}

interface Komoditas {
  id: number;
  nama: string;
  tren: Tren[];
}

export interface IResponse {
  success: boolean;
  data: Komoditas[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
  }
};

export async function GET() {
  try {
    const responseAPI = await fetch(
      URL_DASHBOAD + "teras-komoditas/tren-semua-komoditas",
      {
        headers: {
          Authorization: `Bearer ${TOKEN_DASHBOARD}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return NextResponse.json(
        {
          status: responseAPI.status,
          success: false,
          message: "Data tidak dapat diambil, silakan coba lagi.",
        },
        { status: responseAPI.status }
      );
    }

    const data = await responseAPI.json();

    const formattedData: Komoditas[] = data.data.map(
      (komoditas: Komoditas) => ({
        id: komoditas.id,
        nama: komoditas.nama,
        tren: komoditas.tren.map((item: Tren) => ({
          harga: item.harga,
          tanggal: item.tanggal,
        })),
      })
    );

    const responseData: IResponse = {
      success: true,
      data: formattedData,
    };

    return NextResponse.json(responseData, { status: 200 });
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
