'use client';

import {SimpleGrid} from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartSektor from "@/app/perizinan/components/ChartSektor";
import ChartKabupatenData from "@/app/perizinan/components/ChartKabupatenData";
import ChartKecamatanData from "@/app/perizinan/components/ChartKecamatanData";
import ChartTrend from "@/app/perizinan/components/ChartTrend";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StatistikWidget() {
  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2}} spacing={2} p={1} w="full" height="50%">
        <ChartKabupatenData />
        <ChartSektor />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1}} spacing={2} p={1} w="full" height="50%">
        <ChartTrend />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1}} spacing={2} p={1} w="full" height="50%">
        <ChartKecamatanData />
      </SimpleGrid>
    </>
  );
}
