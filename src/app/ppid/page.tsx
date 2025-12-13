"use client";
import { Box, Container, Flex } from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import BreadCumb from "@/components/BreadCumb";
import { BarChart3 } from "lucide-react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponsePermohonan } from "@/app/api/ppid/permohonan/route";
import { useEffect, useMemo, useState } from "react";
import PermohonanWidget from "@/app/ppid/components/PermohonanWidget";

export default function PPIDPage() {
  const apiUrl = `${getBasePath()}/api/ppid/permohonan`;
  const { data } = useGetData<IResponsePermohonan>(apiUrl.toString());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/ppid/lastupdate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const json = await response.json();
        setLastUpdated(json.data.updated_at);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchLastUpdated();
  }, []);

  const totals = useMemo(() => {
    const items = data?.data ?? [];
    return items.reduce(
      (acc, item) => {
        acc.total_permohonan += Number(item.total_permohonan ?? 0);
        acc.total_selesai += Number(item.total_selesai ?? 0);
        acc.total_proses += Number(item.total_proses ?? 0);
        acc.total_ditolak += Number(item.total_ditolak ?? 0);
        return acc;
      },
      { total_permohonan: 0, total_selesai: 0, total_proses: 0, total_ditolak: 0 }
    );
  }, [data]);

  const headerStats = [
    {
      title: "Total Permohonan",
      value: totals.total_permohonan.toLocaleString(),
      sub: "",
      badge: true,
      badgeText: "↑ Tren Positif",
      badgeColor: "green",
    },
    {
      title: "Total Selesai",
      value: totals.total_selesai.toLocaleString(),
      sub: "",
      badge: true,
      badgeText: "↑ Penyelesaian",
      badgeColor: "green",
    },
    {
      title: "Total Proses",
      value: totals.total_proses.toLocaleString(),
      sub: "",
      badge: true,
      badgeText: "↗ Dalam Proses",
      badgeColor: "blue",
    },
    {
      title: "Total Ditolak",
      value: totals.total_ditolak.toLocaleString(),
      sub: "",
      badge: true,
      badgeText: "↓ Perlu Perbaikan",
      badgeColor: "red",
    },
  ];

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box bgImage="url('/static/bg01.jpg')" bgSize="cover" bgPos="center" flexShrink={0}>
        <Container maxW="9xl" py={2}>
          <Box position="relative" borderRadius={"lg"} overflow="hidden" boxShadow="md" bg="white">
            <HeaderLayout stats={headerStats} image={'/static/top-teras.png'} />
          </Box>
        </Container>
      </Box>

      <Box flex="1" overflowY="auto">
        <Container maxW="9xl" py={4}>
          <Box position="relative" borderRadius="lg" overflow="hidden" bg="transparent" height="100%">
            <BreadCumb
              title={"Teras PPID"}
              subtitle={"Permohonan Informasi Publik per OPD"}
              date={lastUpdated ?? "Belum ada data"}
              icon={BarChart3}
              sumber={"PPID Provinsi Banten"}
            />
          </Box>
        </Container>

        <Container maxW="9xl" pb={28}>
          <Box position="relative" borderBottomLeftRadius={"lg"} borderBottomRightRadius={"lg"} overflow="hidden" boxShadow="md" bg="white" p={4}>
            <PermohonanWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  );
}
