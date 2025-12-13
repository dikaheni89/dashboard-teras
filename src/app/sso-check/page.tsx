'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, Text, Code, VStack, Spinner } from '@chakra-ui/react';

type VerifyResponse = {
  authenticated: boolean;
  message?: string;
  profile?: any;
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
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || 'Failed to verify SSO');
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
          Authenticated: {String(Boolean((data as any)?.authenticated))}
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

