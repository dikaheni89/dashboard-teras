import { NextResponse } from 'next/server';

interface LokasiDesa {
  adm4: string | null;
  desa: string | null;
  type: string;
}

interface DataResponseDesa {
  lokasi: LokasiDesa;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm3 = searchParams.get("adm3");

  if (!adm3) {
    return NextResponse.json(
      { message: "Parameter 'adm3' tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const responseAPI = await fetch(`https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather?adm=${adm3}`, {
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
    const data: DataResponseDesa[] = responseData.data;

    const lokasiDesa = data.map((item) => ({
      adm4: item.lokasi.adm4,
      desa: item.lokasi.desa,
      type: item.lokasi.type,
    }));

    const result = lokasiDesa.filter((item) => item.desa !== null && item.type === 'adm4');

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}
