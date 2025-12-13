import { NextResponse } from 'next/server';
import {CUACA_PROVINSI} from "@/config/server-constant";
// remove filesystem dependency
import {getBasePath} from "@/libs/utils/getBasePath";

interface LokasiDesa {
  adm4: string | null;
  desa: string | null;
  type: string;
}

interface DataResponseDesa {
  lokasi: LokasiDesa;
}

const getAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${getBasePath()}/api/token`, { method: 'GET' });
    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.access_token) {
        return result.data.access_token;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm3 = searchParams.get("adm3");

  if (!adm3) {
    return NextResponse.json(
      { message: "Parameter 'adm3' tidak ditemukan" },
      { status: 400 }
    );
  }

  const token = await getAccessToken();

  if (!token) {
    console.error("Token tidak ditemukan, request dibatalkan.");
    return NextResponse.json(
      { message: "Token tidak ditemukan." },
      { status: 401 }
    );
  }

  try {
    const responseAPI = await fetch(`${CUACA_PROVINSI}adm3=${adm3}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (!responseAPI.ok) {
      console.error(`Error Response Code: ${responseAPI.status}`);
      return NextResponse.json(
        { message: `Gagal mengambil data: ${responseAPI.status}` },
        { status: responseAPI.status }
      );
    }

    const responseData = await responseAPI.json();
    const data: DataResponseDesa[] = responseData.data;

    const lokasiDesa = data.map((item) => ({
      adm4: item.lokasi.adm4,
      desa: item.lokasi.desa,
      type: item.lokasi.type,
    }));

    const result = lokasiDesa.filter((item) => item.desa !== null);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
