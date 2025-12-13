import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, APP_OWNER } from "@/config/client-constant";
import {Providers} from "@/app/providers";
import SsoGuard from "@/components/SsoGuard";
import {Box, CSSReset, Text} from "@chakra-ui/react";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: {
    name: "Handika Junior",
    url: "https://handika.online"
  },
  creator: "Handika Junior",
  publisher: APP_OWNER,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Providers>
        <CSSReset/>
          <SsoGuard/>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <LayoutDetector/>
          )}
      </Providers>
      </body>
    </html>
  );
}

function LayoutDetector() {
  return (
    <Box
      position={'fixed'}
      top={6}
      left={6}
      zIndex={1000}
      background={'primary.main'}
      color={'white'}
      fontSize={'xl'}
      fontWeight={'semibold'}
      textAlign={'center'}
      rounded={'full'}
      p={4}
    >
      <Text color={'gray.50'} display={{ base: 'block', sm: 'none' }}>XS</Text>
      <Text color={'gray.50'} display={{ base: 'none', sm: 'block', md: 'none' }}>SM</Text>
      <Text color={'gray.50'} display={{ base: 'none', md: 'block', lg: 'none' }}>MD</Text>
      <Text color={'gray.50'} display={{ base: 'none', lg: 'block', xl: 'none' }}>LG</Text>
      <Text color={'gray.50'} display={{ base: 'none', xl: 'block', '2xl': 'none' }}>XL</Text>
      <Text color={'gray.50'} display={{ base: 'none', '2xl': 'block' }}>2XL</Text>
    </Box>
  )
}
