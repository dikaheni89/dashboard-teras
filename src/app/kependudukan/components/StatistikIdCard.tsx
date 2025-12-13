'use client';

import useGetData from "@/app/hooks/useGetData";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";
import { getBasePath } from "@/libs/utils/getBasePath";
import ReactECharts from "echarts-for-react";
import { IResponseAkta } from "@/app/api/kependudukan/akta/route";
import { IResponseKia } from "@/app/api/kependudukan/kia/route";
import { IResponseKtp } from "@/app/api/kependudukan/ktp/route";
import { formatNumberIndonesia } from "@/libs/utils/helper";

const endpoints = {
  akta: `${getBasePath()}/api/kependudukan/akta`,
  kia: `${getBasePath()}/api/kependudukan/kia`,
  ktp: `${getBasePath()}/api/kependudukan/ktp`,
};

export default function StatistikIdCard() {
  const {
    data: dataAkta,
    isLoading: isLoadingAkta,
    isError: isErrorAkta,
  } = useGetData<IResponseAkta>(endpoints.akta);

  const {
    data: dataKIA,
    isLoading: isLoadingKIA,
    isError: isErrorKIA,
  } = useGetData<IResponseKia>(endpoints.kia);

  const {
    data: dataKTP,
    isLoading: isLoadingKTP,
    isError: isErrorKTP,
  } = useGetData<IResponseKtp>(endpoints.ktp);

  const dataPieAkta = dataAkta?.data.map((item: any) => ({
    value: formatNumberIndonesia(item.memiliki_akta_lahir),
    name: item.nama_kabkota,
  }));

  const dataPieKIA = dataKIA?.data.map((item: any) => ({
    value: formatNumberIndonesia(item.memiliki_kia),
    name: item.nama_kabkota,
  }));

  const dataPieKTP = dataKTP?.data.map((item: any) => ({
    value: item.kemepilikan_ktp,
    name: item.nama_kabkota,
  }));

  const pieChartOptions = (title: string, data: any) => ({
    tooltip: {
      trigger: "item",
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      show: false,
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['60%', '100%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          color: '#000',
          fontSize: 12,
          fontWeight: 'bold',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  });

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      {/* Akta */}
      <Box flex="1" bg="primary.50" p={6} rounded="2xl" boxShadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={2}>Jumlah Data Akta Per Wilayah</Heading>
        <Box w="full" h="400px" display="flex" justifyContent="center" alignItems="center">
          {isLoadingAkta ? (
            <Center w="full" h="100%">
              <Spinner size="lg" />
            </Center>
          ) : isErrorAkta || !dataAkta ? (
            <Center w="full" h="100%">
              <Text color="red.500">Gagal mengambil data Akta.</Text>
            </Center>
          ) : (
            <ReactECharts option={pieChartOptions("Data Akta", dataPieAkta)} style={{ width: "100%", height: "100%" }} />
          )}
        </Box>
      </Box>

      {/* KIA */}
      <Box flex="1" bg="primary.50" p={6} rounded="2xl" boxShadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={2}>Jumlah Data KIA Per Wilayah</Heading>
        <Box w="full" h="400px" display="flex" justifyContent="center" alignItems="center">
          {isLoadingKIA ? (
            <Center w="full" h="100%">
              <Spinner size="lg" />
            </Center>
          ) : isErrorKIA || !dataKIA ? (
            <Center w="full" h="100%">
              <Text color="red.500">Gagal mengambil data KIA.</Text>
            </Center>
          ) : (
            <ReactECharts option={pieChartOptions("Data KIA", dataPieKIA)} style={{ width: "100%", height: "100%" }} />
          )}
        </Box>
      </Box>

      {/* KTP */}
      <Box flex="1" bg="primary.50" p={6} rounded="2xl" boxShadow="md" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={2}>Jumlah Data KTP Per Wilayah</Heading>
        <Box w="full" h="400px" display="flex" justifyContent="center" alignItems="center">
          {isLoadingKTP ? (
            <Center w="full" h="100%">
              <Spinner size="lg" />
            </Center>
          ) : isErrorKTP || !dataKTP ? (
            <Center w="full" h="100%">
              <Text color="red.500">Gagal mengambil data KTP.</Text>
            </Center>
          ) : (
            <ReactECharts option={pieChartOptions("Data KTP", dataPieKTP)} style={{ width: "100%", height: "100%" }} />
          )}
        </Box>
      </Box>
    </Flex>
  );
}
