import { NextResponse } from 'next/server';

export type WeatherData = {
  lokasi: {
    adm1: string;
    adm2: string;
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
    const adm2 = searchParams.get('adm2');

    if (!adm2) {
      return NextResponse.json(
        {
          status: 400,
          message: "Parameter adm2 tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const responseAPI = await fetch('https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather?adm=36', {
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

    // Cari data berdasarkan adm2
    const filteredData = result.data.find((item: WeatherData) => item.lokasi.adm2 === adm2);

    if (!filteredData) {
      return NextResponse.json(
        {
          status: 404,
          message: `Data cuaca untuk kode wilayah ${adm2} tidak ditemukan`,
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
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Terjadi kesalahan saat mengambil data cuaca",
      },
      { status: 500 }
    );
  }
}
