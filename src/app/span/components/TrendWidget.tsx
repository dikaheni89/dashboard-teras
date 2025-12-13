'use client';

import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import {IResponseTrend} from "@/app/api/spanlapor/tren/route";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function TrendWidget() {
  const apiUrl = `${getBasePath()}/api/spanlapor/tren`;
  const { data, isLoading } = useGetData<IResponseTrend>(apiUrl);

  const trendData = data?.data?.trend_per_tanggal || [];

  const categories = trendData.map((item) => item.tanggal);

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Jumlah', 'Selesai', 'Proses', 'Belum Ditindaklanjuti', 'Belum Terverifikasi'],
    },
    xAxis: {
      type: 'category',
      data: categories,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Jumlah',
        type: 'bar',
        data: trendData.map((item) => item.jumlah),
      },
      {
        name: 'Selesai',
        type: 'bar',
        data: trendData.map((item) => item.selesai),
      },
      {
        name: 'Proses',
        type: 'bar',
        data: trendData.map((item) => item.proses),
      },
      {
        name: 'Belum Ditindaklanjuti',
        type: 'bar',
        data: trendData.map((item) => item.belum_ditindaklanjuti),
      },
      {
        name: 'Belum Terverifikasi',
        type: 'bar',
        data: trendData.map((item) => item.belum_terverifikasi),
      },
    ],
  };

  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bg} p={6} borderRadius="xl" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Trend Aduan per Tanggal</Heading>
        {isLoading ? (
          <Spinner size="lg" alignSelf="center" />
        ) : (
          <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />
        )}
      </VStack>
    </Box>
  );
}

