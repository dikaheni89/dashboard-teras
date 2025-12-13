'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { FaChartPie } from 'react-icons/fa';

interface ChartData {
  subject: string;
  'Harga Hari Ini': number;
  'Harga Kemarin': number;
  'Persentase Perubahan': number;
  fullMark: number;
}

export default function RadarChartMulti() {
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
      
      // Transform data untuk radar chart
      const transformedData: ChartData[] = data.data
        .filter((item: any) => item.today > 0 && item.yesterday > 0)
        .map((item: any) => {
          // Normalize values untuk radar chart (0-100 scale)
          const maxPrice = Math.max(item.today, item.yesterday);
          const normalizedToday = (item.today / maxPrice) * 100;
          const normalizedYesterday = (item.yesterday / maxPrice) * 100;
          const normalizedPercentage = Math.min(Math.abs(item.gap_percentage || 0), 100);
          
          return {
            subject: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
            'Harga Hari Ini': Math.round(normalizedToday),
            'Harga Kemarin': Math.round(normalizedYesterday),
            'Persentase Perubahan': Math.round(normalizedPercentage),
            fullMark: 100
          };
        })
        .slice(0, 8); // Ambil 8 komoditas saja

      console.log('RadarChart data:', transformedData);
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
          Perbandingan Multi-Kriteria
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
          Perbandingan Multi-Kriteria
        </Text>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200" h="100%">
      <Flex align="center" mb={4}>
        <FaChartPie color="#3182CE" style={{ marginRight: '8px' }} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Perbandingan Multi-Kriteria
        </Text>
      </Flex>
      
      {chartData.length > 0 ? (
        <Box h="400px">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Harga Hari Ini" 
                dataKey="Harga Hari Ini" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Harga Kemarin" 
                dataKey="Harga Kemarin" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Persentase Perubahan" 
                dataKey="Persentase Perubahan" 
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.6} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box h="400px" display="flex" alignItems="center" justifyContent="center">
          <Text color="gray.500">Tidak ada data untuk ditampilkan</Text>
        </Box>
      )}
    </Box>
  );
}
