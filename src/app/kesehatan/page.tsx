"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import StatistikWidget from "@/app/kesehatan/components/StatistikWidget";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {MdHealthAndSafety} from "react-icons/md";
import {IResponse} from "@/app/api/kesehatan/summary/route";
import {useEffect, useState} from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {Bed, BedDouble, BedSingle, Hospital} from "lucide-react";

export default function KesehatanPage() {
   const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const apiUrl = `${getBasePath()}/api/kesehatan/summary`;
    const { data } = useGetData<IResponse>(apiUrl.toString());

    useEffect(() => {
      const fetchLastUpdated = async () => {
        try {
          const response = await fetch(`${getBasePath()}/api/kesehatan/lastupdate`, {
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
      title: "Jumlah Tempat Tidur Kosong",
      value: data?.data.jumlah_tempat_tidur_kosong?.toString() ?? "Belum ada data",
      icon: Bed,
      sub: "",
    },
    {
      title: "Jumlah Tempat Tidur",
      value: data?.data.jumlah_tempat_tidur?.toString() ?? "Belum ada data",
      icon: BedSingle,
      sub: "",
    },
    {
      title: "Jumlah Ruangan",
      value: data?.data.jumlah_ruangan?.toString() ?? "Belum ada data",
      icon: Hospital,
      sub: "",
    },
    {
      title: "Jumlah Kamar",
      value: data?.data.jumlah_kamar?.toString() ?? "Belum ada data",
      icon: BedDouble,
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
            <BreadCumb title={'Teras Kesehatan Provinsi Banten'} subtitle={'Data Kesehatan dan Provinsi Banten'} sumber={'RSUD Banten'} date={lastUpdated ?? 'Belum ada data'} icon={MdHealthAndSafety} />
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
