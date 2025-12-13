'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { FaChartBar } from 'react-icons/fa';

interface ChartData {
  x: number;
  y: number;
  z: number;
  name: string;
}

export default function ScatterPlotCorrelation() {
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
      
      // Transform data untuk scatter plot
      const transformedData: ChartData[] = data.data
        ?.filter((item: any) => item.today > 0 && item.yesterday > 0 && item.gap_percentage !== null)
        ?.map((item: any) => ({
          x: item.today, // Harga hari ini
          y: Math.abs(item.gap_percentage || 0), // Persentase perubahan (absolute)
          z: Math.abs(item.gap || 0), // Gap harga (absolute)
          name: item.name
        }))
        ?.slice(0, 20) || []; // Ambil 20 data saja untuk visualisasi yang lebih baik

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
          Korelasi Harga vs Perubahan
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
          Korelasi Harga vs Perubahan
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
          Korelasi Harga vs Perubahan
        </Text>
      </Flex>
      
      <Box h="350px">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Harga Hari Ini"
              tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
              fontSize={12}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Persentase Perubahan"
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              fontSize={12}
            />
            <ZAxis type="number" dataKey="z" range={[60, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: any) => [
                name === 'x' ? `Rp ${value.toLocaleString()}` : 
                name === 'y' ? `${value.toFixed(1)}%` : 
                `Rp ${value.toLocaleString()}`,
                name === 'x' ? 'Harga Hari Ini' : 
                name === 'y' ? 'Persentase Perubahan' : 'Gap Harga'
              ]}
              labelFormatter={(label) => `Komoditas: ${label}`}
            />
            <Scatter name="Komoditas" data={chartData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
