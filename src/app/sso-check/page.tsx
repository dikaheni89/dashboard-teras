'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  Heading,
  Progress,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { APP_BASE_PATH } from '@/config/client-constant';
import { clearStoredSsoSession, fetchDirectSsoSession } from '@/libs/utils/sso-client';

const DASHBOARD_PATH = `${APP_BASE_PATH}/dashboard`;
const MAX_PROGRESS_SECONDS = 10;

export default function SsoCheckPage() {
  const router = useRouter();
  const [checkingSeconds, setCheckingSeconds] = useState(0);

  const progressValue = useMemo(
    () => Math.min((checkingSeconds / MAX_PROGRESS_SECONDS) * 100, 100),
    [checkingSeconds]
  );

  useEffect(() => {
    void (async () => {
      try {
        const verifyResult = await fetchDirectSsoSession();

        if (!verifyResult.authenticated) {
          await clearStoredSsoSession();
        }
      } catch {
        await clearStoredSsoSession();
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCheckingSeconds((prev) => (prev >= MAX_PROGRESS_SECONDS ? prev : prev + 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (checkingSeconds >= MAX_PROGRESS_SECONDS) {
      router.replace(DASHBOARD_PATH);
    }
  }, [checkingSeconds, router]);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box
        w="full"
        maxW="2xl"
        bg="white"
        rounded="xl"
        shadow="lg"
        borderWidth="1px"
        p={{ base: 6, md: 8 }}
      >
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading size="lg" color="blue.700">Cek Status SSO</Heading>
            <Text mt={2} color="gray.600">
              Sistem sedang memeriksa validitas endpoint SSO dan session login Anda.
            </Text>
          </Box>

          <Flex align="center" gap={3}>
            <Spinner color="blue.500" size="lg" />
            <Box>
              <Text fontWeight="semibold">Memeriksa status Auth...</Text>
              <Text fontSize="sm" color="gray.600">
                Waktu pengecekan: {checkingSeconds} detik
              </Text>
            </Box>
          </Flex>

          <Progress value={progressValue} size="sm" colorScheme="blue" rounded="full" />
        </VStack>
      </Box>
    </Flex>
  );
}
