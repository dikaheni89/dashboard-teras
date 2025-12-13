'use client';

import {
  Text,
  Heading,
  Box,
  Flex,
  CircularProgress,
  Center,
} from '@chakra-ui/react';
import ReactECharts from "echarts-for-react";
import useGetData from "@/app/hooks/useGetData";
import { getBasePath } from "@/libs/utils/getBasePath";
import StatistikKabKota from "@/app/kependudukan/components/StatistikKabKota";
import StatistikIkdKtp from "@/app/kependudukan/components/StatistikIkdKtp";
import { IResponse } from "@/app/api/kependudukan/pencatatan/route";
import { persenFloat } from "@/libs/utils/helper";
import StatistikBlanko from "@/app/kependudukan/components/StatistikBlanko";
import StatistikIdCard from "@/app/kependudukan/components/StatistikIdCard";

export default function StatistikBelanja() {
  const apiUrl = `${getBasePath()}/api/kependudukan/pencatatan`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  const generateGaugeOption = (value: number) => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '100%',
        center: ['50%', '70%'],
        pointer: {
          show: true,
          length: '100%',
          width: 6,
          itemStyle: { color: '#D6AD60' },
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#7DD3FC']],
          },
        },
        progress: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        anchor: {
          show: true,
          showAbove: true,
          size: 14,
          itemStyle: { color: '#D6AD60' },
        },
        title: { show: false },
        detail: { show: false },
        data: [{ value }],
      },
    ],
  });

  const akta = data?.data.akta;
  const kia = data?.data.kia;
  const ktp = data?.data.ktp;

  const optionGaugeKtp = generateGaugeOption(persenFloat(ktp?.persen ?? '0') ?? 0);
  const optionGaugeKia = generateGaugeOption(persenFloat(kia?.persen ?? '0') ?? 0);
  const optionGaugeAkta = generateGaugeOption(persenFloat(akta?.persen ?? '0') ?? 0)

  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        {/* KTP */}
        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={2}>Target Pencatatan KTP</Heading>
          {isLoading ? (
            <Center minH="200px">
              <CircularProgress isIndeterminate color="blue.400" />
            </Center>
          ) : isError || !data || !data.success ? (
            <Center minH="200px">
              <Text color="red.500">Gagal mengambil data dari server.</Text>
            </Center>
          ) : (
            <>
              <Flex justifyContent="space-between" pt={3}>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{ktp?.target}</Text>
                  <Text fontSize="9px" color="primary.800">Target WKTP</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{ktp?.persen} %</Text>
                  <Text fontSize="9px" color="primary.800">Capaian</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{ktp?.capaian}</Text>
                  <Text fontSize="9px" color="primary.800">Telah Rekam WKTP</Text>
                </Box>
              </Flex>
              <Box w="full" display="flex" justifyContent="center" alignItems="center">
                <ReactECharts option={optionGaugeKtp} style={{ width: '200px', height: '200px' }} />
              </Box>
            </>
          )}
        </Box>

        {/* KIA */}
        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={2}>Target Pencatatan KIA</Heading>
          {isLoading ? (
            <Center minH="200px">
              <CircularProgress isIndeterminate color="blue.400" />
            </Center>
          ) : isError || !data || !data.success ? (
            <Center minH="200px">
              <Text color="red.500">Gagal mengambil data dari server.</Text>
            </Center>
          ) : (
            <>
              <Flex justifyContent="space-between" pt={3}>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{kia?.target}</Text>
                  <Text fontSize="9px" color="primary.800">Target KIA</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{kia?.persen} %</Text>
                  <Text fontSize="9px" color="primary.800">Capaian</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{kia?.capaian}</Text>
                  <Text fontSize="9px" color="primary.800">Telah Memiliki KIA</Text>
                </Box>
              </Flex>
              <Box w="full" display="flex" justifyContent="center" alignItems="center">
                <ReactECharts option={optionGaugeKia} style={{ width: '200px', height: '200px' }} />
              </Box>
            </>
          )}
        </Box>

        {/* Akta */}
        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={2}>Target Pencatatan Akta Kelahiran</Heading>
          {isLoading ? (
            <Center minH="200px">
              <CircularProgress isIndeterminate color="blue.400" />
            </Center>
          ) : isError || !data || !data.success ? (
            <Center minH="200px">
              <Text color="red.500">Gagal mengambil data dari server.</Text>
            </Center>
          ) : (
            <>
              <Flex justifyContent="space-between" pt={3}>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{akta?.target}</Text>
                  <Text fontSize="9px" color="primary.800">Target Akta</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{akta?.persen} %</Text>
                  <Text fontSize="9px" color="primary.800">Capaian</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="primary.800">{akta?.capaian}</Text>
                  <Text fontSize="9px" color="primary.800">Telah Memiliki Akta</Text>
                </Box>
              </Flex>
              <Box w="full" display="flex" justifyContent="center" alignItems="center">
                <ReactECharts option={optionGaugeAkta} style={{ width: '200px', height: '200px' }} />
              </Box>
            </>
          )}
        </Box>
      </Flex>

      <StatistikKabKota />
      <StatistikBlanko />
      <StatistikIdCard />
      <StatistikIkdKtp />
    </>
  );
}
