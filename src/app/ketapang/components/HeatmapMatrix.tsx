'use client';
import {
  Box, Flex, Text, Spinner, Alert, AlertIcon, Grid, GridItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaTh } from 'react-icons/fa';

interface HeatmapData {
  category: string;
  items: {
    name: string;
    gap_percentage: number;
    gap_change: string;
  }[];
}

export default function HeatmapMatrix() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
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

  const getColorIntensity = (percentage: number): string => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage === 0) return 'gray.100';
    if (absPercentage <= 5) return 'green.100';
    if (absPercentage <= 10) return 'green.200';
    if (absPercentage <= 15) return 'yellow.200';
    if (absPercentage <= 20) return 'yellow.300';
    if (absPercentage <= 25) return 'orange.300';
    if (absPercentage <= 30) return 'orange.400';
    return 'red.400';
  };

  const getTextColor = (percentage: number): string => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage === 0) return 'gray.600';
    if (absPercentage <= 5) return 'green.700';
    if (absPercentage <= 10) return 'green.800';
    if (absPercentage <= 15) return 'yellow.800';
    if (absPercentage <= 20) return 'yellow.900';
    if (absPercentage <= 25) return 'orange.900';
    if (absPercentage <= 30) return 'orange.900';
    return 'red.900';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Group data by category
      const categoryMap = new Map<string, any[]>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0 && item.yesterday > 0) {
          const category = getCategoryFromName(item.name);
          if (!categoryMap.has(category)) {
            categoryMap.set(category, []);
          }
          categoryMap.get(category)!.push({
            name: item.name,
            gap_percentage: item.gap_percentage || 0,
            gap_change: item.gap_change || 'no_change'
          });
        }
      });

      // Transform data untuk heatmap
      const transformedData: HeatmapData[] = Array.from(categoryMap.entries()).map(([category, items]) => ({
        category,
        items: items.slice(0, 6) // Ambil max 6 item per kategori
      }));

      setHeatmapData(transformedData);
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
          Matriks Perubahan Harga
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
          Matriks Perubahan Harga
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
        <FaTh color="#3182CE" style={{ marginRight: '8px' }} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Matriks Perubahan Harga
        </Text>
      </Flex>
      
      <Box maxH="400px" overflowY="auto">
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
          {heatmapData.map((categoryData, index) => (
            <GridItem key={index}>
              <Box border="1px solid" borderColor="gray.200" rounded="md" p={3}>
                <Text fontSize="md" fontWeight="bold" color="gray.800" mb={3}>
                  {categoryData.category}
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  {categoryData.items.map((item, itemIndex) => (
                    <GridItem key={itemIndex}>
                      <Box 
                        p={2} 
                        rounded="sm" 
                        bg={getColorIntensity(item.gap_percentage)}
                        color={getTextColor(item.gap_percentage)}
                        fontSize="xs"
                        textAlign="center"
                        fontWeight="medium"
                      >
                        <Text noOfLines={1} mb={1}>
                          {item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name}
                        </Text>
                        <Text fontSize="xs">
                          {item.gap_percentage > 0 ? '+' : ''}{item.gap_percentage.toFixed(1)}%
                        </Text>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
      
      {/* Legend */}
      <Box mt={4} p={3} bg="gray.50" rounded="md">
        <Text fontSize="sm" fontWeight="bold" mb={2}>Keterangan Intensitas:</Text>
        <Flex gap={2} flexWrap="wrap">
          <Flex align="center" gap={1}>
            <Box w={3} h={3} bg="gray.100" rounded="sm"></Box>
            <Text fontSize="xs">Stabil (0%)</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} bg="green.100" rounded="sm"></Box>
            <Text fontSize="xs">Rendah (≤5%)</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} bg="yellow.200" rounded="sm"></Box>
            <Text fontSize="xs">Sedang (6-15%)</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} bg="orange.300" rounded="sm"></Box>
            <Text fontSize="xs">Tinggi (16-25%)</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} bg="red.400" rounded="sm"></Box>
            <Text fontSize="xs">Sangat Tinggi (&gt;25%)</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
