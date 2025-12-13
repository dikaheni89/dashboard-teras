"use client";

import { Box, Flex, Image} from "@chakra-ui/react";

export default function HeaderTeras() {
  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
      <Box py={1}>
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={2}>
          {/* Logo & Gubernur */}
          <Box position="relative" flexShrink={0}>
            <Image
              src="/static/top-teras.png"
              alt="Header Banten"
              width={{ base: "120px", md: "100%" }}
              height={{ base: "120px", md: "150px" }}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Garis biru bawah */}
      <Box height="6px" bg="blue.600" borderBottomRadius="lg" />
    </Box>
  );
}
