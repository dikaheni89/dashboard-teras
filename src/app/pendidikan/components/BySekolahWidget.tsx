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
import { useState } from 'react';
import useGetSekolah from '@/app/hooks/useGetSekolah';

const kotaOptions = [
  { value: 'Kota Serang', label: 'Kota Serang' },
  { value: 'Kota Tangerang Selatan', label: 'Kota Tangerang Selatan' },
  { value: 'Kota Tangerang', label: 'Kota Tangerang' },
  { value: 'Kota Cilegon', label: 'Kota Cilegon' },
  { value: 'Kab. Tangerang', label: 'Kab. Tangerang' },
  { value: 'Kab. Pandeglang', label: 'Kab. Pandeglang' },
  { value: 'Kab. Lebak', label: 'Kab. Lebak' },
  { value: 'Kab. Serang', label: 'Kab. Serang' },
];

const bentukOptions = [
  { value: 'SMA', label: 'SMA' },
  { value: 'SMK', label: 'SMK' },
  { value: 'SLB', label: 'SLB' },
];

const statusOptions = [
  { value: 'Negeri', label: 'Negeri' },
  { value: 'Swasta', label: 'Swasta' },
];

export default function BySekolahWidget() {
  const [selectedKota, setSelectedKota] = useState('Kota Serang');
  const [selectedBentuk, setSelectedBentuk] = useState('SMA');
  const [selectedStatus, setSelectedStatus] = useState('Negeri');

  const { data, isLoading, isError } = useGetSekolah(
    selectedKota,
    selectedBentuk,
    selectedStatus
  );

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" />
        <Text ml={4}>Memuat Data...</Text>
      </Flex>
    );
  }

  if (isError || !data || !Array.isArray(data.data)) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Text color="red.500">Terjadi kesalahan atau data tidak tersedia.</Text>
      </Flex>
    );
  }
console.log(data);
  return (
    <Flex direction="column" p={4}>
      <Box bg="primary.50" p={4} borderRadius="lg" shadow="md" w="100%">
        <Heading size="md" mb={4}>
          Daftar Sekolah di {selectedKota}
        </Heading>

        <Flex gap={4} mb={4} wrap="wrap">
          <Select
            maxW="200px"
            value={selectedKota}
            onChange={(e) => setSelectedKota(e.target.value)}
          >
            {kotaOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Select
            maxW="200px"
            value={selectedBentuk}
            onChange={(e) => setSelectedBentuk(e.target.value)}
          >
            {bentukOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Select
            maxW="200px"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Flex>

        <TableContainer overflowX="auto" maxH="75vh" overflowY="auto" w="100%">
          <Table size="sm" variant="striped" colorScheme="teal" minW="1000px" w="100%">
            <Thead position="sticky" top={0} bg="teal.800" zIndex={1}>
              <Tr>
                <Th color="white">No</Th>
                <Th color="white">Nama Sekolah</Th>
                <Th color="white" isNumeric>Jumlah Ruang Kelas</Th>
                <Th color="white" isNumeric>Guru</Th>
                <Th color="white" isNumeric>Tendik</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.data.map((item, index) => (
                <Tr key={`${item.npsn}-${index}`}>
                  <Td>{index + 1}</Td>
                  <Td>{item.nama_satuan_pendidikan}</Td>
                  <Td isNumeric>{item.jumlah_ruang_kelas}</Td>
                  <Td isNumeric>{item.guru}</Td>
                  <Td isNumeric>{item.tendik}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}