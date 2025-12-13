'use client';

import React, { useMemo } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import {IResponseBidangUsaha} from "@/app/api/lingkungan/izin/route";

export default function StatistikIzinLingkungan() {
  const apiUrl = `${getBasePath()}/api/lingkungan/izin`;
  const { data, isLoading, isError } = useGetData<IResponseBidangUsaha>(apiUrl);

  const sorted = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => b.total - a.total);
  }, [data]);

  const categories = sorted.map((d) => d.nama_bidang_usaha);
  const totals = sorted.map((d) => d.total);

  const options = {
    grid: {
      left: 12,
      right: 18,
      bottom: 80,
      top: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const p = params?.[0];
        return `${p?.name}<br/>Total: <b>${p?.value}</b>`;
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 25,
        width: 140,
        overflow: 'truncate',
      },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value',
      name: 'Total',
      minInterval: 1,
    },
    series: [
      {
        name: 'Total',
        type: 'bar',
        data: totals,
        barMaxWidth: 36,
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isError) {
    return <Text color="red.500">Gagal memuat data</Text>;
  }

  if (!data?.success || sorted.length === 0) {
    return <Text color="red.500">Tidak ada data bidang usaha.</Text>;
  }

  return (
    <Box p={4} bg="white" w="full" borderRadius="lg">
      <ReactECharts option={options} style={{ height: 500, width: '100%' }} />
    </Box>
  );
}
