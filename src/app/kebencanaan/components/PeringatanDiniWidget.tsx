'use client';

import {Alert, AlertIcon, Box, Text} from "@chakra-ui/react";

export default function PeringatanDiniWidget() {
  return (
    <>
      <Alert
        status="error"
        my={4}
        borderRadius="lg"
        bg="red.50"
        color="red.500"
        alignItems="center"
        variant="subtle"
        px={5}
        py={3}
      >
        <AlertIcon boxSize="20px" mr={3} color="red.300" />
        <Box>
          <Text fontWeight="bold">PERINGATAN DINI</Text>
          <Text>
            Potensi hujan lebat disertai angin kencang dan petir di wilayah Pandeglang dan Lebak.
          </Text>
        </Box>
      </Alert>
    </>
  )
}
