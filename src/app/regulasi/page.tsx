"use client";
import { Box, Container, Flex } from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {MdFileCopy} from "react-icons/md";
import { useEffect, useState } from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { Database, FileCheck2, FileX2 } from "lucide-react";
import {IResponse} from "@/app/api/regulasi/summary/route";
import StatistikWidget from "@/app/regulasi/components/StatistikWidget";

export default function KesehatanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/regulasi/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/regulasi/lastupdate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setLastUpdated(data.data.updated_at);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchLastUpdated();
  }, []);

  const headerStats = [
    {
      title: "Total Berlaku",
      value: data?.data.total_berlaku?.toString() ?? "Belum ada data",
      icon: FileCheck2,
      sub: "",
    },
    {
      title: "Total Tidak Berlaku",
      value: data?.data.total_tidak_berlaku?.toString() ?? "Belum ada data",
      icon: FileX2,
      sub: "",
    },
    {
      title: "Total Regulasi",
      value: data?.data.total_data?.toString() ?? "Belum ada data",
      icon: Database,
      sub: "",
    }
  ];

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        py={3}
      >
        <Container maxW="9xl" py={4}>
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
            <BreadCumb
              title={'Teras Regulasi'}
              subtitle={'Data Jaringan Dokumentasi dan Informasi Hukum Provinsi Banten'}
              sumber={'JDIH Provinsi Banten'}
              date={lastUpdated ?? 'Belum ada data'}
              icon={MdFileCopy}
            />
          </Box>
        </Container>

        <Container maxW="9xl" pb={24}>
          <Box
            position="relative"
            borderBottomLeftRadius="lg"
            borderBottomRightRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            p={0}
          >
            <StatistikWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  );
}
