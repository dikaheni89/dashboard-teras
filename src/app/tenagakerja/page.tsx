'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout';
import { BookUser, Calendar, Factory, FileUser } from 'lucide-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/siloker/summary/route';
import { formatDateIndonesia2, formatNumberIndonesia } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from '@/app/tenagakerja/components/StatistikWidget';

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/siloker/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/siloker/lastupdate`);
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
      title: 'Total Lowongan',
      value: formatNumberIndonesia(data?.data.lowongan ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: FileUser,
    },
    {
      title: 'Total Pelamar',
      value: formatNumberIndonesia(data?.data.pelamar ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: BookUser,
    },
    {
      title: 'Total Perusahaan',
      value: formatNumberIndonesia(data?.data.perusahaan ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: Factory,
    },
    {
      title: 'Per Tanggal',
      value: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      sub: '',
      icon: Calendar,
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
              title="Teras Siloker"
              subtitle="Data dan informasi terkini mengenai lowongan kerja Banten"
              icon={BookUser}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="SILOKER Banten"
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
