'use client';
import {Box, Container, Flex} from "@chakra-ui/react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import PeringatanWidget from "@/app/kebencanaan/components/PeringatanWidget";
import HeaderTeras from "@/components/layout/HeaderTeras";

export default function KebencanaanPage() {

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Box
        bgImage="url('/static/bg01.jpg')"
        bgSize="cover"
        bgPos="center"
        py={{ base: 4, md: 2 }}
        maxH="calc(100vh - 100px)"
        overflowY="auto"
      >
        <Container maxW="9xl" py={4}>
          <Box
            position="relative"
            borderRadius={"lg"}
            overflow="hidden"
            boxShadow="md"
            bg="white"
          >
            <HeaderTeras/>
          </Box>
        </Container>
      </Box>
      <Box flex="1" overflowY="auto">
        <Container maxW="9xl">
          <Box
            position="relative"
            borderRadius={"lg"}
            overflow="hidden"
            boxShadow="md"
            bg="white"
            p={0}
          >
          <PeringatanWidget />
          </Box>
        </Container>
      </Box>
      <BottomNavigation />
    </Flex>
  );
}
