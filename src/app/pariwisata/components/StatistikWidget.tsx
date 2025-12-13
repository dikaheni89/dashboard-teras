'use client';

import {Box, Flex} from "@chakra-ui/react";
import StatistikActiveTahun from "@/app/pariwisata/components/StatistikActiveTahun";
import StatistikActiveKota from "@/app/pariwisata/components/StatistikActiveKota";
import StatistikTopView from "@/app/pariwisata/components/StatistikTopView";
import StatistikTopLow from "@/app/pariwisata/components/StatistikTopLow";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <StatistikActiveTahun />
        <StatistikActiveKota />
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={1} p={2}>
        <Box flex="1">
          <StatistikTopView />
        </Box>
        <Box flex="1">
          <StatistikTopLow />
        </Box>
      </Flex>
    </>
  )
}
