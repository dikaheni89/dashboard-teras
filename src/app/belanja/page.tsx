'use client';
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import {Banknote, ShoppingBag} from "lucide-react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import StatistikBelanja from "@/app/belanja/components/StatistikBelanja";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/keuangan/utama/route";
import {formatRp} from "@/libs/utils/helper";
import BreadCumb from "@/components/BreadCumb";
import {useEffect, useState} from "react";

export default function PembangunanPage() {
  const apiUrl = `${getBasePath()}/api/keuangan/utama`;
  const { data, isError } = useGetData<IResponse>(apiUrl.toString());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/keuangan/lastupdate`, {
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

  let headerStats = [
    {
      title: "Target Pendapatan Daerah",
      value: "-",
      sub: "",
      icon: Banknote,
    },
    {
      title: "Realisasi Pendapatan Daerah",
      value: "-",
      sub: "",
      icon: Banknote,
    },
    {
      title: "Pagu Belanja Daerah",
      value: "-",
      sub: "",
      icon: Banknote,
    },
    {
      title: "Realisasi Belanja Daerah",
      value: "-",
      sub: "",
      icon: Banknote,
    },
  ];

  if (!isError && data) {
    const {
      data_utama: {
        target_pendapatan_daerah,
        realisasi_pendapatan_daerah,
        pagu_belanja_daerah,
        realisasi_belanja_daerah,
      },
    } = data.data;

    headerStats = [
      {
        title: "Target Pendapatan Daerah",
        value: formatRp(target_pendapatan_daerah),
        sub: "",
        icon: Banknote,
      },
      {
        title: "Realisasi Pendapatan Daerah",
        value: formatRp(realisasi_pendapatan_daerah),
        sub: "",
        icon: Banknote,
      },
      {
        title: "Pagu Belanja Daerah",
        value: formatRp(pagu_belanja_daerah),
        sub: "",
        icon: Banknote,
      },
      {
        title: "Realisasi Belanja Daerah",
        value: formatRp(realisasi_belanja_daerah),
        sub: "",
        icon: Banknote,
      },
    ];
  }
  return (
    <Flex direction="column" h="100vh" bg="gray.50">
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
            <BreadCumb title={'Teras Belanja Provinsi Banten'} subtitle={'Monitoring Belanja Daerah Provinsi Banten'} icon={ShoppingBag} date={lastUpdated ?? 'Belum ada data'} sumber={'BPKAD Provinsi Banten'} />
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
            <StatistikBelanja />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  );
}
