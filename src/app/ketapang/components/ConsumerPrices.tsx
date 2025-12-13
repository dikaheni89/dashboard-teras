'use client';
import {
  Box, Flex, Text, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Icon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa';

interface ConsumerData {
  title: string;
  price: string;
  change: string;
  percentage: string;
  isUp: boolean;
  isStable: boolean;
  hasPrice: boolean;
  showStatus: boolean;
  background: string | null;
}

export default function ConsumerPrices() {
  const [consumerData, setConsumerData] = useState<ConsumerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ketapang/badan-pangan?province_id=16&level_harga_id=3');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      console.log('ConsumerPrices API response:', data);
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data structure from API');
      }
      
      const transformedData: ConsumerData[] = data.data
        .map((item: any) => {
                  const hasPrice = item.today > 0 && item.yesterday > 0;
        const isStable = hasPrice && (item.gap === 0 || item.gap_change === 'no_change');
        const showStatus = hasPrice && item.gap !== 0 && item.gap_change !== 'no_change';
          
          return {
            title: item.name || 'Unknown',
            price: hasPrice ? `Rp. ${item.today.toLocaleString()}` : 'Harga Belum Tersedia',
            change: hasPrice ? (item.gap ? (item.gap > 0 ? `+Rp ${item.gap.toLocaleString()}` : `-Rp ${Math.abs(item.gap).toLocaleString()}`) : 'Rp 0') : '',
            percentage: hasPrice ? (item.gap_percentage ? `${item.gap_percentage}%` : '0%') : '',
            isUp: item.gap_change === 'up',
            isStable: isStable,
            hasPrice: hasPrice,
            showStatus: showStatus,
            background: item.background || null
          };
        }) || [];

      setConsumerData(transformedData);
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
          Harga Rata-Rata Komoditas Konsumen
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
          Harga Rata-Rata Komoditas Konsumen
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
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Harga Rata-Rata Komoditas Konsumen
      </Text>
      
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
          {consumerData.map((item, index) => (
            <Box key={index} p={4} border="1px solid" borderColor="gray.200" rounded="md">
              <Flex justify="space-between" align="center" mb={2}>
                <HStack spacing={3}>
                  {item.background ? (
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="md"
                      overflow="hidden"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img 
                        src={item.background} 
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(index));
                        }}
                      />
                      {imageErrors.has(index) && (
                        <Icon as={FaStar} color="yellow.400" boxSize={6} />
                      )}
                    </Box>
                  ) : (
                    <Icon as={FaStar} color="yellow.400" boxSize={6} />
                  )}
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {item.title}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={item.hasPrice ? "gray.800" : "gray.500"}>
                      {item.price}
                    </Text>
                  </VStack>
                </HStack>
                {item.showStatus && (
                  <Badge 
                    colorScheme={item.isUp ? "green" : "red"} 
                    fontSize="xs"
                    variant="subtle"
                  >
                    {item.isUp ? <Icon as={FaArrowUp} mr={1} /> : <Icon as={FaArrowDown} mr={1} />}
                    {item.percentage}
                  </Badge>
                )}
              </Flex>
              <Box bg={item.showStatus ? (item.isUp ? "green.100" : "red.100") : (item.isStable ? "blue.100" : "gray.100")} p={2} rounded="md">
                <Text fontSize="xs" color={item.showStatus ? (item.isUp ? "green.700" : "red.700") : (item.isStable ? "blue.700" : "gray.500")} fontWeight="medium">
                  {item.showStatus ? (
                    <>
                      Harga {item.isUp ? "Naik" : "Turun"} {item.change}
                      <Icon 
                        as={item.isUp ? FaArrowUp : FaArrowDown} 
                        ml={1} 
                        boxSize={3}
                      />
                    </>
                  ) : item.isStable ? (
                    "Harga Stabil"
                  ) : (
                    "Harga Belum Tersedia"
                  )}
                </Text>
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
