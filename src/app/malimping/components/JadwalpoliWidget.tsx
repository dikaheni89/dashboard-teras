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
  Text,
} from '@chakra-ui/react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from "@/app/hooks/useGetData";
import { IResponseParamedice } from "@/app/api/malimping/poli/route";

export default function JadwalpoliWidget() {
  const apiUrl = `${getBasePath()}/api/malimping/poli`;
  const { data } = useGetData<IResponseParamedice>(apiUrl);

  if (!data || !Array.isArray(data.data?.last_updated)) {
    return <Text p={4}>Data tidak tersedia atau tidak valid</Text>;
  }

  return (
    <Box p={4}>
      <TableContainer overflowX="auto" maxH="75vh" overflowY="auto">
        <Table size="sm" variant="striped" colorScheme="teal">
          <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
            <Tr>
              <Th color="white" minW="40px">No</Th>
              <Th color="white" minW="100px">Tanggal</Th>
              <Th color="white" minW="120px">Waktu</Th>
              <Th color="white" minW="200px">Nama Dokter</Th>
              <Th color="white" minW="150px">Unit Layanan</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.last_updated.map((item, index) => (
              <Tr key={`${item.paramedic_id}-${index}`}>
                <Td>{index + 1}</Td>
                <Td>{new Date(item.schedule_date).toLocaleDateString('id-ID')}</Td>
                <Td>{item.operational_time_name}</Td>
                <Td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {item.paramedic_name}
                </Td>
                <Td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {item.service_unit_name}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
