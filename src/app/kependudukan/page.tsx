"use client";
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import StatistikWidget from "@/app/kependudukan/components/StatistikWidget";
import HeaderLayout from "@/components/layout/HeaderLayout";
import {StarIcon} from "lucide-react";
import BreadCumb from "@/components/BreadCumb";
import {HiOutlineUserGroup} from "react-icons/hi";
import {useEffect, useState} from "react";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/kependudukan/summary/route";
import {formatDateIndonesia2, formatNumberIndonesia} from "@/libs/utils/helper";

export default function KependudukanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/kependudukan/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/kependudukan/lastupdate`, {
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
      title: "Jumlah Penduduk",
      value: formatNumberIndonesia(data?.data.total_penduduk ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : "Belum ada data"}`,
      icon: StarIcon,
    },
    {
      title: "Telah Rekam WKTP",
      value: formatNumberIndonesia(data?.data.total_rekam ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : "Belum ada data"}`,
      icon: StarIcon,
    },
    {
      title: "Memiliki EKTP",
      value: formatNumberIndonesia(data?.data.total_ektp ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : "Belum ada data"}`,
      icon: StarIcon,
    },
    {
      title: "Memiliki KIA",
      value: formatNumberIndonesia(data?.data.total_kia ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : "Belum ada data"}`,
      icon: StarIcon,
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
            <BreadCumb title={'Teras Kependudukan'} subtitle={'Monitoring Kependudukan Provinsi Banten'} icon={HiOutlineUserGroup} date={lastUpdated ?? 'Belum ada data'} sumber={'Disdukcapil'} />
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
