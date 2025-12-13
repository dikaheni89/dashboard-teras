'use client';

import React from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import { IResponseRoomClass } from "@/app/api/malimping/room/route";

export default function StatistikkamarWidget() {
  const apiUrl = `${getBasePath()}/api/malimping/room`;
  const { data, isLoading } = useGetData<IResponseRoomClass>(apiUrl);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!data?.data?.last_updated) {
    return <Text color="red.500">Gagal memuat data kamar.</Text>;
  }

  const rawData = data.data.last_updated;
  const values = rawData.map((item) => ({
    value: item.jumlah_kamar,
    name: item.jenis_ruangan,
    itemStyle: {
      color: getRandomColor(),
    },
  }));

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const options = {
    title: {
      show: false,
      text: 'Distribusi Kamar per Jenis Ruangan',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Jumlah Kamar',
        type: 'pie',
        radius: ['60%', '100%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: values,
      },
    ],
  };

  return (
    <Box p={4} bg="white" w="full" borderRadius="lg">
      <ReactECharts option={options} style={{ height: 400, width: '100%' }} />
    </Box>
  );
}
