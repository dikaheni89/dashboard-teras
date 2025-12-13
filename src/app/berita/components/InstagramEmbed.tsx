'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const InstagramEmbed = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram Embed script
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        // Re-render the embed
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    } else {
      // Re-render the embed if script is already loaded
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    }
  }, [url]);

  return (
    <Box ref={containerRef} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: '540px', margin: '0 auto', padding: '0 10px' }}
      />
    </Box>
  );
};

export default InstagramEmbed;
