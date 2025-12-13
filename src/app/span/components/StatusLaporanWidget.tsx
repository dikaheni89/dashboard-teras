'use client';

import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/spanlapor/status/route';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function StatusLaporanWidget() {
  const apiUrl = `${getBasePath()}/api/spanlapor/status`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const labelMapping: Record<string, string> = {
    'Selesai': 'Selesai',
    'Proses': 'Dalam Proses',
    'Belum Ditindaklanjuti': 'Belum Ditindaklanjuti',
    'Belum Terverifikasi': 'Belum Terverifikasi',
    'Tindak Lanjut': 'Tindak Lanjut',
  };

  const colorMapping: Record<string, string> = {
    'Selesai': '#34D399',               // Hijau
    'Proses': '#FBBF24',                // Kuning
    'Belum Ditindaklanjuti': '#F87171', // Merah
    'Belum Terverifikasi': '#A0AEC0',   // Abu
    'Tindak Lanjut': '#6366F1',         // Indigo
  };

  const chartData = data?.data.map((item) => ({
    name: labelMapping[item.status] ?? item.status,
    value: item.jumlah,
    originalStatus: item.status,
  })) || [];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: -5,
      data: chartData.map((item) => item.name),
    },
    series: [
      {
        name: 'Status Laporan',
        type: 'pie',
        radius: ['50%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colorMapping[item.originalStatus] || '#CBD5E0', // fallback abu muda
          },
        })),
      },
    ],
  };

  return (
    <Box
      flex="1"
      bg="white"
      boxShadow="md"
      p={6}
      rounded="2xl"
      border="1px solid"
      borderColor="gray.100"
    >
      <Heading as="h5" size="md" mb={4} px={2}>
        Distribusi Status Laporan
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
        <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
      )}
    </Box>
  );
}
