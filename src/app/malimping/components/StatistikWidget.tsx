'use client';

import { Box, Flex, Heading } from '@chakra-ui/react';
import JadwalpoliWidget from "@/app/malimping/components/JadwalpoliWidget";
import StatistikkamarWidget from "@/app/malimping/components/StatistikkamarWidget";

export default function StatistikWidget() {
  return (
    <Box p={4}>
      <Flex gap={4} align="stretch" wrap="wrap">
        <Box
          flex="1"
          minW="350px"
          p={4}
          borderRadius="lg"
          bg="white"
          maxH="500px"
          overflowY="auto"
        >
          <Heading size="md" mb={2} color="primary.800">
            Jumah Ketersedian Kamar Berdasarkan Jenis Ruangan
          </Heading>
          <StatistikkamarWidget />
        </Box>

        <Box
          flex="1"
          minW="350px"
          p={4}
          borderRadius="lg"
          bg="primary.50"
          shadow="md"
          maxH="500px"
          overflowY="auto"
        >
          <Heading size="md" mb={2} color="primary.800">
            Jadwal Dokter Poli Hari Ini
          </Heading>
          <JadwalpoliWidget />
        </Box>
      </Flex>
    </Box>
  );
}
