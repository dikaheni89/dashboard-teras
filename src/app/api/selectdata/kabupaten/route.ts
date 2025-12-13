import { NextResponse } from 'next/server';
import {CUACA_PROVINSI, KODE_WILAYAH_PROVINSI} from "@/config/server-constant";
// remove filesystem dependency
import {getBasePath} from "@/libs/utils/getBasePath";

interface LokasiKabupaten {
  adm2: string | null;
  kotkab: string | null;
  type: string;
}

interface DataResponseKabupaten {
  lokasi: LokasiKabupaten;
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

export async function GET() {
  const token = await getAccessToken();

  if (!token) {
    console.error("Token tidak ditemukan, request dibatalkan.");
    return NextResponse.json(
      { message: "Token tidak ditemukan." },
      { status: 401 }
    );
  }

  try {
    const responseAPI = await fetch(`${CUACA_PROVINSI}${KODE_WILAYAH_PROVINSI}`, {
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
    const data: DataResponseKabupaten[] = responseData.data;

    const lokasiKotkab = data.map((item) => ({
      adm2: item.lokasi.adm2,
      kotkab: item.lokasi.kotkab,
      type: item.lokasi.type,
    }));

    const result = lokasiKotkab.filter((item) => item.kotkab !== null);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
