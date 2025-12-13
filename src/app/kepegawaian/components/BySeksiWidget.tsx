'use client';

import { getBasePath } from '@/libs/utils/getBasePath';
import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/kepegawaian/byseksi/route";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function LowonganKategoriWidget() {
  const apiUrl = `${getBasePath()}/api/kepegawaian/byseksi`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const labelOption = {
    show: true,
    position: 'top',
    distance: 10,
    align: 'center',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}',
    fontSize: 8,
    color: '#000',
    rich: {
      name: {}
    }
  };

  const namaSeksi = data?.data.map((item) => truncate(item.seksi.trim(), 20)) || [];
  const jumlahPegawai = data?.data.map((item) => item.jumlah_pegawai) || [];

  const option = {
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
      axisTick: { show: false },
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        color: '#1E3A8A',
      },
      data: namaSeksi,
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
        name: 'Jumlah Pegawai',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color: '#60A5FA', // Chakra blue-400
        },
        data: jumlahPegawai,
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
        Jumlah Pegawai Berdasarkan Section
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
