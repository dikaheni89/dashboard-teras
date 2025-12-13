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
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/kinerja/kinerjabulanan/route';

const monthOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

export default function PelamarkategoriWidget() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [apiUrl, setApiUrl] = useState(
    `${getBasePath()}/api/kinerja/kinerjabulanan?bulan=${selectedMonth}`
  );

  useEffect(() => {
    setApiUrl(`${getBasePath()}/api/kinerja/kinerjabulanan?bulan=${selectedMonth}`);
  }, [selectedMonth]);

  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl);

  if (!data || !Array.isArray(data.data)) {
    return <Text p={4}>Data tidak tersedia atau tidak valid</Text>;
  }

  const bulanNama =
    monthOptions.find((item) => item.value === selectedMonth)?.label || '';

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" />
        <Text ml={4}>Memuat Data...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Text color="red.500">Terjadi kesalahan saat memuat data.</Text>
      </Flex>
    );
  }

  if (!data || !Array.isArray(data.data)) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Text>Data tidak tersedia atau format tidak valid.</Text>
      </Flex>
    );
  }
  return (
    <Flex direction="column" p={4}>
    <Box bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
        
      <Heading size="md" mb={4}>
        Grafik Kinerja OPD Bulan {bulanNama}
      </Heading>

      <Select
        maxW="200px"
        mb={4}
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
      >
        {monthOptions.map((bulan) => (
          <option key={bulan.value} value={bulan.value}>
            {bulan.label}
          </option>
        ))}
      </Select>

      <TableContainer overflowX="auto" maxH="75vh" overflowY="auto" w="100%">
  <Table
    size="sm"
    variant="striped"
    colorScheme="teal"
    minW="1000px"   // lebar minimum agar konten tetap utuh
    w="100%"        // supaya fleksibel sesuai kontainer
  >
    <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
      <Tr>
        <Th color="white">No</Th>
        <Th color="white" maxW="300px" whiteSpace="normal" wordBreak="break-word">
          Nama OPD
        </Th>
        <Th color="white" isNumeric>Target Fisik (%)</Th>
        <Th color="white" isNumeric>Realisasi Fisik (%)</Th>
        <Th color="white" isNumeric>Capaian Fisik (%)</Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.data.map((item, index) => {
        const { nm_unit, target_fisik, realisasi_fisik, capaian_fisik } = item;
        return (
          <Tr key={item.nm_unit}>
            <Td>{index + 1}</Td>
            <Td maxW="300px" whiteSpace="normal" wordBreak="break-word">{nm_unit}</Td>
            <Td isNumeric>{target_fisik}</Td>
            <Td isNumeric>{realisasi_fisik}</Td>
            <Td isNumeric>{capaian_fisik}</Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
</TableContainer>

    </Box>
    </Flex>
  );
}
