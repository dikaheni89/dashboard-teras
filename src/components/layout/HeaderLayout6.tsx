"use client";

import { Box, Flex, Text, Image, VStack, Icon, SimpleGrid, Badge } from "@chakra-ui/react";
import { FC } from "react";
import Link from "next/link";

export type HeaderStatsItem = {
  title: string;
  value?: string;
  sub: string;
  colortitle?: string;
  badge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  icon?: FC<any>;
  description?: string;
};

type HeaderLayoutProps = {
  stats: HeaderStatsItem[];
  image: string;
};

export default function HeaderLayout({ stats, image }: HeaderLayoutProps) {
  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
      <Box py={1}>
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={4} px={4}>

          {/* Gambar Header */}
          <Box position="relative" flexShrink={0}>
            <Link href={"/"}>
              <Image
                src={image || "/static/top-teras.png"}
                alt="Header Banten"
                width={{ base: "120px", md: "100%" }}
                height={{ base: "120px", md: "150px" }}
                objectFit="cover"
              />
            </Link>
          </Box>

          {/* Data Cards */}
          <SimpleGrid
            columns={{ base: 1, md: stats.length <= 4 ? stats.length : 4 }}
            spacing={4}
            minChildWidth="120px"
            w="100%"
          >
            {stats.map((item, i) => (
              <VStack
                key={i}
                spacing={1}
                px={3}
                py={4}
                bg="gray.50"
                borderRadius="md"
                textAlign="center"
                color="gray.800"
                transition="all 0.3s ease"
                bgColor="blue.50"
                borderLeft="4px solid"
                borderColor="blue.600"
              >
                {item.icon && (
                  <Icon as={item.icon} boxSize={8} color="blue.900" transition="color 0.3s ease" />
                )}
                <Text fontSize="lg" fontWeight="bold" color={item.badgeColor ? 'green.700' : 'gray.700'}>
                  {item.value}
                </Text>
                <Text fontSize="md" color={item.colortitle || "gray.700"}>
                  {item.title}
                </Text>
                {item.badge && (
                  <Badge
                    colorScheme={item.badgeColor || "green"}
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {item.badgeText}
                  </Badge>
                )}
                <Text fontSize="xs" color="gray.600">
                  {item.sub}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      {/* Garis biru bawah */}
      <Box height="6px" bg="blue.600" borderBottomRadius="lg" />
    </Box>
  );
}
