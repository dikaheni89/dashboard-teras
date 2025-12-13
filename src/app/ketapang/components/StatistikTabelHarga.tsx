'use client';

import {
  Box,
  Flex,
  Heading,
  VStack,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from "@/app/hooks/useGetData";

interface HargaWilayah {
  kode_kab: number;
  nama_kab: string;
  harga: Record<string, number>;
}

interface IResponse {
  success: boolean;
  data: {
    headers: string[];
    data: HargaWilayah[];
  }[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatistikTabelHarga() {
  const apiUrl = `${getBasePath()}/api/ketapang/tabelharga`;
  const { data, isError } = useGetData<IResponse>(apiUrl);

  const headers = data?.data?.[0]?.headers ?? [];
  const hargaData = data?.data?.[0]?.data ?? [];

  if (isError) {
    return (
      <Box>
        <Heading size="md">Data tidak ditemukan.</Heading>
      </Box>
    );
  }

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={1} p={4}>
      <VStack spacing={6} w="full" h="full">
        <Box bg="primary.50" p={4} w="100%" h="100%" borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>
            Tabel Harga
          </Heading>
          <TableContainer overflowX="auto" maxW="100%">
            <Table size="sm" minW="960px">
              <Thead>
                <Tr bg="blue.50">
                  <Th whiteSpace="nowrap">Wilayah</Th>
                  {headers.map((item: string, index: number) => (
                    <Th key={index} whiteSpace="nowrap" isNumeric>
                      {item}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {hargaData.length > 0 ? (
                  hargaData.map((row, index) => (
                    <Tr key={index}>
                      <Td whiteSpace="nowrap">{row.nama_kab}</Td>
                      {headers.map((header, idx) => (
                        <Td key={idx} isNumeric>
                          {row.harga?.[header] ?? '-'}
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={headers.length + 1} textAlign="center">
                      Data tidak tersedia
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Flex>
  );
}
