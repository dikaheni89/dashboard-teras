'use client';

import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody, Image, Flex } from '@chakra-ui/react';

const streamingSources = [
  {
    label: 'TV One',
    url: 'https://www.youtube.com/embed/yNKvkPJl-tg?si=-Nz0m9XnLvLvCNK2'
  },
  {
    label: 'Kompas TV',
    url: 'https://www.youtube.com/embed/DOOrIxw5xOw?si=UFhA090snYms7GKy'
  },
  {
    label: 'Garuda TV',
    url: 'https://www.youtube.com/embed/9_bT0Tr9tjs?si=1o9LoY2JiANWZNR9'
  }
];

export default function LayananStreaming() {
  return (
    <Box p={5}>
      <Tabs variant="enclosed">
        <TabList mb={5}>
          {streamingSources.map((source, index) => (
            <Tab key={index}>{source.label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {streamingSources.map((source, index) => (
            <TabPanel key={index}>
              <Box className="ratio ratio-16x9" w="100%">
                <iframe
                  width="100%"
                  height="500"
                  src={source.url}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Flex justify="space-between" mt={10}>
        <Card w="30%" boxShadow="lg" borderRadius="md">
          <CardBody>
            <Image src="/static/tvone.png" alt="Layanan Publik Banten" height="155" />
          </CardBody>
        </Card>

        <Card w="30%" boxShadow="lg" borderRadius="md">
          <CardBody>
            <Image src="/static/kompas.png" alt="Layanan Publik Banten" height="155" />
          </CardBody>
        </Card>

        <Card w="30%" boxShadow="lg" borderRadius="md">
          <CardBody>
            <Image src="/static/garuda.png" alt="Layanan Publik Banten" height="155" />
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
