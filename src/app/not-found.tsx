import Link from 'next/link'
import {Box, Text, VStack} from "@chakra-ui/react";
import Image from "next/image";

export default function NotFound() {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      flexDirection="column"
      py={12}
    >
      <VStack spacing={4}>
        <Box position="relative" width={500} height={300}>
          <Image
            src="/static/banten.png"
            alt="Map Outline"
            width={500}
            height={500}
            objectFit="cover"
            priority
          />
        </Box>
        <Text fontWeight="bold" fontSize="xl" fontFamily="cursive">
          Tidak Ada
        </Text>
        <Text
          fontWeight="extrabold"
          fontSize="4xl"
          color="blue.300"
          textAlign="center"
          lineHeight="1.1"
        >
          Halaman yang anda Cari<br />Tidak Ada
        </Text>
        <Link href="/">Kembali Ke Halaman Awal</Link>
      </VStack>
    </Box>
  )
}
