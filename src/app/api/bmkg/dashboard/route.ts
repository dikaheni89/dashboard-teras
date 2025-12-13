import { NextResponse } from 'next/server';
import {CUACA_PROVINSI, KODE_WILAYAH_PROVINSI} from "@/config/server-constant";
// remove filesystem dependency
import {getBasePath} from "@/libs/utils/getBasePath";

type CuacaEntry = {
  datetime: string;
  local_datetime: string;
  [key: string]: unknown;
};

type LokasiCuaca = {
  lokasi: Record<string, unknown>;
  cuaca: CuacaEntry[][];
};

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
  };
  update_time: string;
  update_hour: string;
  local_time: string;
};

export type ResponseDataAPI = {
  status: number;
  server_time: string;
  data: WeatherData[];
};

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
    const token = await getAccessToken();

    const responseAPI = await fetch(`${CUACA_PROVINSI}` + `${KODE_WILAYAH_PROVINSI}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    console.log(responseAPI);

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

    const filteredData = result.data?.map((item: LokasiCuaca) => {
      const flatCuaca = item.cuaca.flat();

      const beforeOrEqualNow = flatCuaca
        .filter((entry: CuacaEntry) => entry.local_datetime <= currentLocalDatetime)
        .sort((a, b) => b.local_datetime.localeCompare(a.local_datetime));

      const afterNow = flatCuaca
        .filter((entry: CuacaEntry) => entry.local_datetime > currentLocalDatetime)
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
      .filter((item: unknown): item is ResponseDataAPI => item !== null);

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
