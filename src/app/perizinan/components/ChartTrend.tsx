'use client';
import ReactECharts from "echarts-for-react";
import useGetData from "@/app/hooks/useGetData";
import {getBasePath} from "@/libs/utils/getBasePath";
import {useEffect, useState} from "react";
import {IResponse} from "@/app/api/perizinan/tren/route";
import {Box, Flex, Heading, Spinner, Text} from "@chakra-ui/react";

interface ChartData {
  labels: string[];
  values: number[];
}

const endpoints = {
  tren: `${getBasePath()}/api/perizinan/tren`,
};

export default function ChartTrend() {
  const {
    data: dataTren,
    isLoading: isLoadingTren,
    isError: isErrorTren,
  } = useGetData<IResponse>(endpoints.tren.toString());

  const [chartData, setChartData] = useState<ChartData>({ labels: [], values: [] });

  useEffect(() => {
    if (dataTren) {
      const sortedData = dataTren.data.sort((a, b) => new Date(a.bulan).getTime() - new Date(b.bulan).getTime());
      setChartData({
        labels: sortedData.map((item: any) => item.bulan),
        values: sortedData.map((item: any) => item.jumlah),
      });
    }
  }, [dataTren]);

  if (isLoadingTren) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isErrorTren) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Text color="red.500">Gagal mengambil data dari server.</Text>
      </Flex>
    );
  }

  const optionsTren = {
    title: {
      show: false,
      text: 'Trend Data Perizinan',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: chartData.labels,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: chartData.values,
        type: 'line',
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} >
      <Box flex="1" bg="primary.50" boxShadow="md" p={4} rounded="2xl" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>
          Trend Data Perizinan
        </Heading>
        <Box w="full" display="flex" justifyContent="center" alignItems="center">
          <ReactECharts option={optionsTren} style={{ height: '500px', width: '100%'}} />
        </Box>
      </Box>
    </Flex>
  );
}
