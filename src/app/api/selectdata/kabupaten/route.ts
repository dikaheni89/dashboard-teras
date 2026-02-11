import { NextResponse } from 'next/server';

interface LokasiKabupaten {
  adm2: string | null;
  kotkab: string | null;
  type: string;
}

interface DataResponseKabupaten {
  lokasi: LokasiKabupaten;
}

export async function GET() {
  try {
    const responseAPI = await fetch('https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather?adm=36', {
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
