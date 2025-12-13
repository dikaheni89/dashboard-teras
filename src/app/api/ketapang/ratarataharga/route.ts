import { NextResponse } from "next/server";
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

interface RataRataHarga {
  id_kmd: number;
  nama_pangan: string;
  nm_kmd: string;
  rata_harga: number;
}

export interface IResponse {
  success: boolean;
  status: number;
  message: string;
  data: RataRataHarga[];
}

const logError = (message: string, error?: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", message, error?.message ?? error);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];

    const urlApi = `${URL_DASHBOAD}teras-komoditas/rata-rata-komoditas?tanggal=${tanggal}`;

    const responseAPI = await fetch(urlApi, {
      headers: {
        Authorization: `Bearer ${TOKEN_DASHBOARD}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!responseAPI.ok) {
      logError(`Gagal fetch dari API (${responseAPI.status})`);
      return NextResponse.json(
        {
          status: responseAPI.status,
          success: false,
          message: "Gagal mengambil data dari server sumber.",
          data: [],
        },
        { status: responseAPI.status }
      );
    }

    const json = await responseAPI.json();
    const source = json?.data;

    if (!Array.isArray(source)) {
      logError("Format data tidak sesuai:", source);
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: "Format data tidak sesuai.",
          data: [],
        },
        { status: 404 }
      );
    }

    const formattedData: RataRataHarga[] = source.map((item: any) => ({
      id_kmd: Number(item.id_kmd) ?? 0,
      nama_pangan: item.nama_pangan ?? "",
      nm_kmd: item.nm_kmd ?? "",
      rata_harga: Number(item.rata_harga) ?? 0,
    }));

    const responseData: IResponse = {
      status: 200,
      success: true,
      message: "Sukses",
      data: formattedData,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    logError("Terjadi kesalahan pada API route rata-rata komoditas.", error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Terjadi kesalahan pada server.",
        data: [],
      },
      { status: 500 }
    );
  }
}
