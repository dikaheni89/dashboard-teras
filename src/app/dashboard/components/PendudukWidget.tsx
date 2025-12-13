"use client";

import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import ReactECharts from "echarts-for-react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/kependudukan/jumlahwilayah/route";

export default function PendudukWidget() {
  const apiUrl = `${getBasePath()}/api/kependudukan/jumlahwilayah`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  // Jika loading tampilkan spinner
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="lg" />
      </Box>
    );
  }

  // Jika error tampilkan pesan error
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Text color="red.500">Gagal memuat data penduduk.</Text>
      </Box>
    );
  }

  // Mapping data untuk ECharts
  const kabKotaNames = data?.data.map((item) => item.nama_kabkota) || [];
  const jumlahPenduduk = data?.data.map((item) => item.jlh_pddk) || [];

  // Opsi konfigurasi ECharts
  const optionPertumbuhanPenduduk = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["Jumlah Penduduk"],
      top: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        rotate: 55,
        fontSize: 10,
        color: "#1E3A8A",
      },
      data: kabKotaNames,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: any) =>
          new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value) + " Jiwa",
        color: "#1E3A8A",
      },
      splitLine: {
        lineStyle: {
          color: "#E5E7EB",
        },
      },
    },
    series: [
      {
        name: "Jumlah Penduduk",
        type: "line",
        stack: "Total",
        areaStyle: { color: "#4A5568" },
        lineStyle: { color: "#4A5568" },
        emphasis: {
          focus: "series",
        },
        data: jumlahPenduduk,
      },
    ],
  };

  return (
    <Box bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Jumlah Penduduk Per Kabupaten/Kota
      </Heading>
      <Box height="400px" fontSize={9}>
        <ReactECharts
          option={optionPertumbuhanPenduduk}
          style={{ height: "100%", width: "100%" }}
        />
      </Box>
    </Box>
  );
}
