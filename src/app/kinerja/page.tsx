'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HeaderLayout from '@/components/layout/HeaderLayout6';
import {
  IconMilitaryRank,
  IconGolfFilled,
  IconTarget,
  IconShieldCode,
  IconActivity,
  IconBrandSuperhuman,
  IconBrandSpeedtest
} from '@tabler/icons-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from '@/app/hooks/useGetData';
import { IResponse } from '@/app/api/kinerja/summary/route';
import { formatNumberIndonesia } from '@/libs/utils/helper';
import { useEffect, useState } from 'react';
import BreadCumb from '@/components/BreadCumb';
import StatistikWidget from '@/app/kinerja/components/StatistikWidget';

export default function KetengaKerjaanPage() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const apiUrl = `${getBasePath()}/api/kinerja/summary`;
  const { data } = useGetData<IResponse>(apiUrl.toString());

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(`${getBasePath()}/api/kinerja/lastupdate`);
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
      title: 'Misi',
      value: formatNumberIndonesia(data?.data.jml_misi ?? 0),
      icon: IconMilitaryRank,
      sub: '',
    },
    {
      title: 'Tujuan',
      value: formatNumberIndonesia(data?.data.jml_tujuan ?? 0),
      icon: IconGolfFilled,
      sub: '',
    },
    {
      title: 'Sasaran',
      value: formatNumberIndonesia(data?.data.jml_sasaran ?? 0),
      icon: IconTarget,
      sub: '',
    },
    {
      title: 'Program',
      value: formatNumberIndonesia(data?.data.jml_program ?? 0),
      icon: IconShieldCode,
      sub: '',
    },
    {
      title: 'Kegiatan',
      value: formatNumberIndonesia(data?.data.jml_kegiatan ?? 0),
      icon: IconActivity,
      sub: '',
    },
    {
      title: 'Sub Kegiatan',
      value: formatNumberIndonesia(data?.data.jml_subkegiatan ?? 0),
      icon: IconBrandSuperhuman,
      sub: '',
    }
    
  ];

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        flexShrink={0}
      >
        <Container maxW="1xl" py={2}>
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
              title="Teras Kinerja"
              subtitle="Data dan informasi terkini mengenai Kinerja Pemerintah Provinsi Banten"
              icon={IconBrandSpeedtest}
              date={lastUpdated ?? 'Belum ada data'}
              sumber="SIMAKIP BAPPEDA"
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
