'use client';

import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Text, Heading,
} from '@chakra-ui/react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import {IResponseLowLokasi} from "@/app/api/pariwisata/toplow/route";

export default function StatistikTopLow() {
  const apiUrl = `${getBasePath()}/api/pariwisata/toplow`;
  const { data } = useGetData<IResponseLowLokasi>(apiUrl);

  if (!data || !Array.isArray(data.data)) {
    return <Text p={4}>Data tidak tersedia atau tidak valid</Text>;
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        10 Lokasi yang Paling Sedikit Dikunjungi
      </Heading>
      <TableContainer overflowX="auto" maxH="75vh" overflowY="auto">
        <Table size="sm" variant="striped" colorScheme="teal">
          <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
            <Tr>
              <Th color="white" minW="40px">No</Th>
              <Th color="white" minW="250px">Nama Homestay</Th>
              <Th color="white" minW="120px" isNumeric>Total Kunjungan</Th>
              <Th color="white" minW="120px" isNumeric> Nusantara</Th>
              <Th color="white" minW="120px" isNumeric> Mancanegara</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map((item, index) => (
              <Tr key={item.lokasi_id}>
                <Td>{index + 1}</Td>
                <Td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {item.nama_lokasi}
                </Td>
                <Td isNumeric>{parseInt(item.total_kunjungan).toLocaleString('id-ID')}</Td>
                <Td isNumeric>{parseInt(item.total_nusantara).toLocaleString('id-ID')}</Td>
                <Td isNumeric>{parseInt(item.total_mancanegara).toLocaleString('id-ID')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
