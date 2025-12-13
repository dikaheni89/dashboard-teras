'use client';

import { Box, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/spanlapor/peropd/route';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function KinerjaOpdWidget() {
  const apiUrl = `${getBasePath()}/api/spanlapor/peropd`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const namaOpd = data?.data.map((item) => item.nama_opd) || [];
  const totalAduan = data?.data.map((item) => item.total_aduan) || [];
  const selesai = data?.data.map((item) => item.selesai) || [];
  const belumSelesai = data?.data.map(
    (item) => Math.max(item.total_aduan - item.selesai, 0)
  ) || [];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const [a, b, c] = params;
        return `
          <b>${a.axisValue}</b><br/>
          <span style="color:${a.color}">■</span> Total Aduan: <b>${a.value}</b><br/>
          <span style="color:${b.color}">■</span> Selesai: <b>${b.value}</b><br/>
          <span style="color:${c.color}">■</span> Belum Selesai: <b>${c.value}</b><br/>
        `;
      },
    },
    legend: {
      data: ['Total Aduan', 'Selesai', 'Belum Selesai'],
      top: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: namaOpd,
      axisLabel: {
        rotate: 30,
        interval: 0,
        fontSize: 8,
        formatter: (value: string) =>
          value.length > 25 ? value.slice(0, 30) + '...' : value,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Total Aduan',
        type: 'bar',
        data: totalAduan,
        itemStyle: {
          color: '#34D399',
        },
        barGap: 0,
      },
      {
        name: 'Selesai',
        type: 'bar',
        data: selesai,
        itemStyle: {
          color: '#FBBF24',
        },
      },
      {
        name: 'Belum Selesai',
        type: 'bar',
        data: belumSelesai,
        itemStyle: {
          color: '#F87171',
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
        Persentase Penyelesaian Aduan per OPD
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
          <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
        </Box>
      )}
    </Box>
  );
}
