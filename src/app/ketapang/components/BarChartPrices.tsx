'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar } from 'react-icons/fa';

interface ChartData {
  name: string;
  today: number;
  category: string;
}

export default function BarChartPrices() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('beras') || lowerName.includes('jagung') || lowerName.includes('kedelai')) {
      return 'Bahan Pokok';
    } else if (lowerName.includes('bawang') || lowerName.includes('cabai')) {
      return 'Sayuran';
    } else if (lowerName.includes('daging') || lowerName.includes('ayam') || lowerName.includes('telur')) {
      return 'Protein Hewani';
    } else if (lowerName.includes('ikan')) {
      return 'Ikan';
    } else if (lowerName.includes('minyak') || lowerName.includes('gula') || lowerName.includes('garam')) {
      return 'Bumbu Dapur';
    } else if (lowerName.includes('tepung')) {
      return 'Tepung';
    } else {
      return 'Lainnya';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching data for BarChartPrices...');
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format');
      }
      
      // Transform data untuk chart
      const transformedData: ChartData[] = data.data
        .filter((item: any) => item.today > 0)
        .map((item: any) => ({
          name: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
          today: item.today,
          category: getCategoryFromName(item.name)
        }))
        .sort((a: ChartData, b: ChartData) => b.today - a.today)
        .slice(0, 12); // Ambil top 12

      console.log('Transformed data:', transformedData);
      setChartData(transformedData);
    } catch (err) {
      console.error('Error in BarChartPrices:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          Perbandingan Harga Komoditas
        </Text>
        <Flex justify="center" align="center" py={8}>
          <Spinner size="lg" color="blue.500" />
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          Perbandingan Harga Komoditas
        </Text>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <Flex align="center" mb={4}>
        <FaChartBar color="#3182CE" style={{ marginRight: '8px' }} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Perbandingan Harga Komoditas
        </Text>
      </Flex>
      
      <Box h="400px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
            />
            <YAxis 
              tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any) => [`Rp ${value.toLocaleString()}`, 'Harga Hari Ini']}
              labelFormatter={(label) => `Komoditas: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="today" 
              fill="#8884d8"
              name="Harga Hari Ini"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
