import { NextResponse } from 'next/server';

export interface IParamedicSchedule {
  operational_time_name: string;
  paramedic_id: string;
  paramedic_name: string;
  schedule_date: string;
  service_unit_name: string;
}

export interface IResponseParamedice {
  status: number;
  success: boolean;
  message: string;
  data: {
    last_updated: IParamedicSchedule[];
  };
}

const logError = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error?.message);
  } else {
    // Bisa diganti ke tools logging eksternal
    // Contoh: Sentry.captureException(error);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulanParam = searchParams.get('bulan');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const bulan = bulanParam && bulanParam !== 'current' ? bulanParam : `${year}-${month}`;

    const externalUrl = `https://api-dashboard.bantenprov.go.id/api/rsud-malingping/jadwal/list?bulan=${bulan}`;

    const responseAPI = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pantangpulang-SEBELUMTELANJANG#!-b4nt3n',
      },
    });

    if (!responseAPI.ok) {
      logError(`Error ${responseAPI.status}: ${responseAPI.statusText}`);
      return NextResponse.json(
        {
          status: responseAPI.status,
          success: false,
          message: 'Data tidak dapat diambil, silakan coba lagi.',
        },
        { status: responseAPI.status }
      );
    }

    const raw = await responseAPI.json();

    const list: any[] =
      Array.isArray(raw) ? raw :
      Array.isArray(raw?.data?.last_updated) ? raw.data.last_updated :
      Array.isArray(raw?.data) ? raw.data :
      Array.isArray(raw?.list) ? raw.list :
      Array.isArray(raw?.items) ? raw.items : [];

    const normalized: IParamedicSchedule[] = list.map((item: any) => ({
      operational_time_name: item.operational_time_name ?? item.operational_time ?? item.time ?? '',
      paramedic_id: String(item.paramedic_id ?? item.id ?? ''),
      paramedic_name: item.paramedic_name ?? item.name ?? '',
      schedule_date: item.schedule_date ?? item.date ?? '',
      service_unit_name: item.service_unit_name ?? item.unit_name ?? item.service_unit ?? '',
    })).filter((x: IParamedicSchedule) =>
      x.schedule_date && x.paramedic_name && x.service_unit_name
    );

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: 'Sukses',
        data: {
          last_updated: normalized,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logError('Fetch Error:', error as Error);

    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Terjadi kesalahan pada server, silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
