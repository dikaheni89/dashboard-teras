'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FaChartPie } from 'react-icons/fa';

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

const STATUS_COLORS = {
  'up': '#FF6B6B',
  'down': '#4ECDC4', 
  'no_change': '#45B7D1'
};

export default function DonutChartStatus() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Group data by gap_change status
      const statusMap = new Map<string, number>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0 && item.yesterday > 0) {
          const status = item.gap_change || 'no_change';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
        }
      });

      // Transform data untuk chart
      const transformedData: ChartData[] = Array.from(statusMap.entries()).map(([status, count]) => ({
        name: status === 'up' ? 'Harga Naik' : status === 'down' ? 'Harga Turun' : 'Harga Stabil',
        value: count,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#45B7D1'
      }));

      setChartData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          Status Perubahan Harga
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
          Status Perubahan Harga
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
        <FaChartPie color="#3182CE" style={{ marginRight: '8px' }} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Status Perubahan Harga
        </Text>
      </Flex>
      
      <Box h="350px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} komoditas`, 'Jumlah']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
