'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/siloker/perusahaankota/route";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function PerusahaanKotaWidget() {
  const apiUrl = `${getBasePath()}/api/siloker/perusahaankota`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const labelOption = {
    show: true,
    position: 'insideTop',
    distance: 20,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}',
    fontSize: 14,
    color: '#000',
    rich: {
      name: {}
    }
  };

  const colors = [
    '#60A5FA', '#34D399', '#FBBF24', '#F87171',
    '#A78BFA', '#F472B6', '#4ADE80', '#FB7185',
    '#818CF8', '#FACC15', '#FCA5A5', '#5EEAD4',
  ];

  const namaKota = data?.data.map((item) => truncate(item.nama_kota.trim(), 20)) || [];

  const jumlahPerusahaan = data?.data.map((item, index) => ({
    value: item.jumlah_perusahaan,
    itemStyle: {
      color: colors[index % colors.length],
    },
  })) || [];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <b>${item.axisValue}</b><br/>
          <span style="display:inline-block;width:8px;height:8px;background-color:${item.color};margin-right:5px;border-radius:50%;"></span>
          Jumlah Perusahaan: <b>${item.value}</b>
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
      axisTick: { show: false },
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        color: '#1E3A8A',
      },
      data: namaKota,
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: [
      {
        name: 'Jumlah Perusahaan',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data: jumlahPerusahaan,
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
        Jumlah Perusahaan per Kota
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
