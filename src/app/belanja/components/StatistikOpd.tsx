'use client';

import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from "@/app/hooks/useGetData";
import { IResponseOPD } from "@/app/api/keuangan/belanja/route";

export default function StatistikBelanja() {
  const apiUrl = `${getBasePath()}/api/keuangan/belanja`;
  const { data } = useGetData<IResponseOPD>(apiUrl);

  if (!data || !Array.isArray(data.data)) {
    return <Text p={4}>Data tidak tersedia atau tidak valid</Text>;
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Tabel Pagu & Realisasi Anggaran Belanja OPD
      </Heading>
      <TableContainer overflowX="auto" maxH="75vh" overflowY="auto">
        <Table size="sm" variant="striped" colorScheme="teal" minW="900px">
          <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
            <Tr>
              <Th color="white">No</Th>
              <Th color="white" maxW="300px" whiteSpace="normal" wordBreak="break-word">
                Nama OPD
              </Th>
              <Th color="white" isNumeric>Pagu Anggaran (Rp)</Th>
              <Th color="white" isNumeric>Realisasi Anggaran (Rp)</Th>
              <Th color="white" isNumeric>% Realisasi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map((item, index) => {
              const { nama_opd, pagu_anggaran, realisasi_anggaran } = item;
              const persen = pagu_anggaran > 0
                ? (realisasi_anggaran / pagu_anggaran) * 100
                : 0;

              return (
                <Tr key={item.opd_id}>
                  <Td>{index + 1}</Td>
                  <Td maxW="300px" whiteSpace="normal" wordBreak="break-word">{nama_opd}</Td>
                  <Td isNumeric>{pagu_anggaran.toLocaleString('id-ID')}</Td>
                  <Td isNumeric>{realisasi_anggaran.toLocaleString('id-ID')}</Td>
                  <Td isNumeric>{persen.toFixed(2)}%</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
