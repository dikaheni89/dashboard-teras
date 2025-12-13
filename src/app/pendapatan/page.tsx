'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout';
import {
  IconBellDollar,
  IconBuildingBank
} from '@tabler/icons-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/pendapatan/summary/route';
import { formatDateIndonesia2, formatRp } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from '@/app/pendapatan/components/StatistikWidget';

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/pendapatan/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/pendapatan/lastupdate`);
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
      title: 'Hari Ini',
      value: formatRp(data?.data.total_day ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconBellDollar,
    },
    {
      title: 'Minggu Ini',
      value: formatRp(data?.data.total_week ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconBellDollar,
    },
    {
      title: 'Bulan Ini',
      value: formatRp(data?.data.total_month ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconBellDollar,
    },
    {
      title: 'Tahun Ini',
      value: formatRp(data?.data.total_year ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconBellDollar,
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
              title="Teras Pendapatan"
              subtitle="Data dan informasi terkini mengenai Data Pendapatan"
              icon={IconBuildingBank}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="BAPENDA Prov Banten"
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
