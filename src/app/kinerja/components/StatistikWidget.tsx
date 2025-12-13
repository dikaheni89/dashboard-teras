'use client';

import {Flex} from "@chakra-ui/react";
import KinerjaBulananWidget from "@/app/kinerja/components/KinerjaBulananWidget";
import KinerjaProvinsiWidget from "@/app/kinerja/components/KinerjaProvinsiWidget";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <KinerjaProvinsiWidget />
        
      </Flex>
        <KinerjaBulananWidget />
      
    
    </>
  )
}
