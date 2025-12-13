import { NextResponse } from 'next/server';
import { CUACA_PROVINSI } from "@/config/server-constant";
// remove filesystem dependency
import {getBasePath} from "@/libs/utils/getBasePath";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adm4 = searchParams.get('adm4');

    if (!adm4) {
      return NextResponse.json(
        {
          status: 400,
          message: "Parameter adm2 tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const responseAPI = await fetch(`${CUACA_PROVINSI}adm4=${adm4}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
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
    const filteredData = result.data.find((item: WeatherData) => item.lokasi.adm4 === adm4);

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
