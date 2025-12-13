import { NextResponse } from "next/server";
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

interface Komoditas {
  harga: number;
  nama_kab: string;
}

export interface IResponse {
  success: boolean;
  data: Komoditas[];
}

const logError = (message: string, error?: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", message, error instanceof Error ? error.message : error);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];
    const id_komoditas = searchParams.get("id_komoditas") || "13";

    const urlApi = `${URL_DASHBOAD}teras-komoditas/bar-chart-komoditas?id_komoditas=${id_komoditas}&tanggal=${tanggal}`;

    const responseAPI = await fetch(urlApi, {
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!responseAPI.ok) {
      logError(`Fetch gagal: ${responseAPI.status}`);
      return NextResponse.json(
        {
          success: false,
          status: responseAPI.status,
          message: "Data tidak dapat diambil, silakan coba lagi.",
        },
        { status: responseAPI.status }
      );
    }

    const json = await responseAPI.json();

    if (!json?.data || !Array.isArray(json.data)) {
      logError("Data tidak valid:", json);
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Format data tidak sesuai.",
        },
        { status: 404 }
      );
    }

    const formattedData: Komoditas[] = json.data.map((item: any) => ({
      harga: item.harga,
      nama_kab: item.nama_kab,
    }));

    return NextResponse.json<IResponse>(
      {
        success: true,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Terjadi kesalahan pada server.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server, silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
