'use client';
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import {GitCommitIcon, Milestone, RailSymbol, Waypoints} from "lucide-react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import {useEffect, useState} from "react";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/infrastruktur/summary/route";
import BreadCumb from "@/components/BreadCumb";
import StatistikWidget from "@/app/infrastruktur/components/StatistikWidget";

export default function InfrastrukturPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/infrastruktur/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/infrastruktur/lastupdate`, {
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
      title: "Panjang Jalan",
      value: data?.data.panjang != null ? data.data.panjang.toString() + " Km" : "Belum ada data",
      icon: Waypoints,
      sub: "",
    },
    {
      title: "Persentase Jalan",
      value: data?.data.persentase != null ? data?.data.persentase.toString() + " %" : "Belum ada data",
      icon: Milestone,
      sub: "",
    },
    {
      title: "Total Ruas",
      value: data?.data.total.toString() ?? "Belum ada data",
      icon: RailSymbol,
      sub: "",
    },
    {
      title: "Total Validasi",
      value: data?.data.valid.toString() ?? "Belum ada data",
      icon: GitCommitIcon,
      sub: "",
    }
  ];

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
            <BreadCumb title={'Teras Infrastruktur'} subtitle={'Pembangunan dan perawatan infrastruktur serta tata ruang provinsi'} sumber={'PUPR Banten'} date={lastUpdated ?? 'Belum ada data'} icon={Milestone} />
          </Box>
        </Container>
        <Container maxW="9xl" pb={24}>
          <Box
            position="relative"
            borderRadius={"lg"}
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
