"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import BeritaWidget from "@/app/berita/components/BeritaWidget";
import HeaderLayout from "@/components/layout/HeaderLayout";
import {Banknote, Monitor, Newspaper} from "lucide-react";
import BreadCumb from "@/components/BreadCumb";
import SocialWidget from "@/app/berita/components/SocialWidget";
import LayananStreaming from "@/app/berita/components/StreamingWidget";
import {useEffect, useState} from "react";
import {getBasePath} from "@/libs/utils/getBasePath";

export default function BeritaPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const headerStats = [
    {
      title: "Media Sosial",
      value: "",
      sub: "",
      icon: Banknote,
    },
    {
      title: "Medial Digital",
      value: "",
      sub: "",
      icon: Newspaper,
    },
    {
      title: "Media Streaming",
      value: "",
      sub: "",
      icon: Monitor,
    },
  ];

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/media/lastupdate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setLastUpdated(data.data.updated_at);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchLastUpdated();
  }, []);

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
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
            <HeaderLayout stats={headerStats} image={'/static/top-teras.png'} />
          </Box>
        </Container>
      </Box>
      <Box flex="1" overflowY="auto">
        <Container maxW="9xl" py={4} bg="transparent">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg="transparent"
            height="100%"
          >
            <BreadCumb title={'Teras Media'} subtitle={'Monitoring Media Sosial dan Media Digital Provinsi Banten'} icon={Newspaper} date={lastUpdated ?? 'Belum ada data'} sumber={"Media Online"} />
          </Box>
        </Container>

        <Container maxW="9xl" py={2}>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <SocialWidget />
          </Box>
        </Container>

        <Container maxW="9xl" py={2}>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <BeritaWidget />
          </Box>
        </Container>

        <Container maxW="9xl" py={2} pb={24}>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <LayananStreaming />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  )
}
