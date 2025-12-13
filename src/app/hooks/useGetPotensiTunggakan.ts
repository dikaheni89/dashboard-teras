import { useEffect, useState } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import { JumlahKendaraan } from '../api/pendapatan/potensitunggakan/route';

export interface Sekolah {
  total_potensi: number;
  total_tunggakan: number;
  wilayah: string;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: JumlahKendaraan[];
}

export default function useGetPotensiTunggakan(
  kabupaten_kota: string,
  kendaraan: string,
  plat: string
) {
  const [data, setData] = useState<IResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    const queryParams = new URLSearchParams();
    if (kabupaten_kota) queryParams.append("kabupaten_kota", kabupaten_kota);
    if (kendaraan) queryParams.append("kendaraan", kendaraan);
    if (plat) queryParams.append("plat", plat);

    const url = `${getBasePath()}/api/pendapatan/potensitunggakan?${queryParams.toString()}`;
    console.log('Fetching URL:', url);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Fetch Error ${res.status}: ${res.statusText}`);
        setIsError(true);
        return;
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch failed:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [kabupaten_kota, kendaraan, plat]);


  return {
    data,
    isLoading,
    isError,
  };
}