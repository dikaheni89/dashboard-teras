'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout';
import {
  IconBuilding,
  IconDoor,
  IconChalkboardTeacher,
  IconSchool,
  IconUserScreen
} from '@tabler/icons-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/pendidikan/summary/route';
import { formatDateIndonesia2, formatNumberIndonesia } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from '@/app/pendidikan/components/StatistikWidget';

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/pendidikan/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/pendidikan/lastupdate`);
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
      title: 'Jumlah Sekolah',
      value: formatNumberIndonesia(data?.data.jumlah_sekolah ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconBuilding,
    },
    {
      title: 'Jumlah Ruangan',
      value: formatNumberIndonesia(data?.data.jumlah_ruangan ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconDoor,
    },
    {
      title: 'Jumlah Guru',
      value: formatNumberIndonesia(data?.data.jumlah_guru ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconChalkboardTeacher,
    },
    {
      title: 'Jumlah Tendik',
      value: formatNumberIndonesia(data?.data.jumlah_tendik ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconUserScreen,
    },
    {
      title: 'Jumlah Siswa',
      value: formatNumberIndonesia(data?.data.jumlah_siswa ?? 0),
      sub: `per ${lastUpdated ? formatDateIndonesia2(lastUpdated) : 'Belum ada data'}`,
      icon: IconUserScreen,
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
              title="Teras Pendidikan"
              subtitle="Data dan informasi terkini mengenai Data Pendidikan"
              icon={IconSchool}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="DINDIK Prov Banten"
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
