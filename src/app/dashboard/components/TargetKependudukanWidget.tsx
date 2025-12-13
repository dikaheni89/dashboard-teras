"use client";

import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import ReactECharts from "echarts-for-react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/kependudukan/pencatatan/route";

export default function TargetKependudukanWidget() {
  const apiUrl = `${getBasePath()}/api/kependudukan/pencatatan`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  // Loading State
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="lg" />
      </Box>
    );
  }

  // Error State
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Text color="red.500">Gagal memuat data kependudukan.</Text>
      </Box>
    );
  }

  // Mapping Data dari API
  const labels = ["Akta", "KIA", "KTP"];
  const capaianValues = [
    parseInt((data?.data.akta.capaian ?? "0").replace(/\./g, "")),
    parseInt((data?.data.kia.capaian ?? "0").replace(/\./g, "")),
    parseInt((data?.data.ktp.capaian ?? "0").replace(/\./g, "")),
  ];

  const targetValues = [
    parseInt((data?.data.akta.target ?? "0").replace(/\./g, "")),
    parseInt((data?.data.kia.target ?? "0").replace(/\./g, "")),
    parseInt((data?.data.ktp.target ?? "0").replace(/\./g, "")),
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: (params: any) => {
        const capaian = new Intl.NumberFormat("id-ID").format(params[0].value);
        const target = new Intl.NumberFormat("id-ID").format(params[1].value);

        return `
          <strong>${params[0].name}</strong><br/>
          Capaian: ${capaian}<br/>
          Target: ${target}
        `;
      },
    },
    legend: {
      data: ["Capaian", "Target"],
      top: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        color: "#1E3A8A",
        fontWeight: "bold",
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: any) =>
          new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 0,
          }).format(value),
        color: "#1E3A8A",
      },
      splitLine: {
        lineStyle: {
          color: "#CBD5E1",
        },
      },
    },
    series: [
      {
        name: "Capaian",
        type: "line",
        data: capaianValues,
        smooth: true,
        itemStyle: {
          color: "#15803D",
        },
        areaStyle: {
          color: "rgba(21, 128, 61, 0.2)",
        },
      },
      {
        name: "Target",
        type: "line",
        data: targetValues,
        smooth: true,
        itemStyle: {
          color: "#1E3A8A",
        },
        areaStyle: {
          color: "rgba(30, 58, 138, 0.2)",
        },
      },
    ],
  };

  return (
    <Box h="370px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Target dan Capaian Pencatatan Kependudukan
      </Heading>
      <Box height="300px">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </Box>
    </Box>
  );
}
