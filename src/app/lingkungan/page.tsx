"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {useEffect, useState} from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/lingkungan/summary/route";
import {
  ChartAreaIcon,
  ChartColumnIcon,
  FileChartColumnIncreasingIcon,
  FileSpreadsheetIcon,
  TreesIcon
} from "lucide-react";
import StatistikWidget from "@/app/lingkungan/components/StatistikWidget";

export default function KesehatanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/lingkungan/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/lingkungan/lastupdate`, {
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

  const headerStats = [
    {
      title: "Jumlah Amdal",
      value: data?.data.amdal?.toString() ?? "Belum ada data",
      icon: FileChartColumnIncreasingIcon,
      sub: "",
    },
    {
      title: "Jumlah SPPL",
      value: data?.data.sppl?.toString() ?? "Belum ada data",
      icon: FileSpreadsheetIcon,
      sub: "",
    },
    {
      title: "Total Izin",
      value: data?.data.total_izin?.toString() ?? "Belum ada data",
      icon: ChartAreaIcon,
      sub: "",
    },
    {
      title: "Jumlah UKL UPL",
      value: data?.data.ukl_upl?.toString() ?? "Belum ada data",
      icon: ChartColumnIcon,
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
            borderRadius={"lg"}
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
            <BreadCumb title={'Teras Lingkungan'} subtitle={'Data Dinas Lingkungan Hidup'} sumber={'DLHK (Dinas Lingkungan Hidup)'} date={lastUpdated ?? 'Belum ada data'} icon={TreesIcon} />
          </Box>
        </Container>

        <Container maxW="9xl" pb={24}>
          <Box
            position="relative"
            borderBottomLeftRadius={"lg"}
            borderBottomRightRadius={"lg"}
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
  )
}
