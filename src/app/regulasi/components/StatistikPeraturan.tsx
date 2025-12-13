'use client';

import React from 'react';
import {Box, Flex, Heading, Spinner, Text} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import {IResponseRegulasiItem} from "@/app/api/regulasi/regulasiperaturan/route";

export default function StatistikPeraturan() {
  const apiUrl = `${getBasePath()}/api/regulasi/regulasiperaturan`;
  const { data, isLoading } = useGetData<IResponseRegulasiItem>(apiUrl);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return <Text color="red.500">Gagal memuat data regulasi.</Text>;
  }

  const sortedData = [...data.data].sort(
    (a, b) => (b.total_berlaku + b.total_tidak_berlaku) - (a.total_berlaku + a.total_tidak_berlaku)
  );

  const labels = sortedData.map((item) => item.type_name);

  // Generate random colors
  const generateColors = (count: number) => {
    return Array.from({ length: count }, () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    });
  };

  const colorsBerlaku = generateColors(sortedData.length);
  const colorsTidakBerlaku = generateColors(sortedData.length);

  const berlakuData = sortedData.map((item, index) => ({
    value: item.total_berlaku,
    itemStyle: { color: colorsBerlaku[index] },
  }));

  const tidakBerlakuData = sortedData.map((item, index) => ({
    value: item.total_tidak_berlaku,
    itemStyle: { color: colorsTidakBerlaku[index] },
  }));

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['Berlaku', 'Tidak Berlaku'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Jumlah',
    },
    yAxis: {
      type: 'category',
      data: labels,
      name: 'Jenis Regulasi',
    },
    series: [
      {
        name: 'Berlaku',
        type: 'bar',
        stack: 'total',
        data: berlakuData,
      },
      {
        name: 'Tidak Berlaku',
        type: 'bar',
        stack: 'total',
        data: tidakBerlakuData,
      },
    ],
  };

  return (
    <Box p={4} bg="white" w="full" borderRadius="lg">
      <Heading as="h3" size="md" mb={4}>
        Regulasi Berdasarkan Jenis Peraturan
      </Heading>
      <ReactECharts option={options} style={{ height: 600, width: '100%' }} />
    </Box>
  );
}
