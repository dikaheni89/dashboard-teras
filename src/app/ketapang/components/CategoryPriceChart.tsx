'use client';
import {
  Box, Flex, Text, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Icon,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FaChartPie, FaCircle } from 'react-icons/fa';

interface CategoryData {
  category: string;
  count: number;
  averagePrice: number;
  totalPrice: number;
  color: string;
}

export default function CategoryPriceChart() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Group data by category
      const categoryMap = new Map<string, { prices: number[], count: number }>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0) {
          const category = getCategoryFromName(item.name);
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { prices: [], count: 0 });
          }
          categoryMap.get(category)!.prices.push(item.today);
          categoryMap.get(category)!.count += 1;
        }
      });

      // Calculate average prices and create chart data
      const colors = ['#3182CE', '#38A169', '#E53E3E', '#D69E2E', '#805AD5', '#DD6B20', '#319795'];
      const chartData: CategoryData[] = Array.from(categoryMap.entries()).map(([category, data], index) => ({
        category,
        count: data.count,
        averagePrice: Math.round(data.prices.reduce((a, b) => a + b, 0) / data.prices.length),
        totalPrice: data.prices.reduce((a, b) => a + b, 0),
        color: colors[index % colors.length]
      }));

      // Sort by average price descending
      chartData.sort((a, b) => b.averagePrice - a.averagePrice);
      
      setCategoryData(chartData);
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
          Kategori Komoditas
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
          Kategori Komoditas
        </Text>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  const totalItems = categoryData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <Flex align="center" mb={4}>
        <Icon as={FaChartPie} color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Kategori Komoditas
        </Text>
      </Flex>
      
      <VStack spacing={4} align="stretch">
        {categoryData.map((item, index) => {
          const percentage = ((item.count / totalItems) * 100).toFixed(1);
          
          return (
            <Box 
              key={index} 
              p={4} 
              border="1px solid" 
              borderColor={`${item.color}20`} 
              borderRadius="lg"
              bg={`${item.color}08`}
              _hover={{ 
                transform: "translateY(-2px)", 
                boxShadow: "lg",
                borderColor: `${item.color}40`
              }}
              transition="all 0.2s ease"
            >
              <Flex justify="space-between" align="center" mb={3}>
                <HStack spacing={3}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="lg"
                    bg={item.color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="sm"
                  >
                    <Icon as={FaCircle} color="white" boxSize={4} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      {item.category}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.count} komoditas
                    </Text>
                  </VStack>
                </HStack>
                <VStack align="end" spacing={0}>
                  <Badge colorScheme="blue" fontSize="sm" variant="solid" px={3} py={1}>
                    {percentage}%
                  </Badge>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    dari total
                  </Text>
                </VStack>
              </Flex>
              
              <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Rata-rata Harga</Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Rp {item.averagePrice.toLocaleString()}
                    </Text>
                  </VStack>
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={item.color}
                  />
                </Flex>
              </Box>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
