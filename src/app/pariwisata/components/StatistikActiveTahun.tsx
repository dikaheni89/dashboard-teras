'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from '@/app/hooks/useGetData';
import { IResponseActiveTahun } from '@/app/api/pariwisata/activetahun/route';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function StatistikActiveTahun() {
  const apiUrl = `${getBasePath()}/api/pariwisata/activetahun`;
  const { data, isLoading, isError } = useGetData<IResponseActiveTahun>(apiUrl);

  const chartData = data?.data
    ? [
      {
        value: parseInt(data.data.total_lokasi_aktif, 10),
        name: 'Lokasi Aktif',
      },
      {
        value: parseInt(data.data.total_lokasi_tidak_aktif, 10),
        name: 'Lokasi Tidak Aktif',
      },
    ]
    : [];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Lokasi',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: chartData,
        itemStyle: {
          borderRadius: 8,
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
        Statistik Lokasi Aktif di Tahun ini
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
