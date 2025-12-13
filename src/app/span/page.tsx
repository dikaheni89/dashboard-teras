'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout';
import {FileCheck2, FileInput, FileUser, MessageCircleWarning, Users} from 'lucide-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { ISpanResponse } from '@/app/api/spanlapor/dashboard/route';
import { formatDateIndonesia2, formatNumberIndonesia } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from "@/app/span/components/StatistikWidget";

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/spanlapor/dashboard`;
  const { data } = useGetData<ISpanResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/spanlapor/lastupdate`);
        if (!response.ok) return;
        const json = await response.json();
        setLastUpdated(json.data.updated_at);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchLastUpdated();
  }, []);

  const headerStats = [
    {
      title: 'Total Aduan',
      value: formatNumberIndonesia(data?.data.total_stats.total_aduan ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: FileUser,
    },
    {
      title: 'Dalam Proses',
      value: formatNumberIndonesia(data?.data.total_stats.total_proses ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: MessageCircleWarning,
    },
    {
      title: 'Laporan Selesai',
      value: formatNumberIndonesia(data?.data.total_stats.total_selesai ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: FileCheck2,
    },
    {
      title: 'Laporan Di Tindak Lanjuti',
      value: formatNumberIndonesia(data?.data.total_stats.total_tindak_lanjut ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: FileInput,
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
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <HeaderLayout stats={headerStats} image="/static/top-teras.png" />
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
          >
            <BreadCumb
              title="Teras SP4N Lapor"
              subtitle="Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional"
              icon={Users}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="SP4N Lapor Banten"
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
