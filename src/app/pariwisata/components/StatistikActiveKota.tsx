'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from '@/app/hooks/useGetData';
import {IResponsePariwisataPerKota} from "@/app/api/pariwisata/activekota/route";
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function StatistikActiveKota() {
  const apiUrl = `${getBasePath()}/api/pariwisata/activekota`;
  const { data, isLoading, isError } = useGetData<IResponsePariwisataPerKota>(apiUrl);

  const kotaList = data?.data.map((item) => item.nama_kota) || [];
  const aktifList = data?.data.map((item) => item.total_lokasi_aktif) || [];
  const tidakAktifList = data?.data.map((item) => item.total_lokasi_tidak_aktif) || [];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: kotaList,
    },
    series: [
      {
        name: 'Lokasi Aktif',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: aktifList,
      },
      {
        name: 'Lokasi Tidak Aktif',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: tidakAktifList,
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
        Statistik Lokasi Aktif dan Tidak Aktif Tahun ini Per Kota
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
          <ReactECharts option={option} style={{ height: `${kotaList.length * 50}px`, width: '100%' }} />
        </Box>
      )}
    </Box>
  );
}
