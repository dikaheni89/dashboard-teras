"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {MdHealthAndSafety} from "react-icons/md";
import {useEffect, useState} from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {Accessibility, Calendar, Database, Hospital} from "lucide-react";
import {IResponse} from "@/app/api/malimping/summary/route";
import StatistikWidget from "@/app/malimping/components/StatistikWidget";

export default function KesehatanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/malimping/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/malimping/lastupdate`, {
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
      title: "Jumlah Paramedis",
      value: data?.data.paramedic_count?.toString() ?? "Belum ada data",
      icon: Accessibility,
      sub: "",
    },
    {
      title: "Jumlah Ruangan",
      value: data?.data.room_class_count?.toString() ?? "Belum ada data",
      icon: Hospital,
      sub: "",
    },
    {
      title: "Jumlah Jadwal",
      value: data?.data.schedule_count?.toString() ?? "Belum ada data",
      icon: Calendar,
      sub: "",
    },
    {
      title: "Jumlah Unit Servis",
      value: data?.data.service_unit_count?.toString() ?? "Belum ada data",
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
            <BreadCumb title={'Teras RSUD Malimping'} subtitle={'Data RSUD Malimping Provinsi Banten'} sumber={'RSUD Malimping'} date={lastUpdated ?? 'Belum ada data'} icon={MdHealthAndSafety} />
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
