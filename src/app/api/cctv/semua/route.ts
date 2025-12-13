import { NextResponse } from 'next/server';
import { URL_CCTV } from "@/config/server-constant";

interface CCTVPosition {
  lat: string;
  lng: string;
}

interface CCTV {
  id: string;
  name: string;
  address: string;
  position: CCTVPosition;
  tooltip: string;
  icon: string;
  draggable: boolean;
  visible: boolean;
  size: [number, number];
  status: {
    color: string;
    text: string;
  };
  kondisi: string;
}

export interface IResponse {
  success: boolean;
  data: CCTV[];
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
    const response = await fetch(URL_CCTV + 'cctv-lists');

    if (!response.ok) {
      logError(`Error ${response.status}: ${response.statusText}`);
      return NextResponse.json(
        { success: false, message: 'Data tidak dapat diambil, silakan coba lagi.' },
        { status: response.status }
      );
    }

    const data: CCTV[] = await response.json();

    const responseData: IResponse = {
      success: true,
      data,
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
