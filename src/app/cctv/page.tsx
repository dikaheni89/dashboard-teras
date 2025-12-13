"use client";
import {Box, Container} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import CctvWidget from "@/app/cctv/components/CctvWidget";
import HeaderTeras from "@/components/layout/HeaderTeras";
import BreadCumb from "@/components/BreadCumb";
import {HiVideoCamera} from "react-icons/hi";

export default function CCTVPage() {

  return (
    <Box bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        py={{ base: 4, md: 10 }}
        maxH="calc(100vh - 100px)"
        overflowY="auto"
      >
        <Container maxW="9xl">
          <Box
            position="relative"
            borderRadius="lg"
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
            <BreadCumb title={'Teras CCTV Banten'} subtitle={'Monitoring Kawasan Pusat Pemerintahan Provinsi Banten (KP3B)'} icon={HiVideoCamera} sumber={'ATCS DISHUB'} />
          </Box>
        </Container>
        <Container maxW="9xl">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="transparent"
            p={1}
          >
            <CctvWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Box>
  )
}
