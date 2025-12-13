'use client';

import {Box, Flex, Text, Progress, VStack, useColorModeValue, Spinner} from '@chakra-ui/react';
import {getBasePath} from "@/libs/utils/getBasePath";
import {IResponsePanjangPerTipe} from "@/app/api/infrastruktur/perkerasan/route";
import useGetData from "@/app/hooks/useGetData";
import {IResponseStatus} from "@/app/api/infrastruktur/status/route";
import {IResponseFungsi} from "@/app/api/infrastruktur/fungsi/route";

const endpoints = {
  perkerasan: `${getBasePath()}/api/infrastruktur/perkerasan`,
  status: `${getBasePath()}/api/infrastruktur/status`,
  fungsi: `${getBasePath()}/api/infrastruktur/fungsi`,
};

export default function RekapPerkerasanWidget() {
  const {
    data: dataPerkerasan,
    isError: isErrorPerkerasan,
    isLoading: isLoadingPerkerasan,
  } = useGetData<IResponsePanjangPerTipe>(endpoints.perkerasan.toString());

  const {
    data: dataStatus,
    isError: isErrorStatus,
    isLoading: isLoadingStatus,
  } = useGetData<IResponseStatus>(endpoints.status.toString());

  const {
    data: dataFungsi,
    isError: isErrorFungsi,
    isLoading: isLoadingFungsi,
  } = useGetData<IResponseFungsi>(endpoints.fungsi.toString());

  const cardBg = useColorModeValue('orange.50', 'gray.700');
  const borderColor = useColorModeValue('orange.400', 'orange.300');

  const getColorScheme = (tipe: string): string => {
    switch (tipe.toLowerCase()) {
      case 'aspal':
        return 'cyan';
      case 'beton':
        return 'yellow';
      case 'tanah':
        return 'red';
      default:
        return 'gray';
    }
  };

  const totalPanjang = dataPerkerasan?.data?.reduce((sum, item) => sum + item.panjang, 0) ?? 0;

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
      <Box flex={1} borderLeft="5px solid" borderColor={borderColor} bg={cardBg} borderRadius="md" p={4}>
        <Text fontWeight="bold" mb={4}>
          Tipe Perkerasan Jalan
        </Text>
        <VStack align="stretch" spacing={6}>
          {isLoadingPerkerasan && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Spinner size="xl" />
              <Text ml={4}>Memuat Data...</Text>
            </Flex>
          )}

          {isErrorPerkerasan && (
            <Flex justifyContent="center" alignItems="center" height="60vh">
              <Text color="red.500">Terjadi kesalahan saat memuat data.</Text>
            </Flex>
          )}

          {!isLoadingPerkerasan && !isErrorPerkerasan && dataPerkerasan?.data?.length === 0 && (
            <Text textAlign="center" fontSize="sm" color="gray.500">
              Tidak ada data yang tersedia
            </Text>
          )}
          {!isLoadingPerkerasan && !isErrorPerkerasan && dataPerkerasan?.data.map((item, idx) => {
            const persentase = totalPanjang > 0 ? Math.round((item.panjang / totalPanjang) * 100) : 0;
            return (
              <Box key={idx}>
                <Text mb={1}>{item.tipe}</Text>
                <Progress
                  value={persentase}
                  colorScheme={getColorScheme(item.tipe)}
                  borderRadius="md"
                  height='28px'
                />
                <Text fontSize="sm" mt={1}>
                  {`${Math.ceil(item.panjang)} Km (${persentase}%)`}
                </Text>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <Box
        flex={1}
        borderLeft="5px solid"
        borderColor={borderColor}
        bg={cardBg}
        borderRadius="md"
        p={4}
      >
        <Text fontWeight="bold" mb={4}>
          Status Total Panjang Jalan
        </Text>
        <VStack align="stretch" spacing={6} minH="150px" justify="center">
          {isLoadingStatus && (
            <Flex justifyContent="center" alignItems="center" minH="150px">
              <Spinner size="xl" />
              <Text ml={4}>Memuat Data Status...</Text>
            </Flex>
          )}

          {isErrorStatus && (
            <Flex justifyContent="center" alignItems="center" minH="150px">
              <Text color="red.500">Gagal memuat status panjang jalan.</Text>
            </Flex>
          )}

          {!isLoadingStatus &&
            !isErrorStatus &&
            dataStatus?.data?.length === 0 && (
              <Text textAlign="center" fontSize="sm" color="gray.500">
                Tidak ada data status jalan
              </Text>
            )}

          {!isLoadingStatus &&
            !isErrorStatus &&
            dataStatus?.data.map((item, idx) => {
              const totalAll =
                dataStatus.data.reduce((sum, d) => sum + d.total_panjang, 0) ?? 0;
              const persentase =
                totalAll > 0
                  ? Math.round((item.total_panjang / totalAll) * 100)
                  : 0;

              const getColorByStatus = (status: string): string => {
                if (status.toLowerCase().includes('nasional')) return 'blue';
                if (status.toLowerCase().includes('provinsi')) return 'green';
                if (status.toLowerCase().includes('kabupaten')) return 'yellow';
                return 'gray';
              };

              return (
                <Box key={idx}>
                  <Text mb={1}>{item.status}</Text>
                  <Progress
                    value={persentase}
                    colorScheme={getColorByStatus(item.status)}
                    borderRadius="md"
                    height="28px"
                  />
                  <Text fontSize="sm" mt={1}>
                    {`${Math.ceil(item.total_panjang)} Km (${persentase}%)`}
                  </Text>
                </Box>
              );
            })}
        </VStack>
      </Box>

      <Box
        flex={1}
        borderLeft="5px solid"
        borderColor={borderColor}
        bg={cardBg}
        borderRadius="md"
        p={4}
      >
        <Text fontWeight="bold" mb={4}>
          Total Distribusi Fungsi Jalan
        </Text>

        <VStack align="stretch" spacing={6} minH="150px" justify="center">
          {isLoadingFungsi && (
            <Flex justifyContent="center" alignItems="center" minH="150px">
              <Spinner size="xl" />
              <Text ml={4}>Memuat Data Status...</Text>
            </Flex>
          )}

          {isErrorFungsi && (
            <Flex justifyContent="center" alignItems="center" minH="150px">
              <Text color="red.500">Gagal memuat Fungsi panjang jalan.</Text>
            </Flex>
          )}

          {!isLoadingFungsi &&
            !isErrorFungsi &&
            dataFungsi?.data?.length === 0 && (
              <Text textAlign="center" fontSize="sm" color="gray.500">
                Tidak ada data Fungsi jalan
              </Text>
            )}

          {!isLoadingFungsi &&
            !isErrorFungsi &&
            Array.isArray(dataFungsi?.data) &&
            dataFungsi.data.map((item, idx) => {
              const totalAll =
                dataFungsi.data.reduce((sum, d) => sum + (d.total_panjang || 0), 0) ?? 0;

              const persentase =
                totalAll > 0
                  ? Math.round(((item.total_panjang || 0) / totalAll) * 100)
                  : 0;

              const getColorByStatus = (fungsi?: string): string => {
                const normalized = fungsi?.toLowerCase().trim() ?? '';

                if (normalized.includes('arteri')) return 'green';
                if (normalized.includes('kolektor')) return 'blue';
                if (normalized.includes('tol')) return 'yellow';

                return 'gray';
              };

              return (
                <Box key={idx}>
                  <Text mb={1}>{item.fungsi ?? 'Tidak diketahui'}</Text>
                  <Progress
                    value={persentase}
                    colorScheme={getColorByStatus(item.fungsi)}
                    borderRadius="md"
                    height="28px"
                  />
                  <Text fontSize="sm" mt={1}>
                    {`${Math.ceil(item.total_panjang || 0)} Km (${persentase}%)`}
                  </Text>
                </Box>
              );
            })}
        </VStack>
      </Box>
    </Flex>
  );
}
