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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export default function PieChartCategory() {
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
      
      const categoryMap = new Map<string, number>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0) {
          const lowerName = item.name.toLowerCase();
          let category = 'Lainnya';
          if (lowerName.includes('beras') || lowerName.includes('jagung') || lowerName.includes('kedelai')) {
            category = 'Bahan Pokok';
          } else if (lowerName.includes('bawang') || lowerName.includes('cabai')) {
            category = 'Sayuran';
          } else if (lowerName.includes('daging') || lowerName.includes('ayam') || lowerName.includes('telur')) {
            category = 'Protein Hewani';
          } else if (lowerName.includes('ikan')) {
            category = 'Ikan';
          } else if (lowerName.includes('minyak') || lowerName.includes('gula') || lowerName.includes('garam')) {
            category = 'Bumbu Dapur';
          } else if (lowerName.includes('tepung')) {
            category = 'Tepung';
          }
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
      });

      const transformedData: ChartData[] = Array.from(categoryMap.entries()).map(([category, count], index) => ({
        name: category,
        value: count,
        color: COLORS[index % COLORS.length]
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
          Distribusi Kategori Komoditas
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
          Distribusi Kategori Komoditas
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
          Distribusi Kategori Komoditas
        </Text>
      </Flex>
      
      <Box h="350px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
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
