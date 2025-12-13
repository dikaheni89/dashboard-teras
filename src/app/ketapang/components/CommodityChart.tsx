'use client';
import {
  Box, Text, HStack,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CommodityChart() {
  const data = {
    labels: [
      'Jagung', 'Kedelai', 'Bawang Merah', 'Bawang Putih', 'Cabai Besar', 
      'Cabai Rawit', 'Daging Sapi', 'Daging Ayam Ras', 'Telur Ayam Ras', 
      'Gula Pasir', 'Minyak Goreng'
    ],
    datasets: [
      {
        label: 'KEBUTUHAN NERACA',
        data: [20000, 15000, 25000, 30000, 35000, 40000, 45000, 180000, 200000, 60000, 80000],
        backgroundColor: '#3182CE',
        borderColor: '#2C5282',
        borderWidth: 1,
      },
      {
        label: 'PROYEKSI',
        data: [30000, 25000, 35000, 40000, 45000, 50000, 55000, 220000, 240000, 80000, 100000],
        backgroundColor: '#38A169',
        borderColor: '#2F855A',
        borderWidth: 1,
      },
      {
        label: 'SURPLUS/DEFISIT',
        data: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 40000, 40000, 20000, 20000],
        backgroundColor: '#ECC94B',
        borderColor: '#D69E2E',
        borderWidth: 1,
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
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 250000,
        grid: {
          display: true,
          color: '#E2E8F0',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          }
        }
      },
    },
  };

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Ketersediaan Komoditas
      </Text>
      <Box h="300px">
        <Bar data={data} options={options} />
      </Box>
      <HStack justify="center" mt={4} spacing={6}>
        <HStack>
          <Box w={3} h={3} bg="blue.500" rounded="sm"></Box>
          <Text fontSize="xs">KEBUTUHAN NERACA</Text>
        </HStack>
        <HStack>
          <Box w={3} h={3} bg="green.500" rounded="sm"></Box>
          <Text fontSize="xs">PROYEKSI</Text>
        </HStack>
        <HStack>
          <Box w={3} h={3} bg="yellow.500" rounded="sm"></Box>
          <Text fontSize="xs">SURPLUS/DEFISIT</Text>
        </HStack>
      </HStack>
    </Box>
  );
}
