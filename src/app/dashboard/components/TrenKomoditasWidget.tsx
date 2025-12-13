import {Box, Heading, Spinner, Text} from "@chakra-ui/react";
import {Bar} from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import {getBasePath} from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/dashboard/tren/route";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TrenKomoditasWidget() {
  const apiUrl = `${getBasePath()}/api/dashboard/tren`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Text color="red.500">Gagal memuat data tren komoditas.</Text>
      </Box>
    );
  }

  const tanggalLabels = data?.data.map((item) => item.tanggal) || [];
  const hargaRataValues = data?.data.map((item) => item.harga_rata) || [];

  const barDataPendapatan = {
    labels: tanggalLabels,
    datasets: [
      {
        label: "Harga Rata-Rata",
        data: hargaRataValues,
        backgroundColor: "#FBBF24",
        borderRadius: 6,
      },
    ],
  };

  // Konfigurasi Opsi Chart
  const barOptions: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const rawValue = context.raw;
            const formatted = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(rawValue);
            return `Harga: ${formatted}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: "#1E3A8A",
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#1E3A8A",
          callback: (value: any) =>
            new Intl.NumberFormat("id-ID", {
              maximumFractionDigits: 0,
            }).format(value),
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box h="370px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Tren Harga Komoditas Harian
      </Heading>
      <Box height="300px">
        <Bar data={barDataPendapatan} options={barOptions} />
      </Box>
    </Box>
  );
}
