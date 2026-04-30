'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, Text, Code, VStack, Spinner } from '@chakra-ui/react';

type SsoProfile = {
  Auth: boolean;
  Type?: string;
  NIP?: string;
  FullName?: string;
  OtherMail?: string;
  BantenMail?: string;
  Jab_ID?: string | null;
  Jab?: string | null;
  OPD_ID?: string | null;
  OPD?: string | null;
  SubOPD_ID?: string | null;
  SubOPD?: string | null;
  PD?: string | null;
  Jab_Gol?: string | null;
  Jab_KCL?: string | null;
  Pangkat?: string | null;
  Eselon?: string | null;
  ImgAvatar?: string | null;
  [key: string]: unknown;
};

type VerifyResponse = {
  authenticated: boolean;
  message?: string;
  profile?: SsoProfile | null;
};

export default function SsoCheckPage() {
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/sso/verify', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const json = (await res.json()) as VerifyResponse;
        setData(json);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to verify SSO');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  if (loading) {
    return (
      <Box p={6}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>SSO Check</Heading>
      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}
      <VStack align="stretch" spacing={3}>
        <Text>
          Authenticated: {String(Boolean(data?.authenticated))}
        </Text>
        {data?.message && <Text>Message: {data.message}</Text>}
        {data?.profile && (
          <Box>
            <Text mb={2}>Profile:</Text>
            <Code whiteSpace="pre" display="block">
              {JSON.stringify(data.profile, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
