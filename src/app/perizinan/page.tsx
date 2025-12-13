'use client';
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import {BanknoteArrowUp} from "lucide-react";
import StatistikWidget from "@/app/perizinan/components/StatistikWidget";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/perizinan/summary/route";
import {useEffect, useState} from "react";

export default function PerhubunganPage() {
  const apiUrl = `${getBasePath()}/api/perizinan/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/perizinan/lastupdate`, {
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
      title: "Total Perizinan Selesai",
      value: data?.data?.total_izin.toLocaleString(),
      sub: "",
      badge: true,
      badgeText: "↑ 12% dari Bulan lalu",
      badgeColor: "green",
    },
    {
      title: "Total Pemohon",
      value: data?.data?.total_pemohon.toLocaleString() + " pemohon",
      sub: "",
      badge: true,
      badgeText: "↑ Total Pemohon",
      badgeColor: "green",
    },
    {
      title: "Rata-rata Masa Izin",
      value: `${data?.data?.rata_rata_masa_izin.toFixed(1)} Hari`,
      sub: "",
      badge: true,
      badgeText: "↓ Provinsi Banten",
      badgeColor: "red",
    },
    {
      title: "Total Sektor",
      value: `${data?.data?.total_sektor} Sektor`,
      sub: "",
      badge: true,
      badgeText: "↓ SIPA Baru",
      badgeColor: "green",
    },
  ];
  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        flexShrink={0}
      >
        <Container maxW="9xl" py={2}>
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
        <Container maxW="9xl" py={4}>
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg="transparent"
            height="100%"
          >
            <BreadCumb title={'Teras Perizinan & Investasi'} subtitle={'Informasi Perizinan Investasi'} date={lastUpdated ?? 'Belum ada data'} icon={BanknoteArrowUp} sumber={'DPMPTSP'}/>
          </Box>
        </Container>

        <Container maxW="9xl" pb={28}>
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
  );
}
