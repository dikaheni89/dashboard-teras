'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/siloker/lowongankota/route";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function LowonganKotaWidget() {
  const apiUrl = `${getBasePath()}/api/siloker/lowongankota`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const namaKota = data?.data.map((item) => truncate(item.nama_kota.trim(), 20)) || [];
  const jumlahLowongan = data?.data.map((item) => item.jumlah_lowongan) || [];

  const colors = [
    '#60A5FA', '#34D399', '#FBBF24', '#F87171',
    '#A78BFA', '#F472B6', '#4ADE80', '#FB7185',
  ];

  const option = {
    title: {
      show: false,
      text: 'Jumlah Lowongan per Kota',
      left: 'center',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <b>${item.axisValue}</b><br/>
          <span style="display:inline-block;width:8px;height:8px;background-color:${item.color};margin-right:5px;border-radius:50%;"></span>
          Jumlah Lowongan: <b>${item.value}</b>
        `;
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
      data: namaKota,
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        color: '#1E3A8A',
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: [
      {
        name: 'Jumlah Lowongan',
        type: 'bar',
        barWidth: '60%',
        data: jumlahLowongan.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#374151',
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Tertinggi' },
            { type: 'min', name: 'Terendah' },
          ],
        },
        markLine: {
          data: [{ type: 'average', name: 'Rata-rata' }],
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
        Jumlah Lowongan per Kota
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
