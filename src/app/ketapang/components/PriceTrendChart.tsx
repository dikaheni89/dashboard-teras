'use client';
import {
  Box, Flex, Text, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Icon,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FaArrowUp, FaArrowDown, FaChartBar } from 'react-icons/fa';
import Image from 'next/image';

interface TrendData {
  name: string;
  gap_percentage: number;
  gap_change: string;
  today: number;
  yesterday: number;
  background: string | null;
}

export default function PriceTrendChart() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
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
      
      // Filter data yang memiliki gap_percentage dan sort berdasarkan absolute value
      const filteredData: TrendData[] = data.data
        ?.filter((item: any) => item.gap_percentage !== null && item.gap_percentage !== 0)
        ?.map((item: any) => ({
          name: item.name,
          gap_percentage: item.gap_percentage,
          gap_change: item.gap_change,
          today: item.today,
          yesterday: item.yesterday,
          background: item.background
        }))
        ?.sort((a: TrendData, b: TrendData) => Math.abs(b.gap_percentage) - Math.abs(a.gap_percentage))
        ?.slice(0, 8) || [];

      setTrendData(filteredData);
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
          Trend Perubahan Harga
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
          Trend Perubahan Harga
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
        <Icon as={FaChartBar} color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Trend Perubahan Harga
        </Text>
      </Flex>
      
                        <Box 
                    h="400px" 
                    overflowY="auto" 
                    css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}
      >
        <VStack spacing={4} align="stretch" pb={4}>
          {trendData.map((item, index) => {
            const isUp = item.gap_change === 'up';
            
            return (
              <Box 
                key={index} 
                p={4} 
                border="1px solid" 
                borderColor={isUp ? "red.200" : "green.200"} 
                borderRadius="lg"
                bg={isUp ? "red.50" : "green.50"}
                _hover={{ 
                  transform: "translateY(-2px)", 
                  boxShadow: "lg",
                  borderColor: isUp ? "red.300" : "green.300"
                }}
                transition="all 0.2s ease"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack spacing={3}>
                    {item.background ? (
                      <Box
                        w="40px"
                        h="40px"
                        borderRadius="lg"
                        overflow="hidden"
                        position="relative"
                        bg="white"
                        boxShadow="sm"
                      >
                        <Image
                          src={item.background}
                          alt={item.name}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    ) : (
                      <Box w="40px" h="40px" bg="white" borderRadius="lg" boxShadow="sm" />
                    )}
                    <VStack align="start" spacing={0}>
                      <Text fontSize="md" fontWeight="bold" color="gray.800" noOfLines={1}>
                        {item.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {isUp ? "Harga Naik" : "Harga Turun"}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={0}>
                    <Badge 
                      colorScheme={isUp ? "red" : "green"} 
                      fontSize="sm"
                      variant="solid"
                      px={3}
                      py={1}
                    >
                      {isUp ? <Icon as={FaArrowUp} mr={1} /> : <Icon as={FaArrowDown} mr={1} />}
                      {Math.abs(item.gap_percentage).toFixed(1)}%
                    </Badge>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {isUp ? "Kenaikan" : "Penurunan"}
                    </Text>
                  </VStack>
                </Flex>
                
                <Flex justify="space-between" align="center" mt={3} p={3} bg="white" borderRadius="md">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Kemarin</Text>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Rp {item.yesterday.toLocaleString()}
                    </Text>
                  </VStack>
                  <Icon as={isUp ? FaArrowUp : FaArrowDown} color={isUp ? "red.500" : "green.500"} boxSize={4} />
                  <VStack align="end" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Hari Ini</Text>
                    <Text fontSize="sm" fontWeight="bold" color={isUp ? "red.600" : "green.600"}>
                      Rp {item.today.toLocaleString()}
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
}
