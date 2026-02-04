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
import {IResponseStatus} from "@/app/api/kesehatan/status/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TrenKomoditasWidget() {
  const apiUrl = `${getBasePath()}/api/kesehatan/status`;
  const { data, isLoading, isError } = useGetData<IResponseStatus>(apiUrl);

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
        <Text color="red.500">Gagal memuat data status tempat tidur.</Text>
      </Box>
    );
  }

  const labels = data?.data.map((item, index) => item.status || `Status ${index + 1}`) || [];
  const values = data?.data.map((item) => item.jumlah) || [];

  // Tentukan warna berdasarkan status
  const backgroundColors = data?.data.map((item) => {
    const status = item.status?.toUpperCase() || "";
    if (status.includes("KOSONG")) {
      return "#10B981"; // Hijau untuk Kosong
    }
    if (status.includes("ISI") || status.includes("TERISI")) {
      return "#EF4444"; // Merah untuk Isi
    }
    return "#FBBF24"; // Default Kuning
  }) || [];

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Jumlah",
        data: values,
        backgroundColor: backgroundColors,
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
            return `Jumlah: ${context.raw}`;
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
          callback: (value: any) => value,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box h="370px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Status Tempat Tidur
      </Heading>
      <Box height="300px">
        <Bar data={barData} options={barOptions} />
      </Box>
    </Box>
  );
}
