'use client';

import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/siloker/pelamarkota/route";
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function PelamarWidget() {
  const apiUrl = `${getBasePath()}/api/siloker/pelamarkota`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data?.data.map((item) => item.nama_kota) || [],
      axisLabel: {
        rotate: 30,
        interval: 0,
        formatter: (value: string) => {
          return value.length > 12 ? value.slice(0, 25) + '...' : value;
        }
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Jumlah Pelamar',
        type: 'bar',
        data: data?.data.map((item) => item.jumlah_pelamar) || [],
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params: any) => {
            const colors = [
              '#3182CE', '#2B6CB0', '#00B5D8', '#38A169',
              '#D69E2E', '#DD6B20', '#ED64A6', '#805AD5'
            ];
            return colors[params.dataIndex % colors.length];
          },
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  };

  return (
    <Box
      flex="1"
      bg="primary.50"
      boxShadow="md"
      p={6}
      rounded="2xl"
      border="1px solid"
      borderColor="gray.100"
    >
      <Heading as="h5" size="md" mb={4} px={2}>
        Jumlah Pelamar per Kota/Kabupaten
      </Heading>

      {isLoading ? (
        <Center h="300px">
          <Spinner size="xl" />
        </Center>
      ) : isError ? (
        <Center h="300px">
          <Text color="red.500">Gagal memuat data</Text>
        </Center>
      ) : (
        <Box className="chart-container">
          <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </Box>
      )}
    </Box>
  );
}
