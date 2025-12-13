import { useEffect, useState } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import { JumlahKendaraan } from '../api/pendapatan/tagihan/route';

export interface Sekolah {
  bulan: number;
  sum_sts_1: number;
  sum_sts_2: number;
  sum_sts_3: number;
  sum_sts_4: number;
  tahun: number;
  wilayah: string;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: JumlahKendaraan[];
}

export default function useGetTagihan(
    kabupaten_kota: string,
    keterangan_kode: string,
  tahun: string,
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
    if (keterangan_kode) queryParams.append("keterangan_kode", keterangan_kode);
    if (tahun) queryParams.append("tahun", tahun);

    const url = `${getBasePath()}/api/pendapatan/tagihan?${queryParams.toString()}`;
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
}, [kabupaten_kota, keterangan_kode, tahun]);


  return {
    data,
    isLoading,
    isError,
  };
}