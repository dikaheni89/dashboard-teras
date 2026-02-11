import { NextResponse } from 'next/server';


export type CuacaDetail = {
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
};

export type Lokasi = {
  adm1: string | null;
  adm2: string | null;
  kotkab: string | null;
  lat: number | null;
  lon: number | null;
  provinsi: string | null;
  timezone: string | null;
  type: string | null;
  [key: string]: unknown;
};

type LokasiCuaca = {
  lokasi: Lokasi;
  cuaca: CuacaDetail[];
};

export type WeatherData = {
  lokasi: Lokasi;
  cuaca: CuacaDetail;
  update_time: string;
  update_hour: string;
  local_time: string;
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

function extractUTCTime(datetime: string): string {
  const date = new Date(datetime);
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export async function GET() {
  try {
    const responseAPI = await fetch(`https://api-webterpadu.bantenprov.go.id/api/v1/splp/weather/?adm=36`, {
      method: 'GET',
      headers: {
        'X-API-KEY': 'HOX0kpMqnpbJD8eo',
        'X-APPLICATION-KEY': 'webterpadu'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!responseAPI.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch weather data' },
        { status: responseAPI.status }
      );
    }

    const result = await responseAPI.json();
    const currentLocalDatetime = getRoundedDownLocalDatetimeString();

    const filteredData = result.data?.map((item: LokasiCuaca) => {
      // In new API, cuaca is already 1D array of objects
      const flatCuaca = item.cuaca;

      const beforeOrEqualNow = flatCuaca
        .filter((entry: CuacaDetail) => entry.local_datetime <= currentLocalDatetime)
        .sort((a, b) => b.local_datetime.localeCompare(a.local_datetime));

      const afterNow = flatCuaca
        .filter((entry: CuacaDetail) => entry.local_datetime > currentLocalDatetime)
        .sort((a, b) => a.local_datetime.localeCompare(b.local_datetime));

      const current = beforeOrEqualNow[0] || afterNow[0];

      return current
        ? {
          lokasi: item.lokasi,
          cuaca: current,
          update_time: current.datetime,
          update_hour: extractUTCTime(current.datetime),
          local_time: current.local_datetime,
        }
        : null;
    })
      .filter((item: unknown): item is WeatherData => item !== null);

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
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
