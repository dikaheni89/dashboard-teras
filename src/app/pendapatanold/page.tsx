'use client';
import { Box, Container } from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { LuChartLine } from "react-icons/lu";
import HeaderLayout from "@/components/layout/HeaderLayout";
import PendapatanWidget from "@/app/pendapatanold/components/PendapatanWidget";

export default function PendapatanPage() {
  const headerStats = [
    {
      title: "Anggaran Kas",
      value: "1.1 T",
      sub: "",
      icon: LuChartLine,
    },
    {
      title: "Bea Balik Nama",
      value: "500 M",
      sub: "",
      icon: LuChartLine,
    },
    {
      title: "Pajak BBM",
      value: "78 M",
      sub: "",
      icon: LuChartLine,
    },
    {
      title: "Pajak Alat Berat",
      value: "23 M",
      sub: "",
      icon: LuChartLine,
    },
    {
      title: "Pajak Air Permukaan",
      value: "9 M",
      sub: "",
      icon: LuChartLine,
    },
    {
      title: "Pajak Air Rokok",
      value: "28 M",
      sub: "",
      icon: LuChartLine,
    },
  ];
  return (
    <Box bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        py={{ base: 4, md: 2 }}
        maxH="calc(100vh - 100px)"
        overflowY="auto"
      >
        <Container maxW="9xl" py={4}>
          <Box
            position="relative"
            borderRadius={"lg"}
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <HeaderLayout stats={headerStats} image={'/static/pendapatan.png'} />
          </Box>
        </Container>

        <Container maxW="9xl">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            p={0}
          >
            <PendapatanWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Box>
  );
}
