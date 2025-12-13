'use client';

import { Box, Flex, Heading } from '@chakra-ui/react';
import StatistikIzinLingkungan from "@/app/lingkungan/components/StatistikIzinLingkungan";
import StatistikTotalIzinPerKabupaten from "@/app/lingkungan/components/StatistikTotalIzinPerKabupaten";
import StatistikJumlahDokumenIzin from "@/app/lingkungan/components/StatistikJumlahDokumenIzin";

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
        >
          <Heading size="md" mb={2} color="primary.800">
            Izin Lingkungan Berdasarkan Bidang Usaha
          </Heading>
          <StatistikIzinLingkungan />
        </Box>

        <Box
          flex="1"
          minW="350px"
          p={4}
          borderRadius="lg"
          bg="white"
          maxH="500px"
        >
          <Heading size="md" mb={2} color="primary.800">
            Total Izin Perkabupaten Kota
          </Heading>
          <StatistikTotalIzinPerKabupaten />
        </Box>
      </Flex>
      <Flex gap={4} align="stretch" wrap="wrap">
        <Box
          w={'100%'}
          p={4}
          borderRadius="lg"
          bg="white"
        >
          <Heading size="md" mb={2} color="primary.800">
            Izin Perkabupaten Kota
          </Heading>
          <StatistikJumlahDokumenIzin />
        </Box>
      </Flex>
    </Box>
  );
}
