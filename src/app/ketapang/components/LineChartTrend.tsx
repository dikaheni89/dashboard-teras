'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine } from 'react-icons/fa';

interface ChartData {
  name: string;
  today: number;
  yesterday: number;
}

export default function LineChartTrend() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Transform data untuk chart
      const transformedData: ChartData[] = data.data
        ?.filter((item: any) => item.today > 0 && item.yesterday > 0)
        ?.map((item: any) => ({
          name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
          today: item.today,
          yesterday: item.yesterday
        }))
        ?.slice(0, 10) || []; // Ambil top 10 saja

      setChartData(transformedData);
    } catch (err) {
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
          Trend Harga Komoditas
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
          Trend Harga Komoditas
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
        <FaChartLine color="#3182CE" style={{ marginRight: '8px' }} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Trend Harga Komoditas
        </Text>
      </Flex>
      
      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any) => [`Rp ${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Komoditas: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="yesterday" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Kemarin"
            />
            <Line 
              type="monotone" 
              dataKey="today" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Hari Ini"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
