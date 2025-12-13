'use client';

import {Box, Flex, Heading, HStack, Icon, Text} from "@chakra-ui/react";
import {FC, ReactNode, useEffect, useState} from "react";
import {HeaderStatsItem} from "@/components/layout/HeaderLayout";
import {formatDateIndonesia2} from "@/libs/utils/helper";

type BreadCumbProps = {
  title: string;
  subtitle?: string;
  icon?: FC<any>;
  stats?: HeaderStatsItem[];
  image?: string;
  date?: string;
  sumber?: string;
  children?: ReactNode;
};

export default function BreadCumb(props: BreadCumbProps) {

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
      const tanggal = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(`${hari}, ${tanggal}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayDate = props.date ? formatDateIndonesia2(props.date) : currentTime;

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
      align="center"
      mb={6}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      bgGradient="linear(to-r, blue.50, gray.100)"
    >
      <HStack align="center">
        <Icon as={props.icon} boxSize={14} color="blue.600" />
        <Box>
          <Heading size="lg" color="blue.800">{props.title}</Heading>
          <Text color="primary.600">{props.subtitle}</Text>
        </Box>
      </HStack>
      <HStack spacing={4} mt={{ base: 4, md: 0 }}>
        <Box bg="white" px={4} py={2} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200">
          <Box>
            <Box bg="green.500" w={2} h={2} rounded="full" display="inline-block" mr={2}></Box>
            <Text as="span" fontSize="sm">Last Update : {displayDate}</Text>
          </Box>
          <Box>
            <Text as="span" fontSize="sm" ml={4}>Sumber: {props.sumber}</Text>
          </Box>
        </Box>
      </HStack>
    </Flex>
  );
}
