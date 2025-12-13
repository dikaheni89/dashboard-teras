'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout';
import { Users, BookUser, Mars, Venus } from 'lucide-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/kepegawaian/summary/route';
import { formatDateIndonesia2, formatNumberIndonesia } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from '@/app/kepegawaian/components/StatistikWidget';

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/kepegawaian/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/kepegawaian/lastupdate`);
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
      title: 'Jumlah Pegawai',
      value: formatNumberIndonesia(data?.data.total_pegawai ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: Users,
    },
    {
      title: 'Jumlah Pegawai Laki-Laki',
      value: formatNumberIndonesia(data?.data.laki_laki ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: Mars,
    },
    {
      title: 'Jumlah Pegawai Perempuan',
      value: formatNumberIndonesia(data?.data.perempuan ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: Venus,
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
              title="Teras Kepegawaian"
              subtitle="Data dan informasi terkini mengenai Data Kepegawaian"
              icon={BookUser}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="SIMASTEN Banten"
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
