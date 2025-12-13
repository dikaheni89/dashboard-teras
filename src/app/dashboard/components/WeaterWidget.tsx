'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  Spinner,
  Image,
  HStack,
} from '@chakra-ui/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Slider from 'react-slick';
import BeritaWidget from '@/app/dashboard/components/BeritaWidget';
import useGetData from '@/app/hooks/useGetData';
import { ResponseDataAPI } from '@/app/api/bmkg/dashboard/route';
import { getBasePath } from '@/libs/utils/getBasePath';

export default function WeatherWidget() {
  const { isLoading, isError, data } = useGetData<ResponseDataAPI>(`${getBasePath()}/api/bmkg/dashboard`);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Flex p={4} gap={4} wrap="wrap" justify="space-between" align="flex-start">
      {/* Teras Cuaca */}
      <Box flex="1" minW="0">
        <Flex justify="space-between" align="center" mb={1}>
          <HStack>
            <Image src="/static/icon/notification.gif" alt="Map Outline" boxSize="30px" objectFit="contain" />
            <Heading size="md">Teras Cuaca</Heading>
          </HStack>
          <Flex gap={2}>
            <IconButton
              icon={<ChevronLeft size={16} />}
              aria-label="Prev"
              variant="ghost"
              colorScheme="blue"
              size="sm"
              onClick={() => sliderRef.current?.slickPrev()}
            />
            <IconButton
              icon={<ChevronRight size={16} />}
              aria-label="Next"
              variant="ghost"
              colorScheme="blue"
              size="sm"
              onClick={() => sliderRef.current?.slickNext()}
            />
          </Flex>
        </Flex>

        {isLoading && (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" />
          </Flex>
        )}

        {isError ? (
          <Flex justify="center" align="center" minH="200px">
            <Text fontSize="lg" color="gray.500">
              Gagal Memuat Data Cuaca Silakan coba beberapa saat lagi.
            </Text>
          </Flex>
        ) : (
          data?.data && Array.isArray(data.data) && (
            <Slider ref={sliderRef} {...settings}>
              {data.data.map((item, i) => (
                <Box key={i} px={2}>
                  <Box
                    p={2}
                    bg="blue.50"
                    borderRadius="2xl"
                    display="flex"
                    flexDir="column"
                    justifyContent="space-between"
                    h="100%"
                  >
                    <Text fontWeight="bold" mb={1}>
                      {item.lokasi.kotkab}
                    </Text>

                    <VStack flex={1} justify="center" spacing={1}>
                      <Image
                        src={item.cuaca.image}
                        alt={item.cuaca.weather_desc}
                        boxSize="48px"
                        objectFit="contain"
                      />
                      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                        {item.cuaca.tmin}°C - {item.cuaca.tmax}°C
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {item.cuaca.weather_desc}
                      </Text>
                    </VStack>

                    <Flex justify="flex-end" mt={2}>
                      <IconButton
                        icon={<ArrowRight size={16} />}
                        aria-label="Detail"
                        size="sm"
                        colorScheme="blue"
                        variant="solid"
                        borderRadius="full"
                      />
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Slider>
          )
        )}
      </Box>

      {/* Teras Berita */}
      <BeritaWidget />
    </Flex>
  );
}
