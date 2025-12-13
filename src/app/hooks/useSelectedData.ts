import { useEffect, useState } from "react";

const useWeatherData = (selectedKabupaten: any, selectedKecamatan: any, selectedDesa: any) => {
  const [dataCuaca, setDataCuaca] = useState([]);
  const [dataLokasi, setDataLokasi] = useState(null);
  const [isLoadingCuaca, setIsLoadingCuaca] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoadingCuaca(true);

      try {
        let response, result;

        if (selectedDesa) {
          response = await fetch(
            `http://localhost:3000/api/bmkg/desa?adm4=${selectedDesa}`
          );
        } else if (selectedKecamatan) {
          response = await fetch(
            `http://localhost:3000/api/bmkg/kecamatan?adm3=${selectedKecamatan}`
          );
        } else if (selectedKabupaten) {
          const adm2 = selectedKabupaten ?? "36.01";
          response = await fetch(
            `http://localhost:3000/api/bmkg/kabupaten?adm2=${adm2}`
          );
        } else {
          setIsLoadingCuaca(false);
          return;
        }

        if (response.ok) {
          result = await response.json();
          setDataCuaca(result.data.cuaca.slice(0, 7));
          setDataLokasi(result.data.lokasi);
        } else {
          console.error("❌ Gagal mengambil data:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching weather data:", error);
      } finally {
        setIsLoadingCuaca(false);
      }
    };

    fetchWeatherData();
  }, [selectedKabupaten, selectedKecamatan, selectedDesa]);

  return {
    dataCuaca,
    dataLokasi,
    isLoadingCuaca,
  };
};

export default useWeatherData;
