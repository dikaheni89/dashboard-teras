'use client';

import {Flex} from "@chakra-ui/react";
import PelamarWidget from "@/app/tenagakerja/components/PelamarWidget";
import PelamarkategoriWidget from "@/app/tenagakerja/components/PelamarkategoriWidget";
import LowonganKategoriWidget from "@/app/tenagakerja/components/LowonganKategoriWidget";
import LowonganKotaWidget from "@/app/tenagakerja/components/LowonganKotaWidget";
import PelamarGenderWidget from "@/app/tenagakerja/components/PelamarGenderWidget";
import PerusahaanKotaWidget from "@/app/tenagakerja/components/PerusahaanKotaWidget";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <PelamarWidget />
        <PelamarkategoriWidget />
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <LowonganKategoriWidget />
        <LowonganKotaWidget />
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <PelamarGenderWidget />
        <PerusahaanKotaWidget />
      </Flex>
    </>
  )
}
