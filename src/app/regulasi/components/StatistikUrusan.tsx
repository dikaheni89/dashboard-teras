'use client';

import {
  Box,
  Heading,
  Table,
  Tbody,
  Spinner,
  Td,
  Th,
  Flex,
  Thead,
  Tr,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import {IResponseUrusanPemerintahanItem} from "@/app/api/regulasi/regulasiurusan/route";

export default function StatistikUrusan() {
  const apiUrl = `${getBasePath()}/api/regulasi/regulasiurusan`;
  const { data, isLoading, isError } = useGetData<IResponseUrusanPemerintahanItem>(apiUrl);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" />
        <Text ml={4}>Memuat Data...</Text>
      </Flex>
    );
  }

  if (isError || !data?.data || !Array.isArray(data.data)) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Text color="red.500">Terjadi kesalahan atau data tidak tersedia.</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" p={4}>
      <Box bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
        <Heading size="md" mb={4}>
          Regulasi Berdasarkan Urusan Pemerintahan
        </Heading>

        <TableContainer overflowX="auto" maxH="75vh" overflowY="auto" w="100%">
          <Table size="sm" variant="striped" colorScheme="teal" minW="800px" w="100%">
            <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
              <Tr>
                <Th color="white">No</Th>
                <Th color="white">Unit</Th>
                <Th color="white" isNumeric>Berlaku</Th>
                <Th color="white" isNumeric>Tidak Berlaku</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.data.map((item, index) => (
                <Tr key={`${item.up_name}-${index}`}>
                  <Td>{index + 1}</Td>
                  <Td>{item.up_name}</Td>
                  <Td isNumeric>{item.total_berlaku}</Td>
                  <Td isNumeric>{item.total_tidak_berlaku}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
