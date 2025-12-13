'use client';

import {Flex} from "@chakra-ui/react";
import ByUmurWidget from "@/app/kepegawaian/components/ByUmurWidget";
import BySeksiWidget from "@/app/kepegawaian/components/BySeksiWidget";
import ByPendidikanWidget from "@/app/kepegawaian/components/ByPendidikanWidget";
import ByPosisiWidget from "@/app/kepegawaian/components/ByPosisiWidget";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <ByPendidikanWidget />
        
        <ByUmurWidget />
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <ByPosisiWidget />
        <BySeksiWidget />
      </Flex>
    
    </>
  )
}
