'use client';
import { Box, Container } from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderTeras from "@/components/layout/HeaderTeras";
import StatistikKetapang from "@/app/ketapang/components/StatistikKetapang";
import BreadCumb from "@/components/BreadCumb";

export default function KetapangPage() {
  // Disable API call untuk mempercepat loading
const now = new Date();
const lastUpdated = now.toISOString().split("T")[0];
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
            <HeaderTeras />
          </Box>
        </Container>

        <Container maxW="9xl" height="100%" py={4} bg="transparent">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg="transparent"
            height="100%"
          >
            <BreadCumb title={'Teras Ketapang Provinsi Banten'} subtitle={'Data Ketahanan Pangan Provinsi Banten'} date={lastUpdated} sumber={'Sumber BPN'} />
          </Box>
        </Container>

         <Container maxW="9xl">
          <Box
            position="relative"
            borderBottomLeftRadius={"lg"}
            borderBottomRightRadius={"lg"}
            overflow="hidden"
            boxShadow="md"
            bg="white"
            py={4}
          >
            <StatistikKetapang/>
          </Box>
        </Container>

      </Box>
      <BottomNavigation />
    </Box>
  );
}
