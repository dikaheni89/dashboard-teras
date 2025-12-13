import { NextResponse } from "next/server";
import { TOKEN_DASHBOARD, URL_DASHBOAD } from "@/config/server-constant";

export interface KomoditasPerubahan {
  harga_hari_ini: string;
  harga_kemarin: string;
  nm_kmd: string;
  selisih: string;
}

export interface IResponse {
  success: boolean;
  status: number;
  message: string;
  data: KomoditasPerubahan[];
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


    const payload = new URLSearchParams({ tanggal });
    const urlApi = `${URL_DASHBOAD}teras-komoditas/perubahan-harga?${payload.toString()}`;

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
    const source = json?.data ?? [];

    if (!Array.isArray(source)) {
      // Jika null, undefined, atau bukan array
      logError("Format data tidak sesuai:", source);
      return NextResponse.json(
        {
          status: 204,
          success: true,
          message: "Data tidak tersedia untuk tanggal tersebut.",
          data: [],
        },
        { status: 200 }
      );
    }

    const responseData: IResponse = {
      success: true,
      status: 200,
      message: "Sukses",
      data: source,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    logError("Terjadi kesalahan pada API route perubahan harga.", error);
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
