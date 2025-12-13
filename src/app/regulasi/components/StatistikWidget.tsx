import { Flex, Box } from '@chakra-ui/react';
import StatistikPeraturan from "@/app/regulasi/components/StatistikPeraturan";
import StatistikBidang from "@/app/regulasi/components/StatistikBidang";
import StatistikUrusan from "@/app/regulasi/components/StatistikUrusan";

export default function StatistikWidget() {
  return (
    <Flex direction="column" gap={4} p={4}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        <Box flex={1}>
          <StatistikPeraturan />
        </Box>
        <Box flex={1}>
          <StatistikBidang />
        </Box>
      </Flex>
        <StatistikUrusan />
    </Flex>
  );
}
