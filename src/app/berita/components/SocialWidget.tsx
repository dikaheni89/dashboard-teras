'use client';

import { Grid, GridItem, Box, Button, VStack, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
let isSDKLoaded = false;
export default function SocialWidget() {
  const tiktokRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!document.getElementById('tiktok-embed-script')) {
      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).tiktok && (window as any).tiktok.Embeds) {
            (window as any).tiktok.Embeds.process();
          }
        }, 1000);
      };
      document.body.appendChild(script);
    } else {
      if ((window as any).tiktok && (window as any).tiktok.Embeds) {
        (window as any).tiktok.Embeds.process();
      }
    }
    const observer = new MutationObserver(() => {
      const tikTokElement = tiktokRef.current?.querySelector(".tiktok-embed");
      if (tikTokElement) {
        setLoading(false);
        observer.disconnect();
      }
    });

    observer.observe(tiktokRef.current as HTMLElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const loadFacebookSDK = () => {
    if (document.getElementById('facebook-jssdk') || isSDKLoaded) {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    script.onload = () => {
      isSDKLoaded = true;
      if (window.FB) {
        window.FB.init({
          appId: 'YOUR_APP_ID',
          xfbml: true,
          version: 'v15.0',
        });
        window.FB.XFBML.parse();
        setLoading(false);
      }
    };

    script.onerror = () => {
      console.error('Gagal memuat Facebook SDK');
      setError(true);
    };
  };

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} p={4}>
      {/* TikTok Embed */}
      <GridItem>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" ref={tiktokRef}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Spinner size="lg" />
            </Box>
          )}
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@pemprovbanten"
            data-unique-id="pemprovbanten"
            data-embed-from="embed_page"
            data-embed-type="creator"
            style={{ paddingBottom: '10px', width: '100%', display: loading ? 'none' : 'block' }}
          >
            <section>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.tiktok.com/@pemprovbanten?refer=creator_embed"
              >
                @pemprovbanten
              </a>
            </section>
          </blockquote>
        </Box>
      </GridItem>

      {/* Instagram & YouTube Button */}
      <GridItem>
        <VStack spacing={4}>
          <Button
            as="a"
            href="https://www.instagram.com/pemprov.banten"
            target="_blank"
            colorScheme="blue"
            variant="outline"
            width="100%"
          >
            Open Instagram @pemprov.banten
          </Button>
          <Button
            as="a"
            href="https://www.x.com/banten_pemprov"
            target="_blank"
            colorScheme="blue"
            variant="outline"
            width="100%"
          >
            Open X @banten_pemprov
          </Button>
          <Button
            as="a"
            href="https://www.youtube.com/@pemerintahprovinsibanten"
            target="_blank"
            colorScheme="blue"
            variant="outline"
            width="100%"
          >
            Open Youtube @pemerintahprovinsibanten
          </Button>
        </VStack>
      </GridItem>

      <GridItem>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          {loading && !error && (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
              <Spinner size="lg" />
            </Box>
          )}

          {error && (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
              <Text color="red.500">Facebook Embed gagal dimuat.</Text>
            </Box>
          )}

          {!loading && !error && (
            <div
              className="fb-page"
              data-href="https://www.facebook.com/bantenpemprov"
              data-tabs="timeline"
              data-width="500"
              data-height="500"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            />
          )}
        </Box>
      </GridItem>
    </Grid>
  );
}
