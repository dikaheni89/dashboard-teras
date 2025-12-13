import { NextResponse } from 'next/server';
import {CUACA_PROVINSI} from "@/config/server-constant";
// remove filesystem dependency
import {getBasePath} from "@/libs/utils/getBasePath";

interface LokasiKecamatan {
  adm3: string | null;
  kecamatan: string | null;
  type: string;
}

interface DataResponseKecamatan {
  lokasi: LokasiKecamatan;
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
  const adm2 = searchParams.get("adm2");

  if (!adm2) {
    return NextResponse.json(
      { message: "Parameter 'adm2' tidak ditemukan" },
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
    const responseAPI = await fetch(`${CUACA_PROVINSI}adm2=${adm2}`, {
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
    const data: DataResponseKecamatan[] = responseData.data;

    const lokasiKecamatan = data.map((item) => ({
      adm3: item.lokasi.adm3,
      kecamatan: item.lokasi.kecamatan,
      type: item.lokasi.type,
    }));

    const result = lokasiKecamatan.filter((item) => item.kecamatan !== null);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
