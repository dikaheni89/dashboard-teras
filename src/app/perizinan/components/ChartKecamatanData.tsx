"use client";

import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import ReactECharts from "echarts-for-react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponse } from "@/app/api/perizinan/izinkecamatan/route";

export default function ChartKecamatanData() {
  const apiUrl = `${getBasePath()}/api/perizinan/izinkecamatan`;
  const { data, isLoading } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return (
      <Box minH="370px" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box minH="370px" display="flex" justifyContent="center" alignItems="center">
        <Text>Data tidak ditemukan atau terjadi kesalahan.</Text>
      </Box>
    );
  }

  // Mapping data
  const labels = data.data.map((item: any) => item.kecamatan.trim());
  const values = data.data.map((item: any) => item.jumlah);

  // Konfigurasi ECharts
  const dataPendudukOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const value = params[0].value;
        const formatted = new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
        return `${params[0].name}: ${formatted}`;
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        color: "#1E3A8A",
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: "#CBD5E1",
        },
      },
    },
    yAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        color: "#1E3A8A",
        fontWeight: "bold",
        fontSize: 10,
        interval: 0,
        rotate: 0,
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: "Jumlah Perizinan",
        type: "bar",
        data: values,
        itemStyle: {
          color: "#020b47",
          borderRadius: [0, 4, 4, 0],
        },
        barWidth: 15,
      },
    ],
  };

  return (
    <Box h="2200px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Jumlah Perizinan Berdasarkan Kecamatan
      </Heading>
      <Box height="250vh">
        <ReactECharts option={dataPendudukOption} style={{ height: "100%" }} />
      </Box>
    </Box>
  );
}
