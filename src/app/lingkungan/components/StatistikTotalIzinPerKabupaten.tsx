'use client';

import useGetData from "@/app/hooks/useGetData";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";
import { getBasePath } from "@/libs/utils/getBasePath";
import ReactECharts from "echarts-for-react";
import { IResponseIzinPerWilayah, IzinPerWilayah } from "@/app/api/lingkungan/izinkabupaten/route";

const endpoint = `${getBasePath()}/api/lingkungan/izinkabupaten`;

const imageMapping: Record<string, string> = {
  "Kab. Pandeglang": "/static/logo/pandeglang.png",
  "Kab. Lebak": "/static/logo/lebak.png",
  "Kab. Tangerang": "/static/logo/kabtangerang.png",
  "Kab. Serang": "/static/logo/kabserang.png",
  "Kota Tangerang": "/static/logo/kotatangerang.png",
  "Kota Cilegon": "/static/logo/cilegon.png",
  "Kota Serang": "/static/logo/kotaserang.png",
  "Kota Tangerang Selatan": "/static/logo/kotatangerangselatan.png",
};

const palette = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#14B8A6", "#F97316", "#22C55E",
];

export default function StatistikTotalIzinPerKabupaten() {
  const { data, isLoading, isError } = useGetData<IResponseIzinPerWilayah>(endpoint.toString());

  const row: IzinPerWilayah | undefined = data?.data?.[0];

  const keyOrder: Array<keyof IzinPerWilayah> = [
    "kabupaten_lebak",
    "kabupaten_pandeglang",
    "kabupaten_serang",
    "kabupaten_tangerang",
    "kota_cilegon",
    "kota_serang",
    "kota_tangerang",
    "kota_tanggerang_selatan",
  ];

  const labelMap: Record<keyof IzinPerWilayah, string> = {
    kabupaten_lebak: "Kab. Lebak",
    kabupaten_pandeglang: "Kab. Pandeglang",
    kabupaten_serang: "Kab. Serang",
    kabupaten_tangerang: "Kab. Tangerang",
    kota_cilegon: "Kota Cilegon",
    kota_serang: "Kota Serang",
    kota_tangerang: "Kota Tangerang",
    kota_tanggerang_selatan: "Kota Tangerang Selatan",
    total_izin: "Total Izin",
  };

  const categories = keyOrder.map((k) => labelMap[k]);
  const numericValues = keyOrder.map((k) => Number(row?.[k] ?? 0));

  const seriesData = numericValues.map((v, i) => ({
    value: v,
    itemStyle: { color: palette[i % palette.length] },
    label: { show: true, position: "top" as const },
  }));

  const markPoints = categories
    .map((name, i) => {
      const img = imageMapping[name];
      if (!img) return null;
      return {
        name,
        value: numericValues[i],
        xAxis: name,
        yAxis: numericValues[i],
        symbol: `image://${img}`,
        symbolSize: [24, 24],
        symbolOffset: [0, -18],
        label: { show: false },
      };
    })
    .filter(Boolean) as any[];

  const optionBar = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any[]) => {
        const p = params?.[0];
        return `${p?.name}<br/>Total: <b>${p?.value}</b>`;
      },
    },
    grid: { left: "5%", right: "4%", bottom: 80, top: 30, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: categories,
      axisLabel: { rotate: 25, fontSize: 10, color: "#1E3A8A" },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value" as const,
      minInterval: 1,
      name: "Total",
    },
    series: [
      {
        name: "Jumlah Izin",
        type: "bar" as const,
        data: seriesData,
        barMaxWidth: 40,
        emphasis: { focus: "series" as const },
        markPoint: { data: markPoints },
      },
    ],
    animationDuration: 400,
  };

  if (isLoading) {
    return (
      <Center h="360px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="200px">
        <Text color="red.500">Gagal memuat data</Text>
      </Center>
    );
  }

  if (!data?.success || !row) {
    return (
      <Center h="200px">
        <Text color="red.500">Data tidak tersedia.</Text>
      </Center>
    );
  }

  return (
    <Flex direction="column" gap={4} p={4}>
      <Box p={6} borderRadius="2xl">
        <ReactECharts option={optionBar} style={{ width: "100%", height: "500px" }} />
      </Box>
    </Flex>
  );
}
