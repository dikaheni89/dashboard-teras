'use client';

import { Box, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';

export default function CommingsoonWidget() {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      flexDirection="column"
    >
      <VStack spacing={4}>
        <Box position="relative" width={500} height={300}>
          <Image
            src="/static/banten.png"
            alt="Map Outline"
            width={500}
            height={500}
            objectFit="cover"
            priority
          />
        </Box>
        <Text fontWeight="bold" fontSize="xl" fontFamily="cursive">
          Collecting Data
        </Text>
        <Text
          fontWeight="extrabold"
          fontSize="4xl"
          color="blue.300"
          textAlign="center"
          lineHeight="1.1"
        >
          COMING<br />SOON
        </Text>
      </VStack>
    </Box>
  );
}

