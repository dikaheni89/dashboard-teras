'use client';

import {
  Box,
  Flex,
  Heading,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ReactECharts from 'echarts-for-react';
import useGetData from "@/app/hooks/useGetData";
import { getBasePath } from '@/libs/utils/getBasePath';
import {IResponse} from "@/app/api/kependudukan/jumlahwilayah/route";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatistikKabKota() {
  const apiUrl = `${getBasePath()}/api/kependudukan/jumlahwilayah`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isError || !data || !data.success) {
    return (
      <Flex justifyContent="center" alignItems="center" h="400px">
        <Text>Data tidak tersedia atau terjadi kesalahan.</Text>
      </Flex>
    );
  }

  const colors = [
    '#a6b942',
    '#52e289',
    '#35adea',
    '#77185a',
    '#cab9c7',
    '#1877d1',
    '#2d8c47',
    '#ced57a',
  ];

  // Mapping data dari API
  const kabkota = data.data.map((item) => item.nama_kabkota);
  const jumlahPenduduk = data.data.map((item) => item.jlh_pddk);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: 100,
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'value',
      name: 'Jiwa',
      axisLabel: {
        formatter: '{value}',
      },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: kabkota,
    },
    series: [
      {
        name: 'Jumlah Penduduk',
        type: 'bar',
        data: jumlahPenduduk.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
        label: {
          show: true,
          formatter: function (params: any) {
            return params.value.toLocaleString('id-ID'); // format ribuan
          },
        },
        markPoint: {
          symbolSize: 1,
          symbolOffset: [0, '50%'],
          label: {
            formatter: function (params: any) {
              return `{a|${params.seriesName}\n}{b|${params.name}} {c|${params.value.toLocaleString('id-ID')}}`;
            },
            backgroundColor: 'rgb(242,242,242)',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            padding: [4, 10],
            lineHeight: 26,
            position: 'right',
            distance: 20,
            rich: {
              a: {
                align: 'center',
                color: '#fff',
                fontSize: 14,
                textShadowBlur: 2,
                textShadowColor: '#000',
                textShadowOffsetX: 0,
                textShadowOffsetY: 1,
                textBorderColor: '#333',
                textBorderWidth: 2,
              },
              b: {
                color: '#333',
              },
              c: {
                color: '#ff8811',
                textBorderColor: '#000',
                textBorderWidth: 1,
                fontSize: 16,
              },
            },
          },
          data: [
            { type: 'max', name: 'Tertinggi : ' },
            { type: 'min', name: 'Terendah : ' },
          ],
        },
      },
    ],
  };

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={1} p={4}>
      <VStack spacing={6} w="full" h="full">
        <Box
          bg="white"
          p={4}
          w="full"
          minH="500px"
          borderRadius="lg"
          shadow="md"
          display="flex"
          flexDirection="column"
        >
          <Heading size="md" mb={4}>
            Jumlah Penduduk per Kabupaten Kota
          </Heading>
          <Box flex="1" w="full" h="100%" overflow="hidden">
            <ReactECharts option={option} style={{ height: '500px', width: '100%'}} />
          </Box>
        </Box>
      </VStack>
    </Flex>
  );
}
