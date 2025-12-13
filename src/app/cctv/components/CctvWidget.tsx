'use client';

import {
  Box,
  Grid,
  VStack,
  Text,
  Divider,
  Center,
  Spinner,
  Button,
  HStack, IconButton,
} from "@chakra-ui/react";
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { useEffect, useRef, useState } from 'react';
import { getBasePath } from "@/libs/utils/getBasePath";
import { IResponse } from "@/app/api/cctv/semua/route";
import CctvKategori from "@/app/cctv/components/CctvKategori";
import {ChevronDown, Fullscreen, Minimize2} from "lucide-react";

export default function CctvWidget() {
  const apiUrl = `${getBasePath()}/api/cctv/semua`;
  const [data, setData] = useState<IResponse["data"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLCanvasElement }>({});
  const boxRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const playerInstances = useRef<{ [key: string]: JSMpeg.Player }>({});

  const initializeVideoStream = (id: string) => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const canvas = videoRefs.current[id];
        if (!canvas) {
          console.warn(`Canvas for ID ${id} not yet initialized`);
          return;
        }

        const url = `wss://cctv.bantenprov.go.id/play?id=${encodeURIComponent(id)}`;
        const player = new JSMpeg.Player(url, {
          canvas,
          autoplay: true,
          loop: true,
          audio: false,
        });
        playerInstances.current[id] = player;
      }, 100); // 100ms delay
    }
  };

  const fetchCctvData = async (page: number) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(`${apiUrl}?page=${page}`);
      if (!response.ok) {
        console.error("Failed to fetch data");
        throw new Error("Failed to fetch data");
      }
      const json: IResponse = await response.json();

      if (json.data.length > 0) {
        setData((prev) => [...prev, ...json.data]);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCctvData(1);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      data.slice(0, visibleCount).forEach((cctv) => {
        if (videoRefs.current[cctv.id]) {
          requestAnimationFrame(() => {
            initializeVideoStream(cctv.id);
          });
        }
      });
    }
  }, [data, visibleCount]);

  const handleFullscreen = (id: string) => {
    const box = boxRefs.current[id];
    if (box?.requestFullscreen) {
      box.requestFullscreen();
      setFullscreenId(id);
    } else if ((box as any)?.webkitRequestFullscreen) {
      (box as any).webkitRequestFullscreen();
      setFullscreenId(id);
    }
  };

  const handleNormalScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreenId(null);
    }
  };

  const handleLoadMore = () => {
    if (visibleCount + 4 <= data.length) {
      setVisibleCount(visibleCount + 4);
    } else {
      fetchCctvData(page + 1);
      setPage((prev) => prev + 1);
      setVisibleCount(visibleCount + 4);
    }
  };

  return (
    <>
      {isError && (
        <Center h="300px">
          <Text color="red.500">Error fetching CCTV data. Please try again later.</Text>
        </Center>
      )}
      {!isLoading && !isError && (data.length === 0) && (
        <Center h="300px">
          <Text color="gray.500">No CCTV data available.</Text>
        </Center>
      )}

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {isLoading && data.length === 0 ? (
          <Center h="300px">
            <Spinner size="lg" />
            <Text ml={4}>Loading CCTV Data...</Text>
          </Center>
        ) : (
          <>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {data.slice(0, visibleCount).map((cctv, index) => (
                  <Box
                    key={index}
                    ref={(el) => {
                      if (el) boxRefs.current[cctv.id] = el;
                    }}
                    bg="black"
                    h="200px"
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <canvas
                      ref={(el) => {
                        if (el) {
                          videoRefs.current[cctv.id] = el;
                        }
                      }}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <Text position="absolute" top={2} left={2} bg="blackAlpha.700" color="white" px={2} py={1} fontSize="xs" borderRadius="md">
                      LIVE
                    </Text>

                    <HStack spacing={2} position="absolute" top={2} right={2}>
                      {!fullscreenId && (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => handleFullscreen(cctv.id)}
                        >
                          <Fullscreen size={20} />
                        </Button>
                      )}
                      {fullscreenId === cctv.id && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={handleNormalScreen}
                        >
                          <Minimize2 size={14} />
                        </Button>
                      )}
                    </HStack>
                  </Box>
                ))}
              </Grid>

              {hasMore && (
                <Center pt={1}>
                  <IconButton
                    icon={<ChevronDown />}
                    onClick={handleLoadMore}
                    bg="transparent"
                    aria-label="Scroll down"
                  />
                </Center>
              )}
            </VStack>

            <CctvKategori />
          </>
        )}
      </Grid>
      <Box pt={6}>
        <Divider />
      </Box>
    </>
  );
}
