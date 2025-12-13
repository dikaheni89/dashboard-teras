'use client';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import {IResponseKategori} from "@/app/api/spanlapor/kategori/route";

export default function TableKategoriWidget() {
  const apiUrl = `${getBasePath()}/api/spanlapor/kategori`;
  const { data } = useGetData<IResponseKategori>(apiUrl.toString());

  const tableData = data?.data || [];

  return (
    <Box bg="white" boxShadow="md" rounded="xl" p={6}>
      <HStack mb={4} flexWrap="wrap" justifyContent="space-between">
        <Heading size="md">Top Kategori Aduan</Heading>
      </HStack>
      <Box
        w="full"
        overflowX="auto"
        overflowY="auto"
        maxH="500px"
        borderRadius="md"
        p={4}
        className="overflow-auto"
      >
        <Table size="md" fontSize="lg" variant="simple" layout="fixed">
          <Thead bg="gray.100" fontSize="lg">
            <Tr>
              <Th minW="200px">Kategori</Th>
              <Th>Jumlah</Th>
              <Th>Instansi</Th>
              <Th>Periode</Th>
              <Th>Sumber</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item, idx) => (
              <Tr key={idx}>
                <Td>{item.kategori}</Td>
                <Td>{item.jumlah}</Td>
                <Td>{item.instansi}</Td>
                <Td>{item.periode}</Td>
                <Td>{item.source}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
