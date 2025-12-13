"use client";
import { Box, Container, Flex } from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import StatistikWidget from "@/app/dashboard/components/StatistikWidget";
import WeatherWidget from "@/app/dashboard/components/WeaterWidget";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { StarIcon } from "lucide-react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponse } from "@/app/api/keuangan/utama/route";
import { formatRp } from "@/libs/utils/helper";

export default function DashboardPage() {
  const apiUrl = `${getBasePath()}/api/keuangan/utama`;
  const { data, isError } = useGetData<IResponse>(apiUrl.toString());

  let headerStats = [
    {
      title: "TOTAL PENDAPATAN DAERAH",
      value: "Data tidak tersedia",
      sub: "-",
      icon: StarIcon,
    },
    {
      title: "REALISASI PENDAPATAN & BELANJA",
      value: "Data tidak tersedia",
      sub: "-",
      icon: StarIcon,
    },
    {
      title: "IPM",
      value: "0",
      sub: "Belum ada data",
      icon: StarIcon,
    },
    {
      title: "REALISASI INVESTASI ASING (PMA)",
      value: "0",
      sub: "Belum ada data",
      icon: StarIcon,
    },
  ];

  if (!isError && data) {
    const {
      data_utama: { target_pendapatan_daerah, realisasi_belanja_daerah },
    } = data.data;

    headerStats = [
      {
        title: "TOTAL PENDAPATAN DAERAH",
        value: formatRp(target_pendapatan_daerah),
        sub: "per Januari 2025",
        icon: StarIcon,
      },
      {
        title: "REALISASI PENDAPATAN & BELANJA",
        value: formatRp(realisasi_belanja_daerah),
        sub: "per Maret 2025",
        icon: StarIcon,
      },
      {
        title: "IPM",
        value: "0",
        sub: "Belum ada data",
        icon: StarIcon,
      },
      {
        title: "REALISASI INVESTASI ASING (PMA)",
        value: "0",
        sub: "Belum ada data",
        icon: StarIcon,
      },
    ];
  }

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        py={3}
      >
        <Container maxW="9xl">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <HeaderLayout stats={headerStats} image={'/static/top-teras.png'} />
          </Box>
        </Container>
      </Box>
      <Box flex="1" overflowY="auto">
        <Container maxW="9xl" bg="transparent">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg="transparent"
            height="100%"
          >
            <WeatherWidget />
          </Box>
        </Container>
        <Container maxW="9xl" pb={28}>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            p={1}
          >
            <StatistikWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  );
}
