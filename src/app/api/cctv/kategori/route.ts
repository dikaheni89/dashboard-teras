import { NextResponse } from 'next/server';
import { URL_CCTV } from "@/config/server-constant";

interface CCTVPosition {
  lat: string;
  lng: string;
}

export interface CCTV {
  id: string;
  name: string;
  address: string;
  position: CCTVPosition;
  kondisi: string;
}

export interface Area {
  uuid: string;
  area: string;
  cctvs: CCTV[];
}

export interface IResponse {
  success: boolean;
  data: Area[];
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa dihubungkan ke external logging seperti Sentry, LogRocket, dsb.
  }
};

export async function GET() {
  try {
    const response = await fetch(`${URL_CCTV}daftar-cctv`);

    if (!response.ok) {
      logError(`Error ${response.status}: ${response.statusText}`);
      return NextResponse.json(
        { success: false, message: 'Data tidak dapat diambil, silakan coba lagi.' },
        { status: response.status }
      );
    }

    const rawData: Area[] = await response.json();

    const formattedData: Area[] = rawData.map((area): Area => ({
      uuid: area.uuid,
      area: area.area,
      cctvs: area.cctvs.map((cctv): CCTV => ({
        id: cctv.id,
        name: cctv.name,
        address: cctv.address,
        position: {
          lat: cctv.position.lat,
          lng: cctv.position.lng,
        },
        kondisi: cctv.kondisi,
      }))
    }));

    const responseData: IResponse = {
      success: true,
      data: formattedData,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
