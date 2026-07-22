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
  HStack,
  IconButton,
} from '@chakra-ui/react';
import Hls from 'hls.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getBasePath } from '@/libs/utils/getBasePath';
import { IResponse } from '@/app/api/cctv/semua/route';
import CctvKategori from '@/app/cctv/components/CctvKategori';
import { ChevronDown, Fullscreen, Minimize2 } from 'lucide-react';

export default function CctvWidget() {
  const apiUrl = `${getBasePath()}/api/cctv/semua`;
  const [data, setData] = useState<IResponse["data"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hlsInstances = useRef<Record<string, Hls>>({});
  const initializedStreams = useRef<Record<string, boolean>>({});
  const [streamState, setStreamState] = useState<
    Record<string, { isLoading: boolean; isError: boolean }>
  >({});

  const setStreamStateForId = useCallback(
    (id: string, next: Partial<{ isLoading: boolean; isError: boolean }>) => {
      setStreamState((prev) => {
        const existing = prev[id] || { isLoading: false, isError: false };
        return { ...prev, [id]: { ...existing, ...next } };
      });
    },
    []
  );

  const resolveStreamCandidates = useCallback((itemId: string) => {
    const baseURL = getBasePath() || '';
    const normalizedBase = String(baseURL).replace(/\/$/, '');
    const streamPath = `/stream-cctv/${encodeURIComponent(itemId)}/index.m3u8`;
    const urls: string[] = [];
    const pushUnique = (u: string) => {
      const cleaned = String(u || '').trim();
      if (!cleaned) return;
      if (!urls.includes(cleaned)) urls.push(cleaned);
    };

    pushUnique(`${normalizedBase}${streamPath}`);

    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/$/, '');
      if (normalizedBase.startsWith('/')) {
        pushUnique(`${origin}${normalizedBase}${streamPath}`);
      } else if (!normalizedBase) {
        pushUnique(`${origin}${streamPath}`);
      }
    }

    pushUnique(streamPath);

    return urls;
  }, []);

  const destroyStream = useCallback((id: string) => {
    const existing = hlsInstances.current[id];
    if (existing) {
      existing.destroy();
      delete hlsInstances.current[id];
    }

    delete initializedStreams.current[id];

    const video = videoRefs.current[id];
    if (video) {
      try {
        video.pause();
      } catch {}
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  const resolveStreamUrl = useCallback((id: string) => {
    return `https://cctv.bantenprov.go.id/service/stream-cctv/${encodeURIComponent(id)}/index.m3u8`;
  }, []);

  const initializeVideoStream = useCallback(
  (id: string) => {
    if (initializedStreams.current[id]) return;

    const video = videoRefs.current[id];

    if (!video) {
      setTimeout(() => initializeVideoStream(id), 100);
      return;
    }

    destroyStream(id);

    const hls = new Hls({
      lowLatencyMode: true,
      enableWorker: true,
    });

    hlsInstances.current[id] = hls;
    initializedStreams.current[id] = true;

    setStreamStateForId(id, {
      isLoading: true,
      isError: false,
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setStreamStateForId(id, {
        isLoading: false,
        isError: false,
      });

      video.play().catch(console.error);
    });

    hls.on(Hls.Events.ERROR, (_event, data) => {

      if (!data.fatal) return;

      switch (data.type) {

        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;

        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;

        default:
          destroyStream(id);

          setStreamStateForId(id, {
            isLoading: false,
            isError: true,
          });
      }

    });

    hls.attachMedia(video);

    hls.loadSource(resolveStreamUrl(id));

    const url = resolveStreamUrl(id);

    hls.loadSource(url);

  },
  [destroyStream, resolveStreamUrl, setStreamStateForId]
);


  const fetchCctvData = useCallback(async (page: number) => {
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
  }, [apiUrl]);

  useEffect(() => {
    fetchCctvData(1);
  }, [fetchCctvData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    data.slice(0, visibleCount).forEach((cctv) => {
      requestAnimationFrame(() => {
        initializeVideoStream(cctv.id);
      });
    });
  }, [data, initializeVideoStream, visibleCount]);

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
    setVisibleCount((prev) => {
      const nextVisible = prev + 4;
      if (nextVisible > data.length && hasMore) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchCctvData(nextPage);
          return nextPage;
        });
      }
      return nextVisible;
    });
  };

  const destroyAllStreams = useCallback(() => {
    Object.keys(hlsInstances.current).forEach((id) => destroyStream(id));
  }, [destroyStream]);

  useEffect(() => {
    return () => {
      destroyAllStreams();
    };
  }, [destroyAllStreams]);

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
                    <Box position="absolute" inset={0}>
                      <video
                        ref={(el) => {
                          if (el) {
                            videoRefs.current[cctv.id] = el;
                          }
                        }}
                        muted
                        playsInline
                        autoPlay
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    {!!streamState[cctv.id]?.isLoading && (
                      <Center position="absolute" inset={0} bg="blackAlpha.600" zIndex={2}>
                        <Spinner size="sm" color="white" />
                      </Center>
                    )}
                    {!!streamState[cctv.id]?.isError && (
                      <Center position="absolute" inset={0} bg="blackAlpha.600" zIndex={2}>
                        <Text color="red.300" fontSize="sm">
                          Gagal memuat stream
                        </Text>
                      </Center>
                    )}
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
