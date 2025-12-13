'use client';

import {Flex} from "@chakra-ui/react";
import ByBentukPendidikanWidget from "@/app/pendidikan/components/ByBentukPendidikanWidget";
import ByStatusSekolahWidget from "@/app/pendidikan/components/ByStatusSekolahWidget";
import BySekolahWidget from "@/app/pendidikan/components/BySekolahWidget";

export default function StatistikWidget() {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} p={4} >
        <ByBentukPendidikanWidget />
        
        <ByStatusSekolahWidget />
      </Flex>
      <BySekolahWidget />
    
    </>
  )
}
