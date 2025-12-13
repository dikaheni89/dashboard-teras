'use client';

import {Box, Flex, Heading, HStack, Progress, SimpleGrid, Spinner, Text} from '@chakra-ui/react';
import InvestasiWidget from "@/app/dashboard/components/InvestasiWidget";
import PendudukWidget from "@/app/dashboard/components/PendudukWidget";
import KesehatanWidget from "@/app/dashboard/components/KesehatanWidget";
import TrenKomoditasWidget from "@/app/dashboard/components/TrenKomoditasWidget";
import PendapatanWidget from "@/app/dashboard/components/PendapatanWidget";
import TargetKependudukanWidget from "@/app/dashboard/components/TargetKependudukanWidget";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/keuangan/utama/route";

export default function StatistikWidget() {

  const apiUrl = `${getBasePath()}/api/keuangan/utama`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !data) {
    return <Text>Gagal memuat data.</Text>;
  }

  const infrastrukturData = [
    {
      label: "Rincian Belanja Daerah",
      value: data.data.grafik_belanja_daerah.persen,
      color: "green",
    },
    {
      label: "Rincian Pendapatan Daerah",
      value: data.data.grafik_pendapatan_daerah.persen,
      color: "blue",
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Text color="red.500">Gagal memuat data kependudukan.</Text>
      </Box>
    );
  }

  return (
    <>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={1}>
        <SimpleGrid columns={{ base: 1, md: 1}} spacing={2} p={1} w="xl">
          {/* Teras Kesehatan */}
          <KesehatanWidget />

          {/* Teras Pendapatan */}
          <PendapatanWidget />

          {/* Teras Keuangan */}
          <Box gridColumn="1 / -1" bg="primary.50" p={4} borderRadius="lg" shadow="md">
            <Heading size="sm" mb={4} color="primary.800">
              Teras Keuangan Daerah
            </Heading>
            {infrastrukturData.map((item, i) => (
              <Box key={i} mb={4}>
                <HStack spacing={3} alignItems="center">
                  <Progress
                    flex={1}
                    value={item.value}
                    height="16px"
                    colorScheme={item.color}
                    borderRadius="full"
                    background="#47564e"
                  />
                  <Text fontWeight="semibold" color={"primary.800"} fontSize="lg">
                    {item.value.toFixed(2)}%
                  </Text>
                </HStack>
                <Text fontSize="xs" mt={1} color="primary.800">
                  {item.label}
                </Text>
              </Box>
            ))}
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2}} spacing={2} p={1} w="full" height="50%">
          {/* Realisasi Investasi */}
          <InvestasiWidget />

          {/* Jumlah Penduduk */}
          <PendudukWidget />

          {/* Realisasi Berdasarkan Pendapatan Daerah */}
          <TrenKomoditasWidget />

          {/* Jumlah Penduduk Miskin */}
          <TargetKependudukanWidget />

        </SimpleGrid>
        </Flex>
    </>
  );
}
