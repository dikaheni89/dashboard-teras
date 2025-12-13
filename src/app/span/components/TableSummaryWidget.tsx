'use client';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Progress,
  Input,
  Heading,
  HStack,
} from '@chakra-ui/react';
import {useMemo, useState } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { ISpanResponse } from '@/app/api/spanlapor/dashboard/route';
import DynamicSelect from '@/components/DynamicSelect';

type Option = {
  value: string;
  label: string;
};

export default function TableSummaryWidget() {
  const apiUrl = `${getBasePath()}/api/spanlapor/dashboard`;
  const { data } = useGetData<ISpanResponse>(apiUrl.toString());

  const tableData = useMemo(() => {
    return data?.data?.span_lapor_summary || [];
  }, [data]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const calculatePercentage = (selesai: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((selesai / total) * 100);
  };

  const statusOptions: Option[] = [
    { value: 'all', label: 'Semua Status' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'proses', label: 'Dalam Proses' },
    { value: 'belum', label: 'Belum Ditindaklanjuti' },
  ];

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesSearch = item.nama_opd.toLowerCase().includes(search.toLowerCase());

      const statusMatches = (() => {
        switch (statusFilter) {
          case 'selesai':
            return item.selesai > 0;
          case 'proses':
            return item.proses > 0;
          case 'belum':
            return item.belum_ditindaklanjuti > 0;
          default:
            return true;
        }
      })();

      return matchesSearch && statusMatches;
    });
  }, [tableData, search, statusFilter]);

  return (
    <Box
      bg="white"
      boxShadow="md"
      rounded="xl"
      p={6}
    >
      <HStack mb={4} flexWrap="wrap" spacing={2} justifyContent="space-between">
        <Heading size="md">Laporan per OPD</Heading>
        <HStack spacing={2}>
          <Input
            placeholder="🔍 Cari OPD..."
            size="md"
            borderRadius="md"
            maxW="200px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box minW="180px">
            <DynamicSelect
              options={statusOptions}
              placeholder="Pilih Status"
              onChange={(option) => setStatusFilter((option as Option)?.value || 'all')}
              isClearable={false}
            />
          </Box>
        </HStack>
      </HStack>
      <Box w="full" overflowX="auto" overflowY="auto" maxH="500px"  borderRadius="md" p={4} className="overflow-auto">
        <Table size="md" fontSize="lg" variant="simple" layout="fixed">
        <Thead bg="gray.100" fontSize="lg">
          <Tr>
            <Th minW="200px">Nama OPD</Th>
            <Th isNumeric>Total Laporan</Th>
            <Th isNumeric>Selesai</Th>
            <Th isNumeric>Dalam Proses</Th>
            <Th isNumeric>Belum Ditindaklanjuti</Th>
            <Th isNumeric>Persentase Penyelesaian</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((item, idx) => {
            const persen = calculatePercentage(item.selesai, item.total_aduan);
            return (
              <Tr key={idx}>
                <Td whiteSpace="normal">{item.nama_opd}</Td>
                <Td isNumeric>{item.total_aduan}</Td>
                <Td isNumeric>
                  <Text color="green.500" fontWeight="bold">{item.selesai}</Text>
                </Td>
                <Td isNumeric>
                  <Text color="orange.400" fontWeight="bold">{item.proses}</Text>
                </Td>
                <Td isNumeric>
                  <Text color="red.500" fontWeight="bold">{item.belum_ditindaklanjuti}</Text>
                </Td>
                <Td isNumeric>
                  <HStack spacing={2}>
                    <Progress value={persen} colorScheme="blue" size="sm" rounded="full" flex="1" />
                    <Text fontWeight="semibold" minW="40px">{persen}%</Text>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      </Box>
    </Box>
  );
}
