'use client';
import {Box, HStack, Text} from "@chakra-ui/react";
import {HiOutlineExclamationTriangle} from "react-icons/hi2";

export default function ListPeringatanWidget() {
  return (
    <>
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Peringatan Dini
        </Text>

        {/* Peringatan Cuaca Ekstrem */}
        <Box
          bg="red.50"
          borderLeft="6px solid"
          borderColor="red.400"
          borderRadius="lg"
          p={4}
          mb={4}
        >
          <HStack align="start" spacing={3}>
            <Box pt={1}>
              <HiOutlineExclamationTriangle size={24} color="#F56565" />
            </Box>
            <Box>
              <Text fontWeight="bold" color="red.600" fontSize="md">
                Peringatan Cuaca Ekstrem
              </Text>
              <Text color="red.600" mb={2}>
                Potensi hujan lebat disertai angin kencang dan petir di wilayah Pandeglang dan Lebak.
              </Text>
              <Text fontSize="sm" color="red.600">
                Lokasi: Kabupaten Pandeglang, Kabupaten Lebak &nbsp;&nbsp; Berlaku hingga: 5 Mei
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* Peringatan Banjir */}
        <Box
          bg="yellow.50"
          borderLeft="6px solid"
          borderColor="yellow.400"
          borderRadius="lg"
          p={4}
          mb={4}
        >
          <HStack align="start" spacing={3}>
            <Box pt={1}>
              <HiOutlineExclamationTriangle size={24} color="#D69E2E" />
            </Box>
            <Box>
              <Text fontWeight="bold" color="orange.700" fontSize="md">
                Peringatan Banjir
              </Text>
              <Text color="orange.700" mb={2}>
                Potensi banjir di beberapa titik di Kota Tangerang akibat curah hujan tinggi.
              </Text>
              <Text fontSize="sm" color="orange.700">
                Lokasi: Kota Tangerang &nbsp;&nbsp; Berlaku hingga: 5 Mei
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* Peringatan Gelombang Tinggi */}
        <Box
          bg="yellow.50"
          borderLeft="6px solid"
          borderColor="yellow.400"
          borderRadius="lg"
          p={4}
        >
          <HStack align="start" spacing={3}>
            <Box pt={1}>
              <HiOutlineExclamationTriangle size={24} color="#D69E2E" />
            </Box>
            <Box>
              <Text fontWeight="bold" color="orange.700" fontSize="md">
                Peringatan Gelombang Tinggi
              </Text>
              <Text color="orange.700" mb={2}>
                Gelombang laut mencapai 2–3 meter di perairan Selat Sunda.
              </Text>
              <Text fontSize="sm" color="orange.700">
                Lokasi: Perairan Selat Sunda, Kabupaten Pandeglang &nbsp;&nbsp; Berlaku hingga: 6 Mei
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>
    </>
  )
}
