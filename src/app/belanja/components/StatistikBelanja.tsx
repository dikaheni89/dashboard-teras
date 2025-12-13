'use client';

import {
  Text,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Box,
  Flex,
  Thead,
  CircularProgress,
  Center,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartData,
  ChartOptions,
  BarElement,
  BarController,
  TooltipItem,
} from 'chart.js';
import ReactECharts from 'echarts-for-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/keuangan/utama/route';
import { formatPercent, formatRp } from '@/libs/utils/helper';
import StatistikOpd from '@/app/belanja/components/StatistikOpd';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Filler,
  BarElement,
  BarController
);

export default function StatistikBelanja() {
  const apiUrl = `${getBasePath()}/api/keuangan/utama`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  const {
    data_utama = {
      target_pendapatan_daerah: 0,
      realisasi_pendapatan_daerah: 0,
      pagu_belanja_daerah: 0,
      realisasi_belanja_daerah: 0,
    },
    rincian_belanja_daerah = [],
    rincian_pendapatan_daerah = [],
    chart_belanja = [],
    chart_pendapatan = [],
    grafik_belanja_daerah = { persen: 0 },
    grafik_pendapatan_daerah = { persen: 0 },
  } = data?.data || {};

  const labels = chart_belanja.map((item) => item.bulan);
  const anggaranKasBelanja = chart_belanja.map((item) => item.anggaran_kas);
  const realisasiBelanja = chart_belanja.map((item) => item.realisasi_anggaran);

  const anggaranKasPendapatan = chart_pendapatan.map((item) => item.anggaran_kas);
  const realisasiPendapatan = chart_pendapatan.map((item) => item.realisasi_anggaran);

  const lineData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Anggaran KAS Belanja',
        data: anggaranKasBelanja,
        backgroundColor: 'rgba(120, 227, 236, 0.5)',
        borderColor: 'rgba(120, 227, 236, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
      {
        label: 'Realisasi Belanja',
        data: realisasiBelanja,
        backgroundColor: 'rgba(109, 202, 241, 0.5)',
        borderColor: 'rgba(109, 202, 241, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineDataPendapatan: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Anggaran KAS Pendapatan',
        data: anggaranKasPendapatan,
        backgroundColor: 'rgba(120, 227, 236, 0.5)',
        borderColor: 'rgba(120, 227, 236, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
      {
        label: 'Realisasi Pendapatan',
        data: realisasiPendapatan,
        backgroundColor: 'rgba(109, 202, 241, 0.5)',
        borderColor: 'rgba(109, 202, 241, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#000',
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        cornerRadius: 6,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items) => items[0].label || '',
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = formatRp(Number(context.raw));
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#000', font: { size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  const optionGaugePendapatan = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '100%',
        center: ['50%', '70%'],
        pointer: {
          show: true,
          length: '100%',
          width: 6,
          itemStyle: { color: '#D6AD60' },
        },
        axisLine: {
          lineStyle: { width: 18, color: [[1, '#7DD3FC']] },
        },
        progress: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        anchor: {
          show: true,
          showAbove: true,
          size: 14,
          itemStyle: { color: '#D6AD60' },
        },
        title: { show: false },
        detail: { show: false },
        data: [{ value: (3326368037309 / 11767801530260) * 100 }],
      },
    ],
  };

  const optionGaugeBelanja = {
    series: [
      {
        ...optionGaugePendapatan.series[0],
        data: [{ value: (2886825538346 / 11771839164497) * 100 }],
      },
    ],
  };

  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={2}>Rincian Pendapatan Daerah</Heading>
          <Flex justifyContent="space-between" pt={3}>
            <Box textAlign="center"><Text fontWeight="bold">{formatRp(data_utama.target_pendapatan_daerah)}</Text><Text fontSize="xs">Target</Text></Box>
            <Box textAlign="center"><Text fontWeight="bold">{formatPercent(grafik_pendapatan_daerah.persen)}</Text><Text fontSize="xs">Capaian</Text></Box>
            <Box textAlign="center"><Text fontWeight="bold">{formatRp(data_utama.realisasi_pendapatan_daerah)}</Text><Text fontSize="xs">Realisasi</Text></Box>
          </Flex>
          <Box w="full" display="flex" justifyContent="center" alignItems="center">
            {data ? (
              <ReactECharts option={optionGaugePendapatan} style={{ width: '200px', height: '200px' }} />
            ) : (
              <Center w="200px" h="200px"><CircularProgress isIndeterminate color="blue.300" /></Center>
            )}
          </Box>
          <TableContainer h="100%" overflowY="auto">
            <Table size="sm">
              <Thead>
                <Tr bg="blue.50">
                  <Td fontWeight="bold">Uraian</Td>
                  <Td textAlign="center" fontWeight="bold">Target (Rp)</Td>
                  <Td textAlign="center" fontWeight="bold">Realisasi (Rp)</Td>
                  <Td textAlign="center" fontWeight="bold">Capaian (%)</Td>
                </Tr>
              </Thead>
              <Tbody>
                {rincian_pendapatan_daerah.map((item, idx) => (
                  <Tr key={idx}>
                    <Td>{item.uraian}</Td>
                    <Td textAlign="right">{formatRp(item.target_rp)}</Td>
                    <Td textAlign="right">{formatRp(item.realisasi_rp)}</Td>
                    <Td textAlign="center">{item.persen}%</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={2}>Rincian Belanja Daerah</Heading>
          <Flex justifyContent="space-between" pt={3}>
            <Box textAlign="center"><Text fontWeight="bold">{formatRp(data_utama.pagu_belanja_daerah)}</Text><Text fontSize="xs">Target</Text></Box>
            <Box textAlign="center"><Text fontWeight="bold">{formatPercent(grafik_belanja_daerah.persen)}</Text><Text fontSize="xs">Capaian</Text></Box>
            <Box textAlign="center"><Text fontWeight="bold">{formatRp(data_utama.realisasi_belanja_daerah)}</Text><Text fontSize="xs">Realisasi</Text></Box>
          </Flex>
          <Box w="full" display="flex" justifyContent="center" alignItems="center">
            {data ? (
              <ReactECharts option={optionGaugeBelanja} style={{ width: '200px', height: '200px' }} />
            ) : (
              <Center w="200px" h="200px"><CircularProgress isIndeterminate color="blue.300" /></Center>
            )}
          </Box>
          <TableContainer h="100%" overflowY="auto">
            <Table size="sm">
              <Thead>
                <Tr bg="blue.50">
                  <Td fontWeight="bold">Uraian</Td>
                  <Td textAlign="center" fontWeight="bold">Target (Rp)</Td>
                  <Td textAlign="center" fontWeight="bold">Realisasi (Rp)</Td>
                  <Td textAlign="center" fontWeight="bold">Capaian (%)</Td>
                </Tr>
              </Thead>
              <Tbody>
                {rincian_belanja_daerah.map((item, idx) => (
                  <Tr key={idx}>
                    <Td>{item.uraian}</Td>
                    <Td textAlign="right">{formatRp(item.target_rp)}</Td>
                    <Td textAlign="right">{formatRp(item.realisasi_rp)}</Td>
                    <Td textAlign="center">{item.persen}%</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={4}>Perbandingan Realisasi dan Anggaran KAS Pendapatan Daerah</Heading>
          <Box w="100%" h="300px">
            {data ? (
              <Line data={lineDataPendapatan} options={lineOptions} />
            ) : (
              <Center w="100%" h="300px"><CircularProgress isIndeterminate color="blue.300" /></Center>
            )}
          </Box>
        </Box>

        <Box flex="1" bg="primary.50" boxShadow="md" p={6} rounded="2xl" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={4}>Perbandingan Realisasi dan Anggaran KAS Belanja Daerah</Heading>
          <Box w="100%" h="300px">
            {data ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <Center w="100%" h="300px"><CircularProgress isIndeterminate color="blue.300" /></Center>
            )}
          </Box>
        </Box>
      </Flex>

      <StatistikOpd />
    </>
  );
}
