'use client';

import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Button,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { HiVideoCamera } from 'react-icons/hi';
import { Fullscreen, Minimize2 } from 'lucide-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';
import {Area, CCTV, IResponse} from '@/app/api/cctv/kategori/route';
import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from "hls.js";

export default function CctvKategori() {
  const apiUrl = `${getBasePath()}/api/cctv/kategori`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [isErrorStream, setIsErrorStream] = useState(false);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const boxRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const hlsInstances = useRef<Record<string, Hls>>({});

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

  const handleOpenModal = (cctv: any) => {
    setSelectedArea(cctv);
    onOpen();
  };

  const handleClose = () => {
    if (selectedArea) {
      hlsInstances.current[selectedArea.id]?.destroy();
      delete hlsInstances.current[selectedArea.id];
    }
    onClose();
    setIsLoadingStream(false);
    setIsErrorStream(false);
  };

  const resolveStreamUrl = useCallback((id: string) => {
    return `https://cctv.bantenprov.go.id/service/stream-cctv/${id}/index.m3u8`;
  }, []);

  const initializeVideoStream = useCallback((id: string) => {

    const video = videoRefs.current[id];

    if (!video) {
        setTimeout(() => initializeVideoStream(id), 100);
        return;
    }

    if (hlsInstances.current[id]) {
        hlsInstances.current[id].destroy();
        delete hlsInstances.current[id];
    }

    setIsLoadingStream(true);

    if (Hls.isSupported()) {

        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });

        hlsInstances.current[id] = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {

            setIsLoadingStream(false);
            setIsErrorStream(false);

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
                    setIsLoadingStream(false);
                    setIsErrorStream(true);
                    hls.destroy();

            }

        });

        hls.loadSource(resolveStreamUrl(id));

        hls.attachMedia(video);

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {

        video.src = resolveStreamUrl(id);

        video.play();

    }

}, [resolveStreamUrl]);

  useEffect(() => {
    if (isOpen && selectedArea) {
      setTimeout(() => {
        initializeVideoStream(selectedArea.id);
      }, 300);
    }
  }, [isOpen, selectedArea, initializeVideoStream]);

  useEffect(() => {
  const id = selectedArea?.id;

  return () => {
    if (!id) return;

    const hls = hlsInstances.current[id];

    if (hls) {
      try {
        hls.destroy();
      } catch (err) {
        console.error("Failed to destroy HLS:", err);
      } finally {
        delete hlsInstances.current[id];
      }
    }
  };
}, [selectedArea]);

  const getFilteredAreas = (): Area[] => {
    if (!data?.data) return [];

    return data.data
      .map((area: Area) => ({
        ...area,
        cctvs: area.cctvs.filter((cctv: CCTV) =>
          cctv.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((area) => area.cctvs.length > 0);
  };

  const filteredAreas = getFilteredAreas();

  return (
    <VStack spacing={4} align="stretch">
      <Box bg="white" p={4} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4} color="blue.800">
          Lokasi CCTV
        </Heading>
        <Input
          placeholder="Cari nama CCTV..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mb={4}
          maxW="xl"
          bg="gray.50"
        />

        {isLoading ? (
          <Center py={6}>
            <Text color="gray.500">Loading CCTV data...</Text>
          </Center>
        ) : isError ? (
          <Center py={6}>
            <Text color="red.500">Gagal memuat data CCTV. Silakan coba lagi.</Text>
          </Center>
        ) : filteredAreas.length === 0 ? (
          <Center py={6}>
            <Text color="gray.500">Tidak ada CCTV ditemukan.</Text>
          </Center>
        ) : (
          <Accordion allowMultiple>
            {filteredAreas.map((area) => (
              <AccordionItem key={area.uuid}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {area.area}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {area.cctvs.map((cctv) => (
                    <HStack
                      key={cctv.id}
                      spacing={2}
                      onClick={() => handleOpenModal(cctv)}
                      cursor="pointer"
                      _hover={{ bg: 'gray.100' }}
                      p={2}
                      borderRadius="md"
                    >
                      <Icon as={HiVideoCamera} boxSize={6} color="blue.600" />
                      <Box>
                        <Text fontWeight="semibold">{cctv.name}</Text>
                        <Text fontSize="xs" color="green.500">
                          Kondisi: {cctv.kondisi}
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Live CCTV - {selectedArea?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w="100%"
              h="80vh"
              bg="black"
              borderRadius="md"
              position="relative"
              overflow="hidden"
              ref={(el) => {
                if (el && selectedArea) {
                  boxRefs.current[selectedArea.id] = el;
                }
              }}
            >
              {isLoadingStream && (
                <Center h="100%">
                  <Spinner size="xl" color="white" />
                </Center>
              )}
              {isErrorStream && (
                <Center h="100%">
                  <Text color="red.500">⚠️ Gagal memuat video stream.</Text>
                </Center>
              )}
              <video
                  ref={(el) => {
                      if (el && selectedArea) {
                          videoRefs.current[selectedArea.id] = el;
                      }
                  }}
                  muted
                  autoPlay
                  controls
                  playsInline
                  style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "black"
                  }}
              />
              <Button
                size="sm"
                colorScheme="blue"
                position="absolute"
                top="5px"
                right="5px"
                onClick={() =>
                  fullscreenId ? handleNormalScreen() : handleFullscreen(selectedArea.id)
                }
              >
                {fullscreenId ? <Minimize2 size={16} /> : <Fullscreen size={16} />}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
