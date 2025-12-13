'use client';
import {
  Box, Flex, Text, Icon, Badge, Spinner, Alert, AlertIcon, Button, Select, HStack, VStack,
} from '@chakra-ui/react';
import { FaStar, FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

interface GKPData {
  title: string;
  price: string;
  change: string;
  percentage: string;
  isUp: boolean;
  isStable: boolean;
  hasPrice: boolean;
  showStatus: boolean;
}

interface RequestData {
  nasional: string;
  today: string;
  yesterday: string;
  level_harga_desc: string;
}

export default function GKPPriceCards() {
  const [gkpData, setGkpData] = useState<GKPData[]>([]);
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Filter states
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  
  // Filter options
  const levelOptions = [
    { value: '1', label: 'Produsen' },
    { value: '3', label: 'Konsumen' }
  ];
  
  const cityOptions = [
    { value: '', label: 'Semua Kab/Kota' },
    { value: '265', label: 'Kab. Lebak' },
    { value: '264', label: 'Kab. Pandeglang' },
    { value: '267', label: 'Kab. Serang' },
    { value: '266', label: 'Kab. Tangerang' },
    { value: '269', label: 'Kota Cilegon' },
    { value: '270', label: 'Kota Serang' },
    { value: '268', label: 'Kota Tangerang' },
    { value: '271', label: 'Kota Tangerang Selatan' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          province_id: '16',
          level_harga_id: selectedLevel
        });
        
        if (selectedCity) {
          params.append('city_id', selectedCity);
        }
        
        const response = await fetch(`/api/ketapang/badan-pangan?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Transform the API data to match our component structure
        const transformedData: GKPData[] = data.data
          ?.map((item: any) => {
            const hasPrice = item.today > 0 && item.yesterday > 0;
            const isStable = hasPrice && (item.gap === 0 || item.gap_change === 'no_change');
            const showStatus = hasPrice && item.gap !== 0;
            

            
            return {
              title: item.name || 'Unknown',
              price: hasPrice ? `Rp. ${item.today.toLocaleString()}` : 'Harga Belum Tersedia',
              change: hasPrice ? (item.gap ? (item.gap > 0 ? `+Rp ${item.gap.toLocaleString()}` : `-Rp ${Math.abs(item.gap).toLocaleString()}`) : 'Rp 0') : '',
              percentage: hasPrice ? (item.gap_percentage ? `${item.gap_percentage}%` : '0%') : '',
              isUp: item.gap_change === 'up',
              isStable: isStable,
              hasPrice: hasPrice,
              showStatus: showStatus
            };
          }) || [];
        
        // Set request data
        if (data.request_data && data.request_data.length > 0) {
          setRequestData(data.request_data[0]);
        }
        
        setGkpData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching GKP data:', err);
        setError('Failed to load data');
        // Fallback to static data if API fails
        setGkpData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLevel, selectedCity]);

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Check initial position
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [gkpData]);

  if (loading) {
    return (
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          INFOGRAFIS HARGA PANGAN
        </Text>
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="lg" color="blue.500" />
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          INFOGRAFIS HARGA PANGAN
        </Text>
        <Alert status="warning">
          <AlertIcon />
          {error} - Menampilkan data statis sebagai fallback
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box mb={4}>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            INFOGRAFIS HARGA PANGAN
          </Text>
          <HStack spacing={3} align="center">
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<Icon as={FaFilter} />}
              onClick={() => setShowFilter(!showFilter)}
              _hover={{ bg: "blue.50" }}
            >
              Filter
            </Button>
            <Badge colorScheme="blue" variant="subtle">
              {gkpData.length} Komoditas
            </Badge>
          </HStack>
        </Flex>
        
        {/* Filter Section - Collapsible */}
        {showFilter && (
          <Box 
            bg="white" 
            p={4} 
            rounded="lg" 
            boxShadow="sm" 
            border="1px solid" 
            borderColor="gray.200"
            mb={3}
            transition="all 0.2s ease-out"
            transform="translateY(0)"
            opacity={1}
          >
            <HStack spacing={4} flexWrap="wrap">
              <VStack align="start" spacing={1} minW="200px">
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  Jenis Data Panel
                </Text>
                <Select
                  size="sm"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </VStack>
              
              <VStack align="start" spacing={1} minW="200px">
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  Kabupaten/Kota
                </Text>
                <Select
                  size="sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                >
                  {cityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </VStack>
            </HStack>
          </Box>
        )}
        
        {requestData && (
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>
              Harga Rata-Rata Komoditas {requestData.level_harga_desc} Hari ini {requestData.today} di wilayah {requestData.nasional}
            </Text>
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              * Harga dibandingkan dengan harga pada hari sebelumnya {requestData.yesterday}
            </Text>
          </Box>
        )}
      </Box>
      
      <Box position="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            position="absolute"
            left={2}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            size="sm"
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            boxShadow="lg"
            onClick={scrollLeft}
            minW="40px"
            h="40px"
          >
            <Icon as={FaChevronLeft} />
          </Button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            size="sm"
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            boxShadow="lg"
            onClick={scrollRight}
            minW="40px"
            h="40px"
          >
            <Icon as={FaChevronRight} />
          </Button>
        )}

        <Box 
          ref={scrollContainerRef}
          overflowX="auto" 
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }}
          px={canScrollLeft ? 12 : 4}
          pr={canScrollRight ? 12 : 4}
        >
          <Flex gap={4} minW="max-content" pb={2}>
            {gkpData.map((item, index) => (
              <Box 
                key={index} 
                bg="white" 
                p={4} 
                rounded="lg" 
                boxShadow="md" 
                border="1px solid" 
                borderColor="gray.200"
                minW="280px"
                flexShrink={0}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  transition: 'all 0.2s'
                }}
              >
                <Flex align="center" justify="space-between" mb={2}>
                  <Icon as={FaStar} color="yellow.400" boxSize={4} />
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
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1} noOfLines={2}>
                  {item.title}
                </Text>
                <Text fontSize="lg" fontWeight="bold" color={item.hasPrice ? "gray.800" : "gray.500"} mb={1}>
                  {item.price}
                </Text>
                {item.showStatus ? (
                  <Text fontSize="xs" color={item.isUp ? "green.500" : "red.500"}>
                    Harga {item.isUp ? "Naik" : "Turun"} {item.change}
                    <Icon 
                      as={item.isUp ? FaArrowUp : FaArrowDown} 
                      ml={1} 
                      boxSize={3}
                    />
                  </Text>
                ) : item.hasPrice ? (
                  <Text fontSize="xs" color="gray.500">
                    Harga Belum Tersedia
                  </Text>
                ) : (
                  <Text fontSize="xs" color="gray.500">
                    Harga Belum Tersedia
                  </Text>
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
