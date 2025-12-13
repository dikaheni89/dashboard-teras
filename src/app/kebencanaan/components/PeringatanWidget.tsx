"use client";

import {
  Box,
  Text,
  Alert,
  AlertIcon,
  Flex,
  Tag,
  Grid,
  GridItem,
  VStack,
  HStack,
  Divider,
  Icon, Image, Center, Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels, TabPanel,
} from "@chakra-ui/react";
import { FiCloud } from "react-icons/fi";
import {LuWind} from "react-icons/lu";
import {useEffect, useState} from "react";
import useGetData from "@/app/hooks/useGetData";
import {getBasePath} from "@/libs/utils/getBasePath";
import Select from "react-select";
import ListCuaca from "@/app/kebencanaan/components/ListCuaca";
import {ResponseDataAPI} from "@/app/api/bmkg/dashboard/route";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {formatDateIndonesia} from "@/libs/utils/helper";
import PeringatanDiniWidget from "@/app/kebencanaan/components/PeringatanDiniWidget";
import ListPeringatanWidget from "@/app/kebencanaan/components/ListPeringatanWidget";

dayjs.extend(utc);
dayjs.extend(timezone);

const HariList = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface Kabupaten {
  adm2: string;
  kotkab: string;
  type: string;
}

type Cuaca = {
  image: string;
  tmax: number;
  tmin: number;
  humin: number;
  humax: number;
  wd: string;
  ws: number;
  vs: number;
  weather_desc: string;
  datetime: string;
};

export default function PeringatanWidget() {
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<string | null>(null);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [dataCuaca, setDataCuaca] = useState<any>(null);
  const [dataLokasi, setDataLokasi] = useState<any>(null);
  const [isLoadingCuaca, setIsLoadingCuaca] = useState(false);
  const [cuacaHariIni, setCuacaHariIni] = useState<Cuaca | null>(null);
  const getTodayDate = () => {
    return dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const { isLoading } = useGetData<ResponseDataAPI>(`${getBasePath()}/api/bmkg/dashboard`);

  const {
    data: kabupatenList,
    isLoading: isLoadingKabupaten,
    isError: isErrorKabupaten,
  } = useGetData<Kabupaten[]>(`${getBasePath()}/api/selectdata/kabupaten`);

  useEffect(() => {
    const fetchKecamatan = async () => {
      if (!selectedKabupaten) {
        setKecamatanList([]);
        setSelectedKecamatan(null);
        return;
      }
      try {
        const response = await fetch(
          `${getBasePath()}/api/selectdata/kecamatan?adm2=${selectedKabupaten}`
        );
        if (response.ok) {
          const data = await response.json();
          setKecamatanList(data);
        } else {
          console.error("Gagal mengambil data kecamatan");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchKecamatan();
  }, [selectedKabupaten]);

  useEffect(() => {
    const fetchDesa = async () => {
      if (!selectedKecamatan) {
        setDesaList([]);
        setSelectedDesa(null);
        return;
      }
      try {
        const response = await fetch(
          `${getBasePath()}/api/selectdata/desa?adm3=${selectedKecamatan}`
        );
        if (response.ok) {
          const data = await response.json();
          setDesaList(data);
        } else {
          console.error("Gagal mengambil data desa");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDesa();
  }, [selectedKecamatan]);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
      const tanggal = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const waktu = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setCurrentTime(`${hari}, ${tanggal} pukul ${waktu}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // update setiap detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoadingCuaca(true);

      try {
        let response, result;

        if (selectedDesa) {
          response = await fetch(
            `${getBasePath()}/api/bmkg/desa?adm4=${selectedDesa}`
          );
        } else if (selectedKecamatan) {
          response = await fetch(
            `${getBasePath()}/api/bmkg/kecamatan?adm3=${selectedKecamatan}`
          );
        } else if (selectedKabupaten) {
          response = await fetch(
            `${getBasePath()}/api/bmkg/kabupaten?adm2=${selectedKabupaten}`
          );
        } else {
          setIsLoadingCuaca(false);
          response = await fetch(`${getBasePath()}/api/bmkg/kabupaten?adm2=36.73`)
        }

        if (response.ok) {
          result = await response.json();
          setDataCuaca(result.data.cuaca.slice(0, 7));
          setDataLokasi(result.data.lokasi);
        } else {
          console.error("Gagal mengambil data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoadingCuaca(false);
      }
    };

    fetchWeatherData();
  }, [selectedKabupaten, selectedKecamatan, selectedDesa]);

  useEffect(() => {
    if (dataCuaca && Array.isArray(dataCuaca) && dataCuaca.length > 0) {
      const todayDate = getTodayDate();
      const dataHariIni = dataCuaca.find((item: any) =>
        item.datetime.startsWith(todayDate)
      );


      if (dataHariIni) {
        setCuacaHariIni(dataHariIni);
      } else {
        console.warn("Tidak ditemukan data cuaca untuk hari ini");
      }
    }
  }, [dataCuaca]);

  return (
    <>
      {isLoading ? (
        <Center h="500px">
          <Spinner size="lg" />
          <Text ml={4}>Loading Memuat Data Kebencanaan...</Text>
        </Center>
      ) : (
        <Box
          position="relative"
          borderRadius={"lg"}
          overflow="hidden"
          boxShadow="md"
          bg="white"
          p={6}
        >
          {/* Header */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={2} mb={4}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                Sistem Peringatan Dini dan Cuaca Provinsi Banten
              </Text>
              <Text fontSize="sm" color="gray.600">
                Data sensor BMKG diperbarui secara real-time
              </Text>
            </Box>
            <VStack>
              <Flex align="center" gap={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {currentTime}
                </Text>
                <Tag colorScheme="green" borderRadius="full">
                  Sistem Aktif
                </Tag>
              </Flex>
              <Box textAlign={'start'} ml={44}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Sumber: BMKG
                </Text>
              </Box>
            </VStack>
          </Flex>

          {/* Alert Peringatan */}
          <PeringatanDiniWidget />

          <Box mb={6}>
            <Text mb={2} fontWeight="medium">
              Pilih Lokasi:
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
              {isErrorKabupaten ? (
                <Alert
                  status="error"
                  my={4}
                  borderRadius="lg"
                  bg="red.50"
                  color="red.500"
                  alignItems="center"
                  variant="subtle"
                  px={5}
                  py={3}
                >
                  <AlertIcon boxSize="20px" mr={3} color="red.300" />
                  <Box>
                    <Text fontWeight="bold">Error</Text>
                    <Text>
                      Gagal Mengambil Data Wilayah
                    </Text>
                  </Box>
                </Alert>
              ) : (
                <>
                  <Select
                    isLoading={isLoadingKabupaten}
                    placeholder="Pilih Kabupaten/Kota"
                    options={kabupatenList?.map((item: any) => ({
                      label: item.kotkab,
                      value: item.adm2,
                    }))}
                    onChange={(selected: any) => {
                      setSelectedKabupaten(selected?.value ?? null);
                      setSelectedKecamatan(null);
                      setSelectedDesa(null);
                    }}
                    isDisabled={isErrorKabupaten}
                  />

                  <Select
                    isLoading={kecamatanList.length === 0}
                    placeholder="Pilih Kecamatan"
                    options={kecamatanList.map((item: any) => ({
                      label: item.kecamatan,
                      value: item.adm3,
                    }))}
                    onChange={(selected: any) => {
                      setSelectedKecamatan(selected?.value ?? null);
                      setSelectedDesa(null);
                    }}
                    isDisabled={!selectedKabupaten}
                  />

                  <Select
                    isLoading={desaList.length === 0}
                    placeholder="Pilih Desa"
                    options={desaList.map((item: any) => ({
                      label: item.desa,
                      value: item.adm4,
                    }))}
                    onChange={(selected: any) => setSelectedDesa(selected?.value ?? null)}
                    isDisabled={!selectedKecamatan}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 1500,
                      }),
                    }}
                  />
                </>
              )}

            </Grid>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            {isLoadingCuaca ? (
              <Center h="300px">
                <Spinner size="lg" />
                <Text ml={20}>Loading Memuat Data Kebencanaan...</Text>
              </Center>
            ) : (
              dataCuaca && dataCuaca.length > 0 && (
                <>
                  <GridItem
                    bg="gray.50"
                    borderRadius="xl"
                    border="1px solid #E9D8FD"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                      cursor: "pointer",
                    }}
                  >
                    {/* Header */}
                    <Flex
                      align="center"
                      justify="space-between"
                      px={4}
                      py={2}
                      borderBottom="1px solid #E9D8FD"
                      bg="purple.100"
                      borderTopRadius="xl"
                    >
                      <Text fontWeight="bold" fontSize="lg" color="purple.700">
                        Kondisi Cuaca
                      </Text>
                      <Icon as={FiCloud} boxSize={5} color="purple.400" />
                    </Flex>

                    {/* Body */}
                    <VStack spacing={3} align="center" p={4}>
                      <Image
                        src={cuacaHariIni?.image}
                        boxSize="100px"
                        alt={cuacaHariIni?.weather_desc}
                      />
                      <Text fontSize="4xl" fontWeight="extrabold" color="gray.800">
                        {cuacaHariIni?.tmax}°C
                      </Text>
                      <Text fontSize="lg" color="gray.600">
                        {cuacaHariIni?.weather_desc}
                      </Text>

                      {/* Detail Info */}
                      <HStack spacing={3} mt={2}>
                        <Box
                          bg="purple.50"
                          borderRadius="md"
                          px={3}
                          py={2}
                          textAlign="center"
                          minW="80px"
                        >
                          <Text fontSize="xs" color="gray.600">
                            Kelembaban
                          </Text>
                          <Text fontWeight="bold">
                            {cuacaHariIni?.humin}% - {cuacaHariIni?.humax}%
                          </Text>
                        </Box>
                        <Box
                          bg="purple.50"
                          borderRadius="md"
                          px={3}
                          py={2}
                          textAlign="center"
                          minW="80px"
                        >
                          <Text fontSize="xs" color="gray.600">
                            Angin
                          </Text>
                          <Text fontWeight="bold">
                            {cuacaHariIni?.ws} km/j ({cuacaHariIni?.wd})
                          </Text>
                        </Box>
                        <Box
                          bg="purple.50"
                          borderRadius="md"
                          px={3}
                          py={2}
                          textAlign="center"
                          minW="80px"
                        >
                          <Text fontSize="xs" color="gray.600">
                            Jarak Pandang
                          </Text>
                          <Text fontWeight="bold">{cuacaHariIni?.vs} m</Text>
                        </Box>
                      </HStack>

                      {/* Footer Info */}
                      <Divider my={3} />
                      <Flex
                        w="full"
                        justify="space-between"
                        fontSize="md"
                        color="gray.600"
                        px={1}
                      >
                        <Text>Lokasi</Text>
                        <Text>Terakhir diperbarui</Text>
                      </Flex>
                      <Flex
                        w="full"
                        justify="space-between"
                        fontSize="md"
                        fontWeight="medium"
                        px={1}
                      >
                        <Text>{selectedDesa
                          ? dataLokasi?.desa ?? "Desa tidak ditemukan"
                          : selectedKecamatan
                            ? dataLokasi?.kecamatan ?? "Kecamatan tidak ditemukan"
                            : selectedKabupaten
                              ? dataLokasi?.kotkab ?? "Kabupaten tidak ditemukan"
                              : "Provinsi Banten"}</Text>
                        <Text>{formatDateIndonesia(cuacaHariIni?.datetime ?? "")}</Text>
                      </Flex>
                    </VStack>
                  </GridItem>

                  <GridItem
                    bg="green.50"
                    borderRadius="xl"
                    border="1px solid #C6F6D5"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                      cursor: "pointer",
                    }}
                  >
                    {/* Header */}
                    <Flex
                      align="center"
                      justify="space-between"
                      px={4}
                      py={2}
                      borderBottom="1px solid #C6F6D5"
                      bg="green.100"
                      borderTopRadius="xl"
                    >
                      <Text fontWeight="bold" fontSize="md" color="teal.700">
                        Curah Hujan
                      </Text>
                      <Icon as={FiCloud} boxSize={5} color="teal.400" />
                    </Flex>

                    {/* Tabs */}
                    <Tabs
                      variant="unstyled"
                      index={selectedTab}
                      onChange={(index) => setSelectedTab(index)}
                    >
                      <TabList>
                        {HariList.map((hari, index) => (
                          <Tab
                            key={index}
                            _selected={{ color: "white", bg: "teal.400" }}
                            _hover={{ bg: "teal.400" }}
                          >
                            {hari}
                          </Tab>
                        ))}
                      </TabList>

                      <TabPanels>
                        {dataCuaca?.map((item: any, index: number) => (
                          <TabPanel key={index}>
                            <VStack spacing={3} align="start" p={4}>
                              <Flex justify="space-between" w="full" align="start">
                                <Box>
                                  <Text fontSize="4xl" fontWeight="bold" color="gray.800">
                                    {item.tcc} mm
                                  </Text>
                                  <Text fontSize="md" color="gray.500">
                                    {new Date(item.datetime).toLocaleDateString()}
                                  </Text>
                                </Box>
                                <Box textAlign="right">
                                  <Text fontWeight="medium" fontSize="md" color="gray.800">
                                    {item.weather_desc}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Intensitas
                                  </Text>
                                </Box>
                              </Flex>

                              <Divider my={1} />

                              <Flex
                                w="full"
                                justify="space-between"
                                fontSize="md"
                                color="gray.600"
                              >
                                <Box>
                                  <Text fontWeight="medium">Lokasi</Text>
                                  <Text>
                                    {selectedDesa
                                      ? dataLokasi?.desa ?? "Desa tidak ditemukan"
                                      : selectedKecamatan
                                        ? dataLokasi?.kecamatan ?? "Kecamatan tidak ditemukan"
                                        : selectedKabupaten
                                          ? dataLokasi?.kotkab ?? "Kabupaten tidak ditemukan"
                                          : "Provinsi Banten"}
                                  </Text>
                                </Box>
                                <Box textAlign="right">
                                  <Text fontWeight="medium">Terakhir diperbarui</Text>
                                  <Text>
                                    {formatDateIndonesia(cuacaHariIni?.datetime ?? "")} WIB
                                  </Text>
                                </Box>
                              </Flex>
                            </VStack>
                          </TabPanel>
                        ))}
                      </TabPanels>
                    </Tabs>
                  </GridItem>

                  <GridItem
                    bg="orange.50"
                    borderRadius="xl"
                    border="1px solid #FEEBC8"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                      cursor: "pointer",
                    }}
                  >
                    {/* Header */}
                    <Flex
                      align="center"
                      justify="space-between"
                      px={4}
                      py={2}
                      borderBottom="1px solid #FEEBC8"
                      bg="orange.100"
                      borderTopRadius="xl"
                    >
                      <Text fontWeight="bold" fontSize="md" color="orange.700">
                        Arah dan Kecepatan Angin
                      </Text>
                      <Icon as={LuWind} boxSize={5} color="orange.400" />
                    </Flex>

                    {/* Body */}
                    <VStack spacing={4} align="center" p={4}>
                      {/* Kompas */}
                      <Box
                        width="100px"
                        height="100px"
                        border="2px solid #E2E8F0"
                        borderRadius="full"
                        position="relative"
                      >
                        {/* Jarum Arah */}
                        <Box
                          width="2px"
                          height="40px"
                          bg="orange.500"
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform={`translate(-50%, -100%) rotate(${cuacaHariIni?.wd === "SE" ? 135 : 45}deg)`}
                          transformOrigin="bottom center"
                          zIndex={1}
                        />

                        {/* Titik tengah (knob) */}
                        <Box
                          width="10px"
                          height="10px"
                          bg="orange.500"
                          borderRadius="full"
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          zIndex={2}
                        />

                        {/* Label arah mata angin */}
                        <Text position="absolute" top="6px" left="50%" transform="translateX(-50%)" fontSize="xs">U</Text>
                        <Text position="absolute" bottom="6px" left="50%" transform="translateX(-50%)" fontSize="xs">S</Text>
                        <Text position="absolute" left="6px" top="50%" transform="translateY(-50%)" fontSize="xs">B</Text>
                        <Text position="absolute" right="6px" top="50%" transform="translateY(-50%)" fontSize="xs">T</Text>
                      </Box>

                      {/* Arah & Kecepatan */}
                      <HStack spacing={4} pt={1}>
                        <Box
                          bg="orange.100"
                          px={4}
                          py={2}
                          borderRadius="md"
                          textAlign="center"
                          minW="130px"
                        >
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Arah Angin
                          </Text>
                          <Text fontWeight="bold">
                            {cuacaHariIni?.wd} ({cuacaHariIni?.ws} km/jam)
                          </Text>
                        </Box>
                        <Box
                          bg="orange.100"
                          px={4}
                          py={2}
                          borderRadius="md"
                          textAlign="center"
                          minW="130px"
                        >
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Kecepatan
                          </Text>
                          <Text fontWeight="bold">{cuacaHariIni?.ws} km/jam</Text>
                        </Box>
                      </HStack>

                      {/* Footer */}
                      <Divider my={2} />
                      <Flex
                        w="full"
                        justify="space-between"
                        fontSize="md"
                        color="gray.600"
                        px={1}
                      >
                        <Box>
                          <Text fontWeight="medium">Lokasi</Text>
                          <Text>{selectedDesa
                            ? dataLokasi?.desa ?? "Desa tidak ditemukan"
                            : selectedKecamatan
                              ? dataLokasi?.kecamatan ?? "Kecamatan tidak ditemukan"
                              : selectedKabupaten
                                ? dataLokasi?.kotkab ?? "Kabupaten tidak ditemukan"
                                : "Provinsi Banten"}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text fontWeight="medium">Terakhir diperbarui</Text>
                          <Text>
                            {formatDateIndonesia(cuacaHariIni?.datetime ?? "")} WIB
                          </Text>
                        </Box>
                      </Flex>
                    </VStack>
                  </GridItem>
                </>
              )
            )}
          </Grid>

          {/* Daftar Peringatan Dini */}
          <ListPeringatanWidget />

          {/*List Cuaca*/}
          <ListCuaca />
        </Box>
      )}
    </>
  );
}
