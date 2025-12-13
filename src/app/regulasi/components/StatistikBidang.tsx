'use client';

import React from 'react';
import { Box, Flex, Spinner, Text, Heading } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import { IResponseBidangHukumItem } from "@/app/api/regulasi/regulasibidang/route";

export default function StatistikBidang() {
  const apiUrl = `${getBasePath()}/api/regulasi/regulasibidang`;
  const { data, isLoading } = useGetData<IResponseBidangHukumItem>(apiUrl);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return <Text color="red.500">Gagal memuat data regulasi per bidang hukum.</Text>;
  }

  const sortedData = [...data.data].sort(
    (a, b) => (b.total_berlaku + b.total_tidak_berlaku) - (a.total_berlaku + a.total_tidak_berlaku)
  );

  const labels = sortedData.map((item) => item.bh_name);

  const baseColors = [
    '#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0',
    '#00BCD4', '#795548', '#E91E63', '#3F51B5', '#8BC34A',
    '#FFC107', '#607D8B', '#FF5722', '#009688', '#673AB7',
  ];

  const getColor = (index: number) => baseColors[index % baseColors.length];

  const berlakuData = sortedData.map((item, index) => ({
    value: item.total_berlaku,
    itemStyle: { color: getColor(index) },
  }));

  const tidakBerlakuData = sortedData.map((item, index) => ({
    value: item.total_tidak_berlaku,
    itemStyle: { color: getColor(index) + '99' },
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
      bottom: labels.length > 10 ? '20%' : '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: labels,
      name: 'Bidang Hukum',
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Jumlah',
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
        Regulasi Berdasarkan Bidang Hukum Peraturan
      </Heading>
      <ReactECharts option={options} style={{ height: 750, width: '100%' }} />
    </Box>
  );
}
