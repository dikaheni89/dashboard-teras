'use client';

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Icon, Divider, Flex, VStack,
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import {FaMoneyBill1Wave} from "react-icons/fa6";
import {MdAccountBalance} from "react-icons/md";

export default function PendapatanWidget() {
  const pendapatanData = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Target', 'Realisasi'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Realisasi',
        type: 'line',
        data: [850000, 200000],
        symbol: 'circle',
        symbolSize: 12,
        lineStyle: {
          color: '#EAB308',
        },
        itemStyle: {
          color: '#EAB308',
        },
      },
      {
        name: 'Target',
        type: 'line',
        data: [350000, 50000],
        symbol: 'circle',
        symbolSize: 12,
        lineStyle: {
          color: '#84CC16',
        },
        itemStyle: {
          color: '#84CC16',
        },
      },
    ],
  };

  const areaData = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['2023', '2024', '2025'],
    },
    xAxis: {
      type: 'category',
      data: ['Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '2023',
        type: 'line',
        data: [1200, 1122, 1345, 1600],
        areaStyle: {
          color: 'rgba(59,130,246,0.2)',
        },
        lineStyle: {color: '#3B82F6'},
        itemStyle: {color: '#3B82F6'},
      },
      {
        name: '2024',
        type: 'line',
        data: [1100, 1250, 1350, 1400],
        areaStyle: {
          color: 'rgba(14,165,233,0.2)',
        },
        lineStyle: {color: '#0EA5E9'},
        itemStyle: {color: '#0EA5E9'},
      },
      {
        name: '2025',
        type: 'line',
        data: [1300, 1400, 1700, 1900],
        areaStyle: {
          color: 'rgba(16,185,129,0.2)',
        },
        lineStyle: {color: '#10B981'},
        itemStyle: {color: '#10B981'},
      },
    ],
  };

  const barData = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'shadow'},
        formatter: function (params: any[]) {
          const tooltipData = params.map(p => `${p.seriesName}: ${p.value.toLocaleString()}`).join('<br/>');
          return `<strong>${params[0].name}</strong><br/>${tooltipData}`;
        },
      },
      legend: {
        data: ['2023', '2024', '2025'],
      },
      xAxis: {
        type: 'category',
        data: [
          'Kabupaten Tangerang',
          'Kota Tangerang',
          'Kota Tangerang Selatan',
          'Kabupaten Serang',
          'Kota Serang',
          'Kabupaten Pandeglang',
          'Kabupaten Lebak',
          'Kota Cilegon',
        ],
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '2023',
          type: 'bar',
          stack: 'total',
          data: [3000000000, 2000000000, 1800000000, 1700000000, 1600000000, 800000000, 900000000, 500000000],
          itemStyle: {
            color: '#FACC15',
          },
        },
        {
          name: '2024',
          type: 'bar',
          stack: 'total',
          data: [3700000000, 1800000000, 1400000000, 1200000000, 1600000000, 700000000, 800000000, 400000000],
          itemStyle: {
            color: '#A3E635',
          },
        },
        {
          name: '2025',
          type: 'bar',
          stack: 'total',
          data: [3050000000, 1300000000, 1200000000, 1100000000, 800000000, 1000000000, 1100000000, 600000000],
          itemStyle: {
            color: '#14532D',
          },
        },
      ],
    };

  const sumberData = {
    xAxis: {
      type: 'category',
      data: ['Januari', 'Februari', 'Maret', 'April'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [750, 700, 750, 800],
        type: 'bar',
        color: '#6366F1',
      },
    ],
  };

  const opdTargetData = {
    tooltip: {},
    legend: {},
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: ['BAPPENDA', 'Dinas Kesehatan', 'Dinas Pendidikan', 'BPKAD', 'Dinas Perhubungan'],
    },
    series: [
      {
        name: 'Target',
        type: 'bar',
        stack: 'total',
        data: [10000, 15000, 25000, 20000, 40000],
      },
      {
        name: 'Realisasi',
        type: 'bar',
        stack: 'total',
        data: [8000, 7000, 11000, 12000, 20000],
      },
    ],
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={2} p={4}>
      <Box bg="primary.50" borderRadius="lg" p={2}>
        <HStack mb={1} spacing={2}>
          <Icon as={FaMoneyBill1Wave} boxSize={6} color="green.700" />
          <Heading size="sm" color="blue.900">Pendapatan Daerah</Heading>
        </HStack>
        <Divider borderColor="blue.900" borderWidth={1} mb={2} />
        <Flex justify="space-between" px={2}>
          <VStack spacing={0} align="start">
            <Text fontSize="xl" fontWeight="bold" color="blue.900">RP 11.76 T</Text>
            <Text fontSize="sm" color="gray.600">Target</Text>
          </VStack>
          <VStack spacing={0} align="start">
            <Text fontSize="xl" fontWeight="bold" color="blue.900">RP 2.23 T</Text>
            <Text fontSize="sm" color="gray.600">Realisasi</Text>
          </VStack>
        </Flex>
        <ReactECharts option={pendapatanData} style={{ height: 250 }} />
        <Text fontSize="xs" mt={2} textAlign="center" color="blue.900">
          Data per April 2025
        </Text>
      </Box>

      <Box bg="primary.50" borderRadius="lg" p={2}>
        <Heading size="sm" mb={2}>Rincian Pendapatan Daerah</Heading>
        <ReactECharts option={areaData} style={{ width: '100%', height: '100%' }} />
      </Box>

      <Box bg="primary.50" borderRadius="lg" p={2}>
        <Heading size="sm" mb={4}>OPD Dengan Pendapatan Tertinggi</Heading>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>OPD</Th>
                <Th>Target</Th>
                <Th>Realisasi</Th>
                <Th>Serapan</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Dinas Perhubungan</Td>
                <Td>81 M</Td>
                <Td>39 M</Td>
                <Td>27.5%</Td>
              </Tr>
              <Tr>
                <Td>PUPR</Td>
                <Td>30 M</Td>
                <Td>13.7 M</Td>
                <Td>22.9%</Td>
              </Tr>
              <Tr>
                <Td>Dinas Kesehatan</Td>
                <Td>3.3 M</Td>
                <Td>1 M</Td>
                <Td>20.6%</Td>
              </Tr>
              <Tr>
                <Td>Dinas Sosial</Td>
                <Td>1.7 M</Td>
                <Td>545 J</Td>
                <Td>16.4%</Td>
              </Tr>
              <Tr>
                <Td>BPKAD</Td>
                <Td>2.9 M</Td>
                <Td>837 J</Td>
                <Td>15.8%</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box bg="primary.50" borderRadius="lg" p={2}>
        <HStack mb={1} spacing={2}>
          <Icon as={MdAccountBalance} boxSize={6} color="green.700" />
          <Heading size="sm" color="blue.900">Pajak Daerah</Heading>
        </HStack>
        <Divider borderColor="blue.900" borderWidth={1} mb={2} />
        <ReactECharts option={barData} style={{ height: 300 }} />
      </Box>

      <Box bg="primary.50" borderRadius="lg" p={2}>
        <Heading size="sm" mb={2}>Realisasi Pendapatan Per Sumber</Heading>
        <ReactECharts option={sumberData} style={{ height: 250 }} />
      </Box>

      <Box bg="primary.50" borderRadius="lg" p={2}>
        <Heading size="sm" mb={2}>Target Pendapatan Berdasarkan OPD Pengelola</Heading>
        <ReactECharts option={opdTargetData} style={{ height: 250 }} />
      </Box>
    </SimpleGrid>
  );
}
