"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {Box, Heading, HStack, Image, Spinner, Text, VStack} from "@chakra-ui/react";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";

type NewsItem = {
  id: number;
  title: string;
  link: string;
  media: string;
  description: string;
  pub_date: string;
  source: string;
};

type NewsResponse = {
  id: number;
  sumber: string;
  url: string;
  kategori: string;
  news: Omit<NewsItem, "source">[];
};

type MediaResponse = {
  status: number;
  success: boolean;
  message: string;
  data: NewsResponse[];
};

const CACHE_KEY = "beritaSlides";

export default function BeritaWidget() {
  const [beritaSlides, setBeritaSlides] = useState<NewsItem[][]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = `${getBasePath()}/api/media/allmedia`;
  const { data, isLoading } = useGetData<MediaResponse>(apiUrl);

  useEffect(() => {
    if (isLoading) return;

    if (!data || !data.success || !Array.isArray(data.data)) {
      console.error("Gagal mengambil data atau struktur tidak sesuai.");
      setLoading(false);
      return;
    }

    const allArticles: NewsItem[] = [];

    data.data.forEach((newsSource) => {
      if (Array.isArray(newsSource.news)) {
        newsSource.news.forEach((newsItem) => {
          allArticles.push({
            ...newsItem,
            source: newsSource.sumber,
          });
        });
      }
    });

    const groupedArticles = [];
    for (let i = 0; i < allArticles.length; i += 3) {
      groupedArticles.push(allArticles.slice(i, i + 3));
    }

    const cacheData = {
      timestamp: Date.now(),
      data: groupedArticles,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    setBeritaSlides(groupedArticles);
    setLoading(false);
  }, [data, isLoading]);

  const settings = {
    dots: false,
    infinite: true,
    vertical: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  if (loading) {
    return (
      <Box
        w="30%"
        minH="245px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        textAlign="center"
      >
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box w="30%" minH="100px" maxH="245px" overflow="hidden">
      <HStack>
        <Image
          src="/static/icon/notification.gif"
          alt="Map Outline"
          boxSize="30px"
          objectFit="contain"
        />
        <Heading fontSize="xl">Teras Berita</Heading>
      </HStack>
      <Slider {...settings}>
        {beritaSlides.map((group, i) => (
          <Box key={i} bg="gray.100" borderRadius="md" p={4}>
            <VStack spacing={4} align="stretch">
              {group.map((item, idx) => (
                <HStack
                  as="a"
                  href={item.link}
                  target="_blank"
                  key={idx}
                  align="start"
                  spacing={4}
                  _hover={{ textDecoration: "none", bg: "gray.200" }}
                  p={1}
                  borderRadius="md"
                >
                  <Image
                    src={item.media || "/static/no-image.png"}
                    alt={item.title}
                    boxSize="70px"
                    objectFit="cover"
                  />
                  <Text fontSize="sm" color="gray.700" noOfLines={3}>
                    {item.title}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
