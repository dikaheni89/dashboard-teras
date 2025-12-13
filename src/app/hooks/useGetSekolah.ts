import { useEffect, useState } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';

export interface Sekolah {
  nama_satuan_pendidikan: string;
  npsn: string;
  bentuk_pendidikan: string;
  status_sekolah: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten_kota: string;
  jumlah_ruang_kelas: number;
  guru: number;
  tendik: number;
}

export interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: Sekolah[];
}

export default function useGetSekolah(
  kabupaten_kota: string,
  bentuk_pendidikan: string,
  status_sekolah: string
) {
  const [data, setData] = useState<IResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!kabupaten_kota || !bentuk_pendidikan || !status_sekolah) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      const queryParams = new URLSearchParams({
        kabupaten_kota,
        bentuk_pendidikan,
        status_sekolah,
      });

      const url = `${getBasePath()}/api/pendidikan/bysekolah?${queryParams.toString()}`;
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
  }, [kabupaten_kota, bentuk_pendidikan, status_sekolah]);

  return {
    data,
    isLoading,
    isError,
  };
}