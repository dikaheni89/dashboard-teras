import { NextResponse } from 'next/server';

export type WeatherData = {
  lokasi: {
    adm1: string;
    adm4: string;
    provinsi: string;
    kotkab: string;
    lon: number;
    lat: number;
    timezone: string;
    type: string;
  };
  cuaca: {
    datetime: string;
    tmin: number;
    tmax: number;
    humin: number;
    humax: number;
    tcc: number;
    wd: string;
    ws: number;
    vs: number;
    weather: number;
    weather_desc: string;
    weather_desc_en: string;
    image: string;
    analysis_date: string;
    local_datetime: string;
  }[];
  update_time: string;
  update_hour: string;
};

export type ResponseDataAPI = {
  status: number;
  server_time: string;
  data: WeatherData[];
};

function getRoundedDownLocalDatetimeString(): string {
  const now = new Date();
  const offsetInMs = 7 * 60 * 60 * 1000;
  const wibDate = new Date(now.getTime() + offsetInMs);

  const year = wibDate.getUTCFullYear();
  const month = `${wibDate.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${wibDate.getUTCDate()}`.padStart(2, "0");
  const hour = `${wibDate.getUTCHours()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:00:00`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adm4 = searchParams.get('adm4');

    if (!adm4) {
      return NextResponse.json(
        {
          status: 400,
          message: "Parameter adm4 tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // adm4 format: 36.02.01.2001 (example)
    // We need parent adm3: 36.02.01
    const adm3 = adm4.split('.').slice(0, 3).join('.');

    const responseAPI = await fetch(`https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather?adm=${adm3}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': 'HOX0kpMqnpbJD8eo',
        'X-APPLICATION-KEY': 'webterpadu',
        'Accept': 'application/json',
      },
    });

    if (!responseAPI.ok) {
      const responseText = await responseAPI.text();
      return NextResponse.json(
        {
          status: responseAPI.status,
          message: responseText,
        },
        { status: responseAPI.status }
      );
    }

    const result = await responseAPI.json();
    const currentLocalDatetime = getRoundedDownLocalDatetimeString();

    // Cari data berdasarkan adm4
    const filteredData = result.data.find((item: WeatherData) => item.lokasi.adm4 === adm4 && item.lokasi.type === 'adm4');

    if (!filteredData) {
      return NextResponse.json(
        {
          status: 404,
          message: `Data cuaca untuk kode wilayah ${adm4} tidak ditemukan`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        server_time: currentLocalDatetime,
        data: filteredData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Terjadi kesalahan saat mengambil data cuaca",
      },
      { status: 500 }
    );
  }
}
