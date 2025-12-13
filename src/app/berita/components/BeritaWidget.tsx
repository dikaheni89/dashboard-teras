'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Badge,
  Skeleton,
  Grid,
  IconButton,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { RepeatIcon } from 'lucide-react';
import { getBasePath } from '@/libs/utils/getBasePath';
import useGetData from "@/app/hooks/useGetData";

type NewsItem = {
  id: number;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  source: string;
};

type NewsResponse = {
  id: number;
  sumber: string;
  url: string;
  kategori: string;
  news: Omit<NewsItem, 'source'>[];
};

type MediaResponse = {
  status: number;
  success: boolean;
  message: string;
  data: NewsResponse[];
};

export default function BeritaWidget() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  const apiUrl = `${getBasePath()}/api/media/allmedia`;
  const { data, isLoading } = useGetData<MediaResponse>(apiUrl.toString());

  useEffect(() => {
    if (data && data.data) {
      const newsFeeds: NewsItem[] = data.data.flatMap((feed: NewsResponse) =>
        feed.news?.map((item) => ({
          ...item,
          source: feed.sumber,
        })) || []
      );

      const uniqueSources = Array.from(new Set(newsFeeds.map((item) => item.source)));

      setNewsData(newsFeeds);
      setSources(uniqueSources);
    }
  }, [data]);

  const renderNewsItems = (source: string) => (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={4}>
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} height="200px" borderRadius="md" />
        ))
      ) : (
        newsData
          .filter((item) => source === 'all' || item.source === source)
          .map((item) => (
            <Box
              key={item.link}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              _hover={{ boxShadow: 'lg' }}
            >
              <Flex justifyContent="space-between" mb={2}>
                <Badge colorScheme={item.source === 'detik' ? 'red' : item.source === 'kompas' ? 'green' : 'blue'}>
                  {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {new Date(item.pub_date).toLocaleString('id-ID')}
                </Text>
              </Flex>
              <Heading size="sm" mb={2}>
                {item.title}
              </Heading>
              <Box
                noOfLines={3}
                mb={2}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
              <Button as="a" href={item.link} target="_blank" size="sm" colorScheme="blue">
                Baca Selengkapnya
              </Button>
            </Box>
          ))
      )}
    </Grid>
  );

  return (
    <Box maxW="full" mx="auto" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex justify="space-between" p={4} borderBottomWidth="1px">
        <Heading size="md">Berita Terkini Banten</Heading>
        <HStack spacing={4}>
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            size="sm"
            isLoading={isLoading}
          />
        </HStack>
      </Flex>

      <Tabs variant="unstyled" colorScheme="blue" isFitted>
        <TabList borderBottom="2px solid" borderColor="gray.200">
          <Tab>Semua Berita</Tab>
          {sources.map((label, index) => (
            <Tab key={index}>{label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>{renderNewsItems('all')}</TabPanel>
          {sources.map((source, index) => (
            <TabPanel key={index}>{renderNewsItems(source)}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
