'use client';

import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  Center,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import useGetTagihan from '@/app/hooks/useGetTagihan';
import ReactECharts from "echarts-for-react";

const kotaOptions = [
  { value: 'Provinsi Banten', label: 'Provinsi Banten' },
  { value: 'Kota Serang', label: 'Kota Serang' },
  { value: 'Kota Tangerang Selatan', label: 'Kota Tangerang Selatan' },
  { value: 'Kota Tangerang', label: 'Kota Tangerang' },
  { value: 'Kota Cilegon', label: 'Kota Cilegon' },
  { value: 'Kab. Tangerang', label: 'Kab. Tangerang' },
  { value: 'Kab. Pandeglang', label: 'Kab. Pandeglang' },
  { value: 'Kab. Lebak', label: 'Kab. Lebak' },
  { value: 'Kab. Serang', label: 'Kab. Serang' },
];

const kodeOptions = [
  { value: 'Opsen PKB', label: 'Opsen PKB' },
  { value: 'Opsen BBNKB', label: 'Opsen BBNKB' },
  { value: 'Denda Opsen BBNKB', label: 'Denda Opsen BBNKB' },
  { value: 'Denda Opsen PKB', label: 'Denda Opsen PKB' },
];

const tahunOptions = [
  { value: '2025', label: '2025' },
];

export default function ByTagihanWidget() {
  const [selectedKota, setSelectedKota] = useState('');
  const [selectedKode, setSelectedKode] = useState('');
  const [selectedTahun, setSelectedTahun] = useState('');

  const queryParams = new URLSearchParams();
  if (selectedKota) queryParams.append("kabupaten_kota", selectedKota);
  if (selectedKode) queryParams.append("keterangan_kode", selectedKode);
  if (selectedTahun) queryParams.append("plat", selectedTahun);
  const { data, isLoading, isError } = useGetTagihan(
    selectedKota,
    selectedKode,
    selectedTahun
  );

  
  // --- Data mapping ---
  const wilayah = data?.data.map(item => item.wilayah);
  const bulan = data?.data.map(item => item.bulan);
  const sum_sts_1 = data?.data.map(item => item. sum_sts_1);
  const sum_sts_2 = data?.data.map(item => item. sum_sts_2);
  const sum_sts_3 = data?.data.map(item => item. sum_sts_3);
  const sum_sts_4 = data?.data.map(item => item. sum_sts_4);
function normalizeWilayah(name: string) {
  return name
    .trim()                // buang spasi depan/belakang
    .replace(/\s+/g, " "); // ganti spasi ganda jadi 1
}
  // Logo mapping
  const imageMapping: Record<string, string> = {
    "Provinsi Banten": "/static/logo/banten.png",
    "Kab. Pandeglang": "/static/logo/pandeglang.png",
    "Kab. Lebak": "/static/logo/lebak.png",
    "Kab. Tangerang": "/static/logo/kabtangerang.png",
    "Kab. Serang": "/static/logo/kabserang.png",
    "Kota Tangerang": "/static/logo/kotatangerang.png",
    "Kota Cilegon": "/static/logo/cilegon.png",
    "Kota Serang": "/static/logo/kotaserang.png",
    "Kota Tangerang Selatan": "/static/logo/kotatangerangselatan.png"
  };

  // Logo hanya 1x per wilayah → markPoint hanya sekali (bukan per seri)
  const markPoints = wilayah?.map((rawName, index) => {
  const name = normalizeWilayah(rawName);
  return {
    name,
    value: Math.max(sum_sts_1?.[index] ?? 0, sum_sts_2?.[index] ?? 0, sum_sts_3?.[index] ?? 0, sum_sts_4?.[index] ?? 0),
    xAxis: name,
    yAxis: Math.max(sum_sts_1?.[index] ?? 0, sum_sts_2?.[index] ?? 0, sum_sts_3?.[index] ?? 0, sum_sts_4?.[index] ?? 0),
    symbol: `image://${imageMapping[name] || "/static/logo/banten.png"}`,
    symbolOffset: [0, -40],
    symbolSize: [28, 28],
    label: { show: false }
  };
});

// Tentukan type untuk setiap seri chart
type SeriesItem = {
  name: string;
  type: string;
  data: number[] | undefined;
  itemStyle: { color: string };
  label: {
    show: boolean;
    position: string;
    formatter: (params: any) => string;
  };
  markPoint: { data: any[] | undefined };
};

// Map seri berdasarkan jenis kode
const seriesMap: Record<string, SeriesItem[]> = {
  "Opsen PKB": [
    {
      name: "Opsen PKB",
      type: "bar",
      data: sum_sts_1,
      itemStyle: { color: "#27b059ff" },
      label: {
        show: true,
        position: "top",
        formatter: (params: any) =>
          new Intl.NumberFormat("id-ID").format(params.value),
      },
      markPoint: { data: markPoints },
    },
  ],
  "Opsen BBNKB": [
    {
      name: "Opsen BBNKB",
      type: "bar",
      data: sum_sts_2,
      itemStyle: { color: "#fcfc34ff" },
      label: {
        show: true,
        position: "top",
        formatter: (params: any) =>
          new Intl.NumberFormat("id-ID").format(params.value),
      },
      markPoint: { data: markPoints },
    },
  ],
  "Denda Opsen BBNKB": [
    {
      name: "Denda Opsen BBNKB",
      type: "bar",
      data: sum_sts_4,
      itemStyle: { color: "#34affcff" },
      label: {
        show: true,
        position: "top",
        formatter: (params: any) =>
          new Intl.NumberFormat("id-ID").format(params.value),
      },
      markPoint: { data: markPoints },
    },
  ],
  "Denda Opsen PKB": [
    {
      name: "Denda Opsen PKB",
      type: "bar",
      data: sum_sts_3,
      itemStyle: { color: "#9134fcff" },
      label: {
        show: true,
        position: "top",
        formatter: (params: any) =>
          new Intl.NumberFormat("id-ID").format(params.value),
      },
      markPoint: { data: markPoints },
    },
  ],
};

// Jika belum dipilih (semua pajak), tampilkan semua
const activeSeries: SeriesItem[] =
  selectedKode && seriesMap[selectedKode]
    ? seriesMap[selectedKode]
    : [
        ...seriesMap["Opsen PKB"],
        ...seriesMap["Opsen BBNKB"],
        ...seriesMap["Denda Opsen BBNKB"],
        ...seriesMap["Denda Opsen PKB"],
      ];

const optionTagihan = {
  legend: {
    data: activeSeries.map((s: SeriesItem) => s.name),
    top: 10,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params: any) => {
      let tooltip = params[0].axisValue + "<br/>";
      params.forEach((p: any) => {
        tooltip += `${p.marker} ${p.seriesName}: <b>${new Intl.NumberFormat(
          "id-ID"
        ).format(p.value)}</b><br/>`;
      });
      return tooltip;
    },
  },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    axisLabel: { rotate: 30, fontSize: 10, color: "#1E3A8A" },
    data: bulan,
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (val: number) =>
        new Intl.NumberFormat("id-ID").format(val),
    },
  },
  series: activeSeries,
};



  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      <Box flex="1" bg="primary.50" p={6} borderRadius="2xl" shadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>Jumlah Tagihan Pajak Kendaraan</Heading>

        {/* Filter Section */}
        <Flex gap={4} mb={4} wrap="wrap">
          <Select
            maxW="200px"
            value={selectedKota}
            onChange={(e) => setSelectedKota(e.target.value)}
            placeholder="Pilih Kabupaten/Kota"
          >
            {kotaOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>

          <Select
            maxW="200px"
            value={selectedKode}
            onChange={(e) => setSelectedKode(e.target.value)}
            placeholder="Semua Jenis Pajak"
          >
            {kodeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>

          <Select
            maxW="200px"
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            placeholder="Pilih Tahun"
          >
            {tahunOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </Flex>

        {/* Chart */}
        {isLoading ? (
          <Center h="300px"><Spinner size="lg" /></Center>
        ) : isError || !data ? (
          <Center h="300px"><Text color="red.500">Gagal mengambil data dari server.</Text></Center>
        ) : (
          <ReactECharts option={optionTagihan} style={{ width: '100%', height: '400px' }} />
        )}
      </Box>
    </Flex>
  );
}
