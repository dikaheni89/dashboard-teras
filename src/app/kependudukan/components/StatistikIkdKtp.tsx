'use client';

import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Spinner
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from "@/app/api/kependudukan/agregrat/route";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartBox({ title, option, isLoading, isError }: {
  title: string,
  option: any,
  isLoading: boolean,
  isError: boolean,
}) {
  return (
    <Box h="100%" bg="primary.50" p={4} borderRadius="lg" shadow="md" minH="320px">
      <Heading size="sm" mb={4} color="primary.800">{title}</Heading>
      <Box flex="1" h="100%" w="100%">
        {isLoading ? (
          <Flex justify="center" align="center" h="45vh">
            <Spinner size="lg" />
          </Flex>
        ) : isError ? (
          <Flex justify="center" align="center" h="45vh">
            <Text color="red.500">Gagal mengambil data dari server.</Text>
          </Flex>
        ) : (
          <ReactECharts option={option} style={{ height: '45vh', width: '82vh' }} />
        )}
      </Box>
    </Box>
  );
}

export default function StatistikIkdKtp() {
  const apiUrl = `${getBasePath()}/api/kependudukan/agregrat`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  // Saat loading awal/data error, tampilkan skeleton box per chart
  let kotaBanten: string[] = [];
  let aktivasiIkd: number[] = [];
  let targetWktp: number[] = [];
  let telahRekamWktp: number[] = [];
  let targetAkta: number[] = [];
  let memilikiAkta: number[] = [];
  let targetKia: number[] = [];
  let memilikiKia: number[] = [];

  if (data && data.data) {
    kotaBanten = data.data.aktv_ikd.items.map((item: any) => item.nama_kabkota);
    aktivasiIkd = data.data.aktv_ikd.items.map((item: any) => item.value);
    targetWktp = data.data.rek_wktpd.items.map((item: any) => item.target);
    telahRekamWktp = data.data.rek_wktpd.items.map((item: any) => item.value);
    targetAkta = data.data.mmlk_akt_lhr_0018.items.map((item: any) => item.target);
    memilikiAkta = data.data.mmlk_akt_lhr_0018.items.map((item: any) => item.value);
    targetKia = data.data.mmlk_kia.items.map((item: any) => item.target);
    memilikiKia = data.data.mmlk_kia.items.map((item: any) => item.value);
  }

  const generateChartOption = (title: string, seriesData: any[], labels: string[], legend: string[]) => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#6a7985' }
      }
    },
    legend: {
      data: legend,
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        color: '#1E3A8A'
      },
      data: labels
    },
    yAxis: {
      type: 'value',
    },
    series: seriesData
  });

  const optionIkd = generateChartOption(
    'Aktivasi Identitas Kependudukan Digital',
    [
      {
        name: 'Pemilik KTP',
        type: 'line',
        areaStyle: { color: '#1E40AF' },
        lineStyle: { color: '#1E40AF' },
        emphasis: { focus: 'series' },
        data: telahRekamWktp,
      },
      {
        name: 'Aktivasi IKD',
        type: 'line',
        areaStyle: { color: '#16A34A' },
        lineStyle: { color: '#16A34A' },
        emphasis: { focus: 'series' },
        data: aktivasiIkd,
      }
    ],
    kotaBanten,
    ['Pemilik KTP', 'Aktivasi IKD']
  );

  const optionKtp = generateChartOption(
    'Agregat Penduduk Berdasarkan Wajib KTP',
    [
      {
        name: 'Target WKTP',
        type: 'line',
        areaStyle: { color: '#1E40AF' },
        lineStyle: { color: '#1E40AF' },
        emphasis: { focus: 'series' },
        data: targetWktp,
      },
      {
        name: 'Telah Merekam WKTP',
        type: 'line',
        areaStyle: { color: '#16A34A' },
        lineStyle: { color: '#16A34A' },
        emphasis: { focus: 'series' },
        data: telahRekamWktp,
      }
    ],
    kotaBanten,
    ['Target WKTP', 'Telah Merekam WKTP']
  );

  const optionAkta = generateChartOption(
    'Agregat Penduduk Berdasarkan Kepemilikan Akta Lahir',
    [
      {
        name: 'Target AKTA',
        type: 'line',
        areaStyle: { color: '#1E40AF' },
        lineStyle: { color: '#1E40AF' },
        emphasis: { focus: 'series' },
        data: targetAkta,
      },
      {
        name: 'Telah Memiliki AKTA',
        type: 'line',
        areaStyle: { color: '#16A34A' },
        lineStyle: { color: '#16A34A' },
        emphasis: { focus: 'series' },
        data: memilikiAkta,
      }
    ],
    kotaBanten,
    ['Target AKTA', 'Telah Memiliki AKTA']
  );

  const optionKia = generateChartOption(
    'Agregat Penduduk Berdasarkan Kepemilikan KIA',
    [
      {
        name: 'Target KIA',
        type: 'line',
        areaStyle: { color: '#1E40AF' },
        lineStyle: { color: '#1E40AF' },
        emphasis: { focus: 'series' },
        data: targetKia,
      },
      {
        name: 'Telah Memiliki KIA',
        type: 'line',
        areaStyle: { color: '#16A34A' },
        lineStyle: { color: '#16A34A' },
        emphasis: { focus: 'series' },
        data: memilikiKia,
      }
    ],
    kotaBanten,
    ['Target KIA', 'Telah Memiliki KIA']
  );

  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        <VStack spacing={6} w="full" h="full">
          <ChartBox
            title="Aktivasi Identitas Kependudukan Digital"
            option={optionIkd}
            isLoading={isLoading}
            isError={isError || !data}
          />
        </VStack>
        <VStack spacing={6} w="full" h="full">
          <ChartBox
            title="Agregat Penduduk Berdasarkan Wajib KTP"
            option={optionKtp}
            isLoading={isLoading}
            isError={isError || !data}
          />
        </VStack>
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        <VStack spacing={6} w="full" h="full">
          <ChartBox
            title="Agregat Penduduk Berdasarkan Kepemilikan Akta Lahir"
            option={optionAkta}
            isLoading={isLoading}
            isError={isError || !data}
          />
        </VStack>
        <VStack spacing={6} w="full" h="full">
          <ChartBox
            title="Agregat Penduduk Berdasarkan Kepemilikan KIA"
            option={optionKia}
            isLoading={isLoading}
            isError={isError || !data}
          />
        </VStack>
      </Flex>
    </>
  );
}
