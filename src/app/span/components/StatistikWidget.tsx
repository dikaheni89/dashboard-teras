'use client';

import {Box, Flex} from "@chakra-ui/react";
import KinerjaOpdWidget from "@/app/span/components/KinerjaOpdWidget";
import StatusLaporanWidget from "@/app/span/components/StatusLaporanWidget";
import TableSummaryWidget from "@/app/span/components/TableSummaryWidget";
import TableKategoriWidget from "@/app/span/components/TableKategoriWidget";
import TrendWidget from "@/app/span/components/TrendWidget";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <KinerjaOpdWidget />
        <StatusLaporanWidget />
      </Flex>
      <Flex p={4} >
        <TableSummaryWidget />
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4}>
        <Box flex={1}>
          <TableKategoriWidget />
        </Box>
        <Box flex={1}>
          <TrendWidget />
        </Box>
      </Flex>
    </>
  )
}
