'use client';

import useGetData from "@/app/hooks/useGetData";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";
import { getBasePath } from "@/libs/utils/getBasePath";
import { IResponse } from "@/app/api/kependudukan/blanko/route";
import { IResponseAktivasi } from "@/app/api/kependudukan/aktivasi/route";
import { IResponseCapaian } from "@/app/api/kependudukan/capaian/route";
import ReactECharts from "echarts-for-react";

const endpoints = {
  blanko: `${getBasePath()}/api/kependudukan/blanko`,
  aktivasi: `${getBasePath()}/api/kependudukan/aktivasi`,
  capaian: `${getBasePath()}/api/kependudukan/capaian`
};

export default function StatistikBlanko() {
  const {
    data: dataBlanko,
    isLoading: isLoadingBlanko,
    isError: isErrorBlanko
  } = useGetData<IResponse>(endpoints.blanko.toString());

  const {
    data: dataAktivasi,
    isLoading: isLoadingAktivasi,
    isError: isErrorAktivasi
  } = useGetData<IResponseAktivasi>(endpoints.aktivasi.toString());

  const {
    data: dataCapaian,
    isLoading: isLoadingCapaian,
    isError: isErrorCapaian
  } = useGetData<IResponseCapaian>(endpoints.capaian.toString());

  // --- Blangko ---
  const namaKabKota = dataBlanko?.data.map(item => item.nama_kabkota);
  const sisaBlangko = dataBlanko?.data.map(item => item.sisa_blktp);

  const imageMapping: Record<string, string> = {
    "Kab. Pandeglang": "/static/logo/pandeglang.png",
    "Kab. Lebak": "/static/logo/lebak.png",
    "Kab. Tangerang": "/static/logo/kabtangerang.png",
    "Kab. Serang": "/static/logo/kabserang.png",
    "Kota Tangerang": "/static/logo/kotatangerang.png",
    "Kota Cilegon": "/static/logo/cilegon.png",
    "Kota Serang": "/static/logo/kotaserang.png",
    "Kota Tangerang Selatan": "/static/logo/kotatangerangselatan.png"
  };

  const markPoints = namaKabKota?.map((name, index) => ({
    name,
    value: sisaBlangko?.[index] ?? 0,
    xAxis: name,
    yAxis: sisaBlangko?.[index] ?? 0,
    symbol: `image://${imageMapping[name]}`,
    symbolOffset: [0, -35],
    symbolSize: [25, 25],
    label: { show: false }
  }));

  const optionBlanko = {
    legend: { data: ["Sisa Blangko KTP"], top: 10 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      axisLabel: { rotate: 30, fontSize: 10, color: "#1E3A8A" },
      data: namaKabKota
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Sisa Blangko KTP",
        type: "bar",
        data: sisaBlangko,
        itemStyle: { color: "#4ADE80" },
        label: { show: true, position: "top", formatter: '{c}' },
        markPoint: { data: markPoints }
      }
    ]
  };

  // --- Aktivasi ---
  const namaKabKotaAktivasi = dataAktivasi?.data.map(item => item.nama_kabkota ?? "Tidak Diketahui");
  const jumlahAktivasi = dataAktivasi?.data.map(item => item.aktivasi_ikd ?? 0);

  const optionAktivasi = {
    legend: { data: ["Jumlah Aktivasi IKD"], top: 10 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      axisLabel: { rotate: 30, fontSize: 10, color: "#1E3A8A" },
      data: namaKabKotaAktivasi
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Jumlah Aktivasi IKD",
        type: "bar",
        data: jumlahAktivasi,
        itemStyle: { color: "#A3E635" },
        label: { show: true, position: "top", formatter: '{c}' }
      }
    ]
  };

  // --- Capaian ---
  const namaKabKotaCapaian = dataCapaian?.data.map(item => item.nama_kabkota);
  const persenAkta = dataCapaian?.data.map(item => parseFloat(item.persen_akta));
  const persenKIA = dataCapaian?.data.map(item => parseFloat(item.persen_kia));
  const persenKTP = dataCapaian?.data.map(item => parseFloat(item.persen_ktp));

  const labelOption = {
    show: true,
    position: 'insideTop',
    distance: 50,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}%',
    fontSize: 8,
    color: '#000'
  };

  const optionCapaian = {
    legend: { data: ['Akta', 'KIA', 'KTP'], top: 10 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) =>
        params.map((item: any) => `${item.seriesName}: ${item.value}%`).join('<br>')
    },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      axisTick: { show: false },
      axisLabel: { rotate: 30, fontSize: 10, color: '#1E3A8A' },
      data: namaKabKotaCapaian
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 110,
      axisLabel: { formatter: '{value} %' }
    },
    series: [
      { name: 'Akta', type: 'bar', label: labelOption, itemStyle: { color: '#4ADE80' }, data: persenAkta },
      { name: 'KIA', type: 'bar', label: labelOption, itemStyle: { color: '#60A5FA' }, data: persenKIA },
      { name: 'KTP', type: 'bar', label: labelOption, itemStyle: { color: '#F59E0B' }, data: persenKTP }
    ]
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      {/* Box: Blangko */}
      <Box flex="1" bg="primary.50" p={6} borderRadius="2xl" shadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>Jumlah Blangko Per Wilayah</Heading>
        {isLoadingBlanko ? (
          <Center h="300px"><Spinner size="lg" /></Center>
        ) : isErrorBlanko || !dataBlanko ? (
          <Center h="300px"><Text color="red.500">Gagal mengambil data dari server.</Text></Center>
        ) : (
          <ReactECharts option={optionBlanko} style={{ width: '100%', height: '400px' }} />
        )}
      </Box>

      {/* Box: Aktivasi */}
      <Box flex="1" bg="primary.50" p={6} borderRadius="2xl" shadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>Jumlah Aktivasi IKD</Heading>
        {isLoadingAktivasi ? (
          <Center h="300px"><Spinner size="lg" /></Center>
        ) : isErrorAktivasi || !dataAktivasi ? (
          <Center h="300px"><Text color="red.500">Gagal mengambil data dari server.</Text></Center>
        ) : (
          <ReactECharts option={optionAktivasi} style={{ width: '100%', height: '400px' }} />
        )}
      </Box>

      {/* Box: Capaian */}
      <Box flex="1" bg="primary.50" p={6} borderRadius="2xl" shadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>Pencapaian Target</Heading>
        {isLoadingCapaian ? (
          <Center h="300px"><Spinner size="lg" /></Center>
        ) : isErrorCapaian || !dataCapaian ? (
          <Center h="300px"><Text color="red.500">Gagal mengambil data dari server.</Text></Center>
        ) : (
          <ReactECharts option={optionCapaian} style={{ width: '100%', height: '400px' }} />
        )}
      </Box>
    </Flex>
  );
}
