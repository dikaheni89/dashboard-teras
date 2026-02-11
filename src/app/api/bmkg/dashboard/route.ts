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

    // Cari lokasi Kota Serang sebagai default untuk prakiraan cuaca
    // Jika tidak ada, gunakan lokasi pertama
    const targetLocation = result.data?.find((item: LokasiCuaca) => item.lokasi.kotkab === 'Kota Serang') || result.data?.[0];

    let filteredData: WeatherData[] = [];

    if (targetLocation) {
      const flatCuaca = targetLocation.cuaca;
      
      // Group by date and pick one representative (e.g., closest to 12:00)
      const dailyForecast = new Map<string, CuacaDetail>();

      flatCuaca.forEach((entry: CuacaDetail) => {
        // entry.local_datetime format: "YYYY-MM-DD HH:mm:ss"
        const datePart = entry.local_datetime.split(' ')[0]; // YYYY-MM-DD
        
        if (!dailyForecast.has(datePart)) {
          dailyForecast.set(datePart, entry);
        } else {
          // If we already have an entry, check if this one is closer to 12:00
          const existing = dailyForecast.get(datePart)!;
          const existingHour = parseInt(existing.local_datetime.split(' ')[1].split(':')[0], 10);
          const currentHour = parseInt(entry.local_datetime.split(' ')[1].split(':')[0], 10);
          
          // Prefer time closer to 12
          if (Math.abs(currentHour - 12) < Math.abs(existingHour - 12)) {
            dailyForecast.set(datePart, entry);
          }
        }
      });

      // Convert Map to array and sort by date
      const sortedDates = Array.from(dailyForecast.keys()).sort();
      
      filteredData = sortedDates.map(date => {
        const current = dailyForecast.get(date)!;
        return {
          lokasi: targetLocation.lokasi,
          cuaca: current,
          update_time: current.datetime,
          update_hour: extractUTCTime(current.datetime),
          local_time: current.local_datetime,
        };
      });
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
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
