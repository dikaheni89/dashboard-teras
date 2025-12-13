'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from "@/app/hooks/useGetData";
import { IResponse } from "@/app/api/kinerja/kinerjaprovinsi/route";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function KinerjaProvinsiWidget() {
  const apiUrl = `${getBasePath()}/api/kinerja/kinerjaprovinsi`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const bulan = data?.data.map((item) => item.bulan) || [];
  const target_fisik = data?.data.map((item) => item.target_fisik) || [];
  const realisasi_fisik = data?.data.map((item) => item.realisasi_fisik) || [];
  const capaian_fisik = data?.data.map((item) => item.capaian_fisik) || [];

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Target Fisik', 'Realisasi Fisik', 'Capaian Fisik'],
      textStyle: {
        fontSize: 12,
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: bulan,
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        color: '#1E3A8A',
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Target Fisik',
        type: 'line',
        data: target_fisik,
        smooth: true,
        lineStyle: {
          color: '#d3162d',
          width: 2,
        },
        itemStyle: {
          color: '#d3162d',
        },
      },
      {
        name: 'Realisasi Fisik',
        type: 'line',
        data: realisasi_fisik,
        smooth: true,
        lineStyle: {
          color: '#009E73',
          width: 2,
        },
        itemStyle: {
          color: '#009E73',
        },
      },
      {
        name: 'Capaian Fisik',
        type: 'bar',
        data: capaian_fisik,
        barWidth: '50%',
        itemStyle: {
          color: '#E69F00',
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#374151',
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
        Grafik Kinerja Provinsi Banten
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
        <Box>
          <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </Box>
      )}
    </Box>
  );
}
