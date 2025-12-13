'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/pendidikan/bystatussekolah/route";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function PelamarkategoriWidget() {
  const apiUrl = `${getBasePath()}/api/pendidikan/bystatussekolah`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const pieData = data?.data.map((item) => ({
    value: item.jumlah,
    name: truncate(item.status_sekolah.trim(), 18),
  })) || [];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: 'Jumlah Sekolah',
        type: 'pie',
        radius: ['40%', '70%'], // Donut Chart
        center: ['65%', '50%'],
        data: pieData,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
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
        Jumlah Sekolah Berdasarkan Status Sekolah
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
