'use client';
import {
  Box, Text, HStack, VStack,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NationalAverage() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: '2023',
        data: [12000, 12500, 13000, 13500, 14000, 14500, 15000, 15200, 15400, 15600, 15800, 16000],
        borderColor: '#38A169',
        backgroundColor: 'rgba(56, 161, 105, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'HET (Zona 1)',
        data: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
        borderColor: '#3182CE',
        backgroundColor: 'rgba(49, 130, 206, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
      },
      {
        label: '2024',
        data: [14000, 14200, 14400, 14600, 14800, 15000, 15200, 15400, 15600, 15800, 16000, 16200],
        borderColor: '#ECC94B',
        backgroundColor: 'rgba(236, 201, 75, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: '2025',
        data: [15000, 15100, 15200, 15300, 15400, 15500, 15600, 15700, 15800, 15900, 16000, 16100],
        borderColor: '#63B3ED',
        backgroundColor: 'rgba(99, 179, 237, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: Rp ${context.parsed.y.toLocaleString()}/Kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 11500,
        max: 16500,
        grid: {
          display: true,
          color: '#E2E8F0',
        },
        ticks: {
          callback: function(value: any) {
            return `Rp ${value.toLocaleString()}`;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <VStack align="start" spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Rata-Rata Nasional & Zona
        </Text>
        <HStack spacing={6}>
          <Text fontSize="sm" color="gray.600">
            Rata-Rata Nasional: Rp 15.214/Kg
          </Text>
          <Text fontSize="sm" color="gray.600">
            Rata - Rata Zona 1: Rp 15.441 /Kg
          </Text>
        </HStack>
      </VStack>
      <Box h="300px">
        <Line data={data} options={options} />
      </Box>
      <HStack justify="center" mt={4} spacing={4}>
        <Text fontSize="xs" color="gray.600">15.750</Text>
        <Text fontSize="xs" color="gray.600">Kota Cilegon 14.000</Text>
        <Text fontSize="xs" color="gray.600">Kab. Pandeglang</Text>
      </HStack>
    </Box>
  );
}
