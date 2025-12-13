'use client';

import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  CircularProgress,
  Center,
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponsePasien } from '@/app/api/kesehatan/pasien/route';
import { IResponseStatus } from '@/app/api/kesehatan/status/route';

const endpoints = {
  pasien: `${getBasePath()}/api/kesehatan/pasien`,
  status: `${getBasePath()}/api/kesehatan/status`,
};

export default function StatistikPie() {
  const {
    data: dataPasien,
    isLoading: isLoadingPasien,
    isError: isErrorPasien,
  } = useGetData<IResponsePasien>(endpoints.pasien.toString());

  const {
    data: dataStatus,
    isLoading: isLoadingStatus,
    isError: isErrorStatus,
  } = useGetData<IResponseStatus>(endpoints.status.toString());

  const [jmlpasien, setJmlPasien] = useState<any>(null);
  const [jmlbed, setJmlBed] = useState<any>(null);

  useEffect(() => {
    if (dataPasien) {
      setJmlPasien({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: 'Department',
            type: 'pie',
            radius: '90%',
            data: dataPasien.data.map((item: any) => ({
              value: item.jumlah,
              name: `${item.departemen} : ${item.jumlah}`,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });
    }
  }, [dataPasien]);

  useEffect(() => {
    if (dataStatus) {
      setJmlBed({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: 'Tempat Tidur',
            type: 'pie',
            radius: '90%',
            data: dataStatus.data.map((item) => ({
              value: item.jumlah,
              name: `${item.status} : ${item.jumlah}`,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });
    }
  }, [dataStatus]);

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      <VStack spacing={6} w="full" h="full">
        <Box h="100%" bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
          <Heading size="sm" mb={4} color="primary.800">
            Jumlah Pasien Per Departemen
          </Heading>
          <Box flex="1" h="45vh" w="100%">
            {isLoadingPasien ? (
              <Center h="100%">
                <CircularProgress isIndeterminate color="purple.400" />
                <Text ml={4}>Memuat data...</Text>
              </Center>
            ) : isErrorPasien ? (
              <Center h="100%">
                <Text color="red.500">Gagal memuat data pasien</Text>
              </Center>
            ) : jmlpasien ? (
              <ReactECharts option={jmlpasien} style={{ height: '100%', width: '100%' }} />
            ) : (
              <Center h="100%">
                <Text>Data tidak tersedia</Text>
              </Center>
            )}
          </Box>
        </Box>
      </VStack>

      <VStack spacing={6} w="full" h="full">
        <Box h="100%" bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
          <Heading size="sm" mb={4} color="primary.800">
            Jumlah Status Tempat Tidur
          </Heading>
          <Box flex="1" h="45vh" w="100%">
            {isLoadingStatus ? (
              <Center h="100%">
                <CircularProgress isIndeterminate color="purple.400" />
                <Text ml={4}>Memuat data...</Text>
              </Center>
            ) : isErrorStatus ? (
              <Center h="100%">
                <Text color="red.500">Gagal memuat data tempat tidur</Text>
              </Center>
            ) : jmlbed ? (
              <ReactECharts option={jmlbed} style={{ height: '100%', width: '100%' }} />
            ) : (
              <Center h="100%">
                <Text>Data tidak tersedia</Text>
              </Center>
            )}
          </Box>
        </Box>
      </VStack>
    </Flex>
  );
}
