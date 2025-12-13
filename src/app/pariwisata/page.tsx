"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {useEffect, useState} from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {Database} from "lucide-react";
import {IResponsePariwisata} from "@/app/api/pariwisata/summary/route";
import StatistikWidget from "@/app/pariwisata/components/StatistikWidget";
import {TbUserDollar, TbUserHeart} from "react-icons/tb";
import {RiUserHeartFill} from "react-icons/ri";
import {MdTour} from "react-icons/md";

export default function KesehatanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/pariwisata/summary`;
  const { data } = useGetData<IResponsePariwisata>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/pariwisata/lastupdate`, {
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
      title: "Total Lokasi Pariwisata",
      value: data?.data.total_lokasi_pariwisata?.toString() ?? "Belum ada data",
      icon: Database,
      sub: "",
    },
    {
      title: "Mancanegara Bulan Ini",
      value: data?.data.total_mancanegara_bulan_ini?.toString() ?? "Belum ada data",
      icon: TbUserDollar,
      sub: "",
    },
    {
      title: "Mancanegara Bulan Lalu",
      value: data?.data.total_mancanegara_bulan_lalu?.toString() ?? "Belum ada data",
      icon: TbUserDollar,
      sub: "",
    },
    {
      title: "Nusantara Bulan Ini",
      value: data?.data.total_nusantara_bulan_ini?.toString() ?? "Belum ada data",
      icon: TbUserHeart,
      sub: "",
    },
    {
      title: "Nusantara Bulan Lalu",
      value: data?.data.total_nusantara_bulan_lalu?.toString() ?? "Belum ada data",
      icon: RiUserHeartFill,
      sub: "",
    },
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
            <BreadCumb title={'Teras Pariwisata'} subtitle={'Pariwisata Provinsi Banten'} sumber={'Dinas Pariwisata'} date={lastUpdated ?? 'Belum ada data'} icon={MdTour} />
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
