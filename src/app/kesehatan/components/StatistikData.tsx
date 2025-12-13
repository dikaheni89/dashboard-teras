'use client';

import {
  Box,
  Flex,
  Heading,
  CircularProgress,
  Center,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/kesehatan/tempat/route';

const apiUrl = `${getBasePath()}/api/kesehatan/tempat`;

export default function StatistikData() {
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl);

  return (
    <Flex direction="column" p={4}>
      <Box bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
        <Heading size="md" mb={4}>
          Jumlah Tempat Tidur Berdasarkan Ruangan
        </Heading>

        {/* Kondisi Loading */}
        {isLoading && (
          <Center h="200px">
            <CircularProgress isIndeterminate color="purple.400" size="40px" />
            <Text ml={4}>Memuat data...</Text>
          </Center>
        )}

        {isError && (
          <Center h="200px">
            <Text color="red.500">Terjadi kesalahan saat memuat data.</Text>
          </Center>
        )}

        {!isLoading && !isError && (!data || !Array.isArray(data.data)) && (
          <Center h="200px">
            <Text>Data tidak tersedia atau format tidak valid.</Text>
          </Center>
        )}

        {!isLoading && !isError && Array.isArray(data?.data) && (
          <TableContainer overflowX="auto" maxH="75vh" overflowY="auto">
            <Table size="sm" variant="striped" colorScheme="purple" minW="800px">
              <Thead position="sticky" top={0} bg="purple.800" zIndex={1}>
                <Tr>
                  <Th color="white">No</Th>
                  <Th color="white" maxW="400px" whiteSpace="normal" wordBreak="break-word">
                    Nama Ruangan
                  </Th>
                  <Th color="white" isNumeric>Total Tempat Tidur</Th>
                  <Th color="white" isNumeric>Isi</Th>
                  <Th color="white" isNumeric>Kosong</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((item, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td maxW="400px" whiteSpace="normal" wordBreak="break-word">
                      {item.ruangan}
                    </Td>
                    <Td isNumeric>{item.total}</Td>
                    <Td isNumeric>{item.isi}</Td>
                    <Td isNumeric>{item.kosong}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Flex>
  );
}
