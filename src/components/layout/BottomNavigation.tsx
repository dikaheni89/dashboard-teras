'use client';

import {
  Box,
  Button,
  Flex,
  IconButton, Portal,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BottomNavigation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSubmenu, setShowSubmenu] = useState(false);
  const buttonRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const links = [
    { label: 'Teras Keuangan', href: '/belanja' },
    { label: 'Teras Pendapatan', href: '/pendapatan' },
    { label: 'Teras Pangan', href: '/ketapang' },
    { label: 'Teras Perizinan', href: '/perizinan' },
    { label: 'Teras Kependudukan', href: '/kependudukan' },
    { label: 'Teras Media', href: '/berita' },
    { label: 'Teras CCTV', href: '/cctv' },
    { label: 'Teras BMKG', href: '/kebencanaan' },
    { label: 'Teras Kesehatan', href: '/kesehatan' },
    { label: 'Teras Ketenagakerjaan', href: '/tenagakerja' },
    { label: 'Teras SP4N Lapor', href: '/span' },
    { label: 'Teras Infrastruktur', href: '/infrastruktur' },
    { label: 'Teras Kepegawaian', href: '/kepegawaian' },
    { label: 'Teras Kinerja', href: '/kinerja' },
    { label: 'Teras Pendidikan', href: '/pendidikan' },
    { label: 'Teras Pariwisata', href: '/pariwisata' },
    { label: 'Teras Regulasi', href: '/regulasi' },
    { label: 'Teras Lingkungan', href: '/lingkungan' },
    { label: 'Teras PPID', href: '/ppid' },
  ];

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleHover = (index: number, label: string) => {
    if (label === 'Teras Kesehatan') {
      const buttonEl = buttonRefs.current[index];
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        setSubmenuPosition({ x: rect.left, y: rect.top });
        setShowSubmenu(true);
      }
    }
  };

  const handleClick = (index: number, label: string) => {
    if (label === 'Teras Kesehatan') {
      const buttonEl = buttonRefs.current[index];
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        setSubmenuPosition({ x: rect.left, y: rect.top });
        setShowSubmenu((prev) => !prev);
      }
    }
  };

  const submenuVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box position="fixed" bottom={0} width="100%" height={110} bg="#a3cad8" py={6} px={2} boxShadow="xl" zIndex={1000}>
      <Flex align="center" justify="space-between">
        <Link href={'https://layanan.bantenprov.go.id/pemerintahan'}>
          <Box flexShrink={0} pl={14} display={{ base: 'none', md: 'block' }}>
            <Image src="/static/dashbor-logo.png" alt="Logo" width={250} height={120} />
          </Box>
        </Link>

        <Flex
          align="center"
          flex="1"
          overflow="hidden"
          ml={4}
          pl={links.length <= 5 ? 44 : 20}
          position="relative"
          width={links.length < 5 ? `${120 * links.length}px` : '50%'}
        >
          {links.length > 5 && (
            <IconButton
              aria-label="Scroll left"
              height="100"
              icon={<ChevronLeftIcon />}
              onClick={() => scroll('left')}
              colorScheme="blue"
              rounded="lg"
              size="sm"
              position="absolute"
              left={20}
              zIndex={10}
            />
          )}

          <Box
            ref={scrollRef}
            overflowX="auto"
            display="flex"
            gap={2}
            px={8}
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {links.map((link, i) => {
              const isKesehatan = link.label === 'Teras Kesehatan';

              return (
                <Box
                  key={i}
                  ref={(el) => { buttonRefs.current[i] = el }}
                  onMouseEnter={() => handleHover(i, link.label)}
                  onMouseLeave={() => {
                    submenuTimeoutRef.current = setTimeout(() => {
                      setShowSubmenu(false);
                    }, 150);
                  }}
                  onClick={() => handleClick(i, link.label)}
                  style={{ cursor: isKesehatan ? 'pointer' : undefined }}
                >
                  {isKesehatan ? (
                    <Button
                      fontSize="sm"
                      bg="#cbe4f1"
                      color="gray.700"
                      minW="150px"
                      height="60px"
                      textAlign="center"
                      whiteSpace="normal"
                      borderRadius="md"
                      _hover={{ bg: 'blue.200' }}
                      cursor="default"
                    >
                      {link.label}
                    </Button>
                  ) : (
                    <Button
                      as={Link}
                      href={link.href}
                      fontSize="sm"
                      bg="#cbe4f1"
                      color="gray.700"
                      minW="150px"
                      height="60px"
                      textAlign="center"
                      whiteSpace="normal"
                      borderRadius="md"
                      _hover={{ bg: 'blue.200' }}
                    >
                      {link.label}
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>

          {links.length > 5 && (
            <IconButton
              aria-label="Scroll right"
              height="100"
              icon={<ChevronRightIcon />}
              onClick={() => scroll('right')}
              colorScheme="blue"
              size="sm"
              position="absolute"
              right={0}
              zIndex={10}
            />
          )}

          {showSubmenu && (
            <Portal>
              <motion.div
                className="submenu"
                style={{
                  position: 'fixed',
                  left: submenuPosition.x,
                  top: submenuPosition.y - 140,
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  width: '8.3%',
                  background: 'transparent',
                }}
                variants={submenuVariants}
                initial="hidden"
                animate="visible"
                onMouseLeave={(e) => {
                  const to = e.relatedTarget as HTMLElement;
                  if (!to?.closest('.chakra-button')) {
                    setShowSubmenu(false);
                  }
                }}
                onMouseEnter={() => {
                  if (submenuTimeoutRef.current) {
                    clearTimeout(submenuTimeoutRef.current);
                  }
                }}
              >
                <motion.button
                  variants={buttonVariants}
                >
                  <Button
                    as={Link}
                    href="/malimping"
                    size="md"
                    width="160px"
                    height="60px"
                    fontSize="sm"
                    bg="#cbe4f1"
                    color="gray.700"
                    borderRadius="md"
                    _hover={{ bg: 'blue.200' }}
                    w="100%"
                  >
                    RSUD Malimping
                  </Button>
                </motion.button>

                <motion.button
                  variants={buttonVariants}>
                  <Button
                    as={Link}
                    href="/kesehatan"
                    size="md"
                    width="160px"
                    height="60px"
                    fontSize="sm"
                    bg="#cbe4f1"
                    color="gray.700"
                    borderRadius="md"
                    _hover={{ bg: 'blue.200' }}
                    w="100%"
                  >
                    RSUD Banten
                  </Button>
                </motion.button>
              </motion.div>
            </Portal>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
