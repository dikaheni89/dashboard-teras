'use client';

import { Box, Flex, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponseKabupatenKota } from "@/app/api/infrastruktur/kabupaten/route";
import {parseMultiLineString, roundToEven} from "@/libs/utils/helper";
import { IResponseKoordinat } from '@/app/api/infrastruktur/koordinat/route';
import {useEffect, useState} from "react";
import * as echarts from 'echarts';
import * as d3 from 'd3-geo';

const labelOption = {
  show: true,
  position: 'insideBottom',
  distance: 15,
  align: 'left',
  verticalAlign: 'middle',
  rotate: 90,
  formatter: '{c}',
  fontSize: 14,
  rich: {
    name: {},
  },
};

const colors = [
  '#5470C6', '#91CC75', '#FAC858', '#EE6666',
  '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC',
];

const chartOptions = (labels: string[], values: number[]) => {
  const dataWithColor = values.map((val, idx) => ({
    value: val,
    itemStyle: { color: colors[idx % colors.length] },
  }));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    toolbox: { show: false },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { interval: 0, rotate: 20 },
    },
    yAxis: {
      type: 'value',
      name: 'Km',
    },
    series: [
      {
        name: 'Total Panjang Jalan',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: { focus: 'series' },
        data: dataWithColor,
      },
    ],
  };
};

const endpoints = {
  perkabupaten: `${getBasePath()}/api/infrastruktur/kabupaten`,
  koordinat: `${getBasePath()}/api/infrastruktur/koordinat`,
};

export default function DistribusiWidget() {
  const {
    data: dataKabKota,
    isError: isErrorKabKota,
    isLoading: isLoadingKabKota,
  } = useGetData<IResponseKabupatenKota>(endpoints.perkabupaten.toString());

  const {
    data: dataKoordinat,
    isError: isErrorKoordinat,
    isLoading: isLoadingKoordinat,
  } = useGetData<IResponseKoordinat>(endpoints.koordinat.toString());

  const labels = dataKabKota?.data.map((d) => d.nama_kab_kota) || [];
  const values = dataKabKota?.data.map((d) => roundToEven(d.total_panjang)) || [];

  const [mapOption, setMapOption] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('blue.400', 'blue.300');

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const res = await fetch('/static/file/banten.json');
        const geoJSON = await res.json();

        const projection = d3.geoMercator().fitSize([600, 600], geoJSON);
        echarts.registerMap('banten', geoJSON);

        const option = {
          title: { show: false },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) =>
              `${params.name}<br/>Panjang: ${params.data?.value ?? '-'} km`
          },
          geo: {
            map: 'banten',
            roam: true,
            silent: true,
            itemStyle: {
              areaColor: '#eeeeee',
              borderColor: '#404a59',
              borderWidth: 1,
            },
            emphasis: { areaColor: '#fefefe' },
            projection: {
              project: projection,
              unproject: projection.invert,
            },
          },
          series: [
            {
              name: 'Jalur Jalan',
              type: 'lines',
              coordinateSystem: 'geo',
              geoIndex: 0,
              zlevel: 1,
              effect: {
                show: false
              },
              lineStyle: {
                color: 'red',
                width: 20,
                opacity: 0.8,
              },
              data: (dataKoordinat?.data ?? []).flatMap((item) => {
                const segments = parseMultiLineString(item.koordinat);
                return segments.map(coords => {
                  // LOG DI SINI
                  console.log('coords:', coords, 'name:', item.nm_dat_das);
                  return {
                    name: item.nm_dat_das,
                    coords,
                    value: item.pjg_jalan,
                  };
                });
              }),
            },
          ]
        };

        setMapOption(option);
      } catch (err) {
        console.error('Gagal memuat GeoJSON:', err);
      } finally {
        setLoadingMap(false);
      }
    };

    if (dataKoordinat?.data) {
      fetchGeoJSON();
    }
  }, [dataKoordinat]);

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} w="full">
      <Box flex={1} borderLeft="5px solid" borderColor={borderColor} bg={cardBg} borderRadius="md" p={4}>
        <Text fontWeight="bold" mb={4}>
          Total Panjang Jalan per Kabupaten/Kota
        </Text>
        <VStack align="stretch" spacing={6}>
          {isLoadingKabKota && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Spinner size="xl" />
              <Text ml={4}>Memuat Data...</Text>
            </Flex>
          )}

          {isErrorKabKota && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Text color="red.500">Terjadi kesalahan saat memuat data.</Text>
            </Flex>
          )}

          {!isLoadingKabKota && !isErrorKabKota && dataKabKota?.data?.length === 0 && (
            <Text textAlign="center" fontSize="sm" color="gray.500">
              Tidak ada data yang tersedia
            </Text>
          )}

          {!isLoadingKabKota && !isErrorKabKota && (dataKabKota?.data?.length ?? 0) > 0 && (
            <ReactECharts option={chartOptions(labels, values)} style={{ height: 400, width: '100%' }} />
          )}
        </VStack>
      </Box>

      <Box flex={1} borderLeft="5px solid" borderColor={borderColor} bg={cardBg} borderRadius="md" p={4}>
        <Text fontWeight="bold" mb={4}>Peta Distribusi Jalan</Text>
        <VStack align="stretch" spacing={6}>
          {isLoadingKoordinat && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Spinner size="xl" />
              <Text ml={4}>Memuat Data Koordinat...</Text>
            </Flex>
          )}

          {isErrorKoordinat && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Text color="red.500">Gagal memuat data koordinat.</Text>
            </Flex>
          )}

          {!loadingMap && mapOption && (
            <ReactECharts
              option={mapOption}
              style={{ height: 500, width: '100%' }}
              opts={{ renderer: 'canvas' }}
              notMerge
              lazyUpdate
            />
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
