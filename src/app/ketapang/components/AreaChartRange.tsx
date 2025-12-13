'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartLine } from 'react-icons/fa';

interface ChartData {
  range: string;
  count: number;
  sample: string[];
}

export default function AreaChartRange() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPriceRange = (price: number): string => {
    if (price < 10000) return '< Rp 10k';
    if (price < 20000) return 'Rp 10k - 20k';
    if (price < 50000) return 'Rp 20k - 50k';
    if (price < 100000) return 'Rp 50k - 100k';
    if (price < 200000) return 'Rp 100k - 200k';
    return '> Rp 200k';
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Group data by price range
      const rangeMap = new Map<string, { count: number; samples: string[] }>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0) {
          const range = getPriceRange(item.today);
          if (!rangeMap.has(range)) {
            rangeMap.set(range, { count: 0, samples: [] });
          }
          const rangeData = rangeMap.get(range)!;
          rangeData.count++;
          if (rangeData.samples.length < 3) {
            rangeData.samples.push(item.name);
          }
        }
      });

      // Transform data untuk chart
      const transformedData: ChartData[] = Array.from(rangeMap.entries()).map(([range, data]) => ({
        range,
        count: data.count,
        sample: data.samples
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
          Distribusi Range Harga
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
          Distribusi Range Harga
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
          Distribusi Range Harga
        </Text>
      </Flex>
      
      <Box h="350px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
            />
            <YAxis 
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any) => [`${value} komoditas`, 'Jumlah']}
              labelFormatter={(label) => `Range: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
