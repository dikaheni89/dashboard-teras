import {Box, Button, Center, Flex, Icon, Image, Text} from "@chakra-ui/react";
import Slider from "react-slick";
import {FiCloud} from "react-icons/fi";
import {LuWind} from "react-icons/lu";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useGetData from "@/app/hooks/useGetData";
import {ResponseDataAPI} from "@/app/api/bmkg/dashboard/route";
import {getBasePath} from "@/libs/utils/getBasePath";
import {useEffect, useState} from "react";

const settings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function ListCuaca() {
  const { isError, data } = useGetData<ResponseDataAPI>(`${getBasePath()}/api/bmkg/dashboard`);
  const [forecast, setForecast] = useState<Array<{
    day: string;
    icon: string;
    color: string;
    temp: string;
    condition: string;
    rain: string;
  }>>([]);

  useEffect(() => {
    if (data && data.data) {
      const formattedData = data.data.slice(0, 7).map((item, index) => ({
        day: daysOfWeek[index],
        icon: item.cuaca.image,
        color: "blue.500",
        temp: `${item.cuaca.tmax}°C / ${item.cuaca.tmin}°C`,
        condition: item.cuaca.weather_desc,
        rain: `${item.cuaca.humax}%`,
      }));
      setForecast(formattedData);
    }
  }, [data]);

  return (
    <>
      {isError && (
        <Center h="300px">
          <Text color="red.500">Gagal Mengambil Data.</Text>
        </Center>
      )}
      <Box mt={12}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Prakiraan Cuaca
        </Text>

        <Slider {...settings}>
          {forecast.map((item, index) => (
            <Box key={index} px={2}>
              <Box
                bg="blue.50"
                borderRadius="xl"
                p={4}
                minW="250px"
                minH="350px"
                textAlign="center"
                boxShadow="sm"
              >
                <Text fontWeight="medium" color="gray.600" mb={2}>
                  {item.day}
                </Text>
                <Center>
                  <Image
                    src={item.icon}
                    alt={item.condition}
                    boxSize="150px"
                    objectFit="contain"
                  />
                </Center>
                <Text fontSize="lg" fontWeight="bold">{item.temp}</Text>
                <Text fontSize="lg" color="gray.600">{item.condition}</Text>
                <Text fontSize="lg" color="gray.500">
                  Curah hujan: {item.rain}
                </Text>
              </Box>
            </Box>
          ))}
        </Slider>

        {/* Tombol Aksi */}
        <Flex mt={6} justify="center" gap={4} flexWrap="wrap">
          <Button colorScheme="blue" leftIcon={<Icon as={FiCloud} />}>
            Perbarui Data
          </Button>
          <Button leftIcon={<Icon as={LuWind} />} colorScheme="gray">
            Pengaturan
          </Button>
        </Flex>
      </Box>
    </>
  );
}
