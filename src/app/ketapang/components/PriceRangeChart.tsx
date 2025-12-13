'use client';
import {
  Box, Flex, Text, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Icon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaChartLine, FaSortAmountUp } from 'react-icons/fa';

interface RangeData {
  range: string;
  count: number;
  items: string[];
  color: string;
}

export default function PriceRangeChart() {
  const [rangeData, setRangeData] = useState<RangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPriceRange = (price: number): string => {
    if (price < 10000) return '< Rp 10.000';
    if (price < 20000) return 'Rp 10.000 - 20.000';
    if (price < 50000) return 'Rp 20.000 - 50.000';
    if (price < 100000) return 'Rp 50.000 - 100.000';
    return '> Rp 100.000';
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
      
      // Group data by price range
      const rangeMap = new Map<string, { count: number, items: string[] }>();
      
      data.data?.forEach((item: any) => {
        if (item.today > 0) {
          const range = getPriceRange(item.today);
          if (!rangeMap.has(range)) {
            rangeMap.set(range, { count: 0, items: [] });
          }
          rangeMap.get(range)!.count += 1;
          rangeMap.get(range)!.items.push(item.name);
        }
      });

      // Create chart data with colors
      const colors = ['#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#3182CE'];
      const chartData: RangeData[] = Array.from(rangeMap.entries()).map(([range, data], index) => ({
        range,
        count: data.count,
        items: data.items,
        color: colors[index % colors.length]
      }));

      // Sort by price range (custom order)
      const rangeOrder = ['< Rp 10.000', 'Rp 10.000 - 20.000', 'Rp 20.000 - 50.000', 'Rp 50.000 - 100.000', '> Rp 100.000'];
      chartData.sort((a, b) => rangeOrder.indexOf(a.range) - rangeOrder.indexOf(b.range));
      
      setRangeData(chartData);
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
          Distribusi Harga
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
          Distribusi Harga
        </Text>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  const totalItems = rangeData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <Flex align="center" mb={4}>
        <Icon as={FaChartLine} color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Distribusi Harga
        </Text>
      </Flex>
      
      <VStack spacing={4} align="stretch">
        {rangeData.map((item, index) => {
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
                    <Icon as={FaSortAmountUp} color="white" boxSize={4} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      {item.range}
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
              
              {/* Sample items */}
              {item.items.length > 0 && (
                <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                  <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={2}>
                    Contoh Komoditas:
                  </Text>
                  <Flex flexWrap="wrap" gap={1}>
                    {item.items.slice(0, 4).map((commodity, idx) => (
                      <Badge 
                        key={idx} 
                        colorScheme="gray" 
                        variant="subtle" 
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        {commodity}
                      </Badge>
                    ))}
                    {item.items.length > 4 && (
                      <Badge 
                        colorScheme="blue" 
                        variant="subtle" 
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        +{item.items.length - 4} lainnya
                      </Badge>
                    )}
                  </Flex>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>
      
      <Box mt={4} p={3} bg="blue.50" borderRadius="md">
        <Text fontSize="xs" color="blue.700" textAlign="center">
          Total {totalItems} komoditas dengan harga valid
        </Text>
      </Box>
    </Box>
  );
}