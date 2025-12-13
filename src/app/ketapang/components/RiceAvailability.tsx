'use client';
import {
  Box, Text, VStack, HStack, Progress,
} from '@chakra-ui/react';

export default function RiceAvailability() {
  const riceData = [
    {
      label: "PROYEKSI",
      value: 400000,
      maxValue: 500000,
      color: "blue.300"
    },
    {
      label: "KEBUTUHAN NERACA",
      value: 100000,
      maxValue: 500000,
      color: "blue.400"
    },
    {
      label: "SURPLUS/DEFISIT",
      value: 300000,
      maxValue: 500000,
      color: "blue.500"
    }
  ];

  return (
    <Box bg="white" p={6} rounded="lg" boxShadow="md" border="1px solid" borderColor="gray.200">
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Ketersediaan Beras
      </Text>
      <VStack spacing={4} align="stretch">
        {riceData.map((item, index) => (
          <Box key={index}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {item.label}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {item.value.toLocaleString()}
              </Text>
            </HStack>
            <Progress 
              value={(item.value / item.maxValue) * 100} 
              colorScheme="blue" 
              size="lg"
              borderRadius="md"
              bg="gray.100"
            />
          </Box>
        ))}
        <Box mt={4} p={3} bg="gray.50" rounded="md">
          <Text fontSize="xs" color="gray.600" textAlign="center">
            X-axis: 0 - 500,000 units
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
