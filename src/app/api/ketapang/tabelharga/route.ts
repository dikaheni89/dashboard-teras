import { NextResponse } from "next/server";
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

interface Harga {
  kode_kab: number;
  nama_kab: string;
  harga: {
    [key: string]: number;
  };
}

interface TabelHarga {
  headers: string[];
  data: Harga[];
}

export interface IResponse {
  success: boolean;
  data: TabelHarga[];
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
      URL_DASHBOAD + "teras-komoditas/tabel-harga",
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

    const headers = Array.isArray(data.data.headers) ? data.data.headers : [];
    const hargaData = Array.isArray(data.data.data) ? data.data.data : [];

    const formattedData: TabelHarga = {
      headers,
      data: hargaData,
    };

    const responseData: IResponse = {
      success: true,
      data: [formattedData],
    };

    return NextResponse.json(responseData, { status: 200 });
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
