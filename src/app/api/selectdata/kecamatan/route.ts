import { NextResponse } from 'next/server';

interface LokasiKecamatan {
  adm3: string | null;
  kecamatan: string | null;
  type: string;
}

interface DataResponseKecamatan {
  lokasi: LokasiKecamatan;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm2 = searchParams.get("adm2");

  if (!adm2) {
    return NextResponse.json(
      { message: "Parameter 'adm2' tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const responseAPI = await fetch(`https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather?adm=${adm2}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': 'HOX0kpMqnpbJD8eo',
        'X-APPLICATION-KEY': 'webterpadu',
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

    const result = lokasiKecamatan.filter((item) => item.kecamatan !== null && item.type === 'adm3');

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
