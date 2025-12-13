'use client';
import {
  Box, Text, HStack, Button, ButtonGroup,
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
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceDevelopment() {
  const [selectedCommodity, setSelectedCommodity] = useState('Beras');
  
  const commodities = [
    'Beras', 'Jagung', 'Kedelai', 'Bawang Merah', 'Bawang Putih', 
    'Cabai Besar', 'Cabai Rawit', 'Daging Sapi', 'Daging Ayam Ras', 'Telur Ayam Ras'
  ];

  const priceData = {
    'Beras': {
      'Hari Ini': 14881,
      'Kemarin': 14860,
      'Dua Hari Lalu': 14833
    },
    'Jagung': {
      'Hari Ini': 8500,
      'Kemarin': 8450,
      'Dua Hari Lalu': 8400
    },
    'Kedelai': {
      'Hari Ini': 12500,
      'Kemarin': 12450,
      'Dua Hari Lalu': 12400
    }
  };

  const currentData = priceData[selectedCommodity as keyof typeof priceData] || priceData['Beras'];

  const data = {
    labels: ['Hari Ini', 'Kemarin', 'Dua Hari Lalu'],
    datasets: [
      {
        label: selectedCommodity,
        data: [currentData['Hari Ini'], currentData['Kemarin'], currentData['Dua Hari Lalu']],
        backgroundColor: ['#63B3ED', '#3182CE', '#2C5282'],
        borderColor: ['#4299E1', '#2B6CB0', '#2A4365'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: Rp ${context.parsed.y.toLocaleString()}/Kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 5000,
        max: 15000,
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
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Perkembangan Harga Pangan
      </Text>
      
      {/* Commodity Tabs */}
      <Box mb={4} overflowX="auto">
        <ButtonGroup size="sm" spacing={2} flexWrap="wrap">
          {commodities.map((commodity) => (
            <Button
              key={commodity}
              variant={selectedCommodity === commodity ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setSelectedCommodity(commodity)}
              fontSize="xs"
              px={3}
              py={1}
            >
              {commodity}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Legend */}
      <HStack justify="center" mb={4} spacing={6}>
        <HStack>
          <Box w={3} h={3} bg="blue.300" rounded="sm"></Box>
          <Text fontSize="xs">Hari Ini</Text>
        </HStack>
        <HStack>
          <Box w={3} h={3} bg="blue.500" rounded="sm"></Box>
          <Text fontSize="xs">Kemarin</Text>
        </HStack>
        <HStack>
          <Box w={3} h={3} bg="blue.700" rounded="sm"></Box>
          <Text fontSize="xs">Dua Hari Lalu</Text>
        </HStack>
      </HStack>

      {/* Chart */}
      <Box h="250px">
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
}
