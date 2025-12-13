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
import useGetPotensiTunggakan from '@/app/hooks/useGetPotensiTunggakan';
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

const kendaraanOptions = [
  { value: '', label: 'Semua Kendaraan' },
  { value: 'R2', label: 'Roda 2' },
  { value: 'R4', label: 'Roda 4' },
];

const platOptions = [
  { value: '', label: 'Semua Plat' },
  { value: 'Putih', label: 'Putih' },
  { value: 'Kuning', label: 'Kuning' },
  { value: 'Merah', label: 'Merah' },
];

export default function ByPotensiTunggakanWidget() {
  const [selectedKota, setSelectedKota] = useState('');
  const [selectedKendaraan, setSelectedKendaraan] = useState('');
  const [selectedPlat, setSelectedPlat] = useState('');

  const queryParams = new URLSearchParams();
  if (selectedKota) queryParams.append("kabupaten_kota", selectedKota);
  if (selectedKendaraan) queryParams.append("kendaraan", selectedKendaraan);
  if (selectedPlat) queryParams.append("plat", selectedPlat);
  const { data, isLoading, isError } = useGetPotensiTunggakan(
    selectedKota,
    selectedKendaraan,
    selectedPlat
  );

  
  // --- Data mapping ---
  const wilayah = data?.data.map(item => item.wilayah);
  const total_potensi = data?.data.map(item => item.total_potensi);
  const total_tunggakan = data?.data.map(item => item.total_tunggakan);
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
    value: Math.max(total_potensi?.[index] ?? 0, total_tunggakan?.[index] ?? 0),
    xAxis: name,
    yAxis: Math.max(total_potensi?.[index] ?? 0, total_tunggakan?.[index] ?? 0),
    symbol: `image://${imageMapping[name] || "/static/logo/banten.png"}`,
    symbolOffset: [0, -40],
    symbolSize: [28, 28],
    label: { show: false }
  };
});

  const optionPotensiTunggakan = {
  legend: { data: ["Potensi", "Tunggakan"], top: 10 },
  tooltip: { 
    trigger: "axis", 
    axisPointer: { type: "shadow" },
    formatter: (params: any) => {
      let tooltip = params[0].axisValue + "<br/>";
      params.forEach((p: any) => {
        tooltip += `${p.marker} ${p.seriesName}: <b>${new Intl.NumberFormat("id-ID").format(p.value)}</b><br/>`;
      });
      return tooltip;
    }
  },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    axisLabel: { rotate: 30, fontSize: 10, color: "#1E3A8A" },
    data: wilayah
  },
  yAxis: { 
    type: "value",
    axisLabel: { 
      formatter: (val: number) => new Intl.NumberFormat("id-ID").format(val) 
    }
  },
  series: [
    {
      name: "Potensi",
      type: "bar",
      data: total_potensi,
      itemStyle: { color: "#27b059ff" },
      label: { 
        show: true, 
        position: "top", 
        formatter: (params: any) => new Intl.NumberFormat("id-ID").format(params.value)
      },
      markPoint: {
        data: markPoints,
      }
    },
    {
      name: "Tunggakan",
      type: "bar",
      data: total_tunggakan,
      itemStyle: { color: "#fcfc34ff" },
      label: { 
        show: true, 
        position: "top", 
        formatter: (params: any) => new Intl.NumberFormat("id-ID").format(params.value)
      }
    }
  ],
};


  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      <Box flex="1" bg="primary.50" p={6} borderRadius="2xl" shadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>Jumlah Potensi dan Tunggakan Kendaraan</Heading>

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
            value={selectedKendaraan}
            onChange={(e) => setSelectedKendaraan(e.target.value)}
            placeholder="Pilih Kendaraan"
          >
            {kendaraanOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>

          <Select
            maxW="200px"
            value={selectedPlat}
            onChange={(e) => setSelectedPlat(e.target.value)}
            placeholder="Pilih Plat"
          >
            {platOptions.map(opt => (
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
          <ReactECharts option={optionPotensiTunggakan} style={{ width: '100%', height: '400px' }} />
        )}
      </Box>
    </Flex>
  );
}
