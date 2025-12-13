"use client";

import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS, ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponse} from "@/app/api/keuangan/utama/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PendapatanWidget() {
  // API URL
  const apiUrl = `${getBasePath()}/api/keuangan/utama`;
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
        <Text color="red.500">Gagal memuat data keuangan.</Text>
      </Box>
    );
  }

  const belanjaLabels = data?.data.rincian_belanja_daerah.map((item) => item.uraian) || [];
  const belanjaValues = data?.data.rincian_belanja_daerah.map((item) => item.realisasi_rp) || [];
  const pendapatanLabels = data?.data.rincian_pendapatan_daerah.map((item) => item.uraian) || [];
  const pendapatanValues = data?.data.rincian_pendapatan_daerah.map((item) => item.realisasi_rp) || [];

  // Konfigurasi Data untuk Doughnut Chart
  const belanjaChartData = {
    labels: belanjaLabels,
    datasets: [
      {
        data: belanjaValues,
        backgroundColor: ["#1E3A8A", "#15803D", "#FACC15", "#9CA3AF"],
        hoverOffset: 10,
      },
    ],
  };

  const pendapatanChartData = {
    labels: pendapatanLabels,
    datasets: [
      {
        data: pendapatanValues,
        backgroundColor: ["#1E3A8A", "#15803D", "#FACC15"],
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false, position: "bottom" },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<"doughnut">[]) => {
            return context[0].label || "";
          },
          label: (context: TooltipItem<"doughnut">) => {
            const rawValue = context.raw;
            const value = typeof rawValue === "number" ? rawValue : 0;
            const formatted = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(value);
            return `Realisasi: ${formatted}`;
          },
        },
      },
    },
    cutout: "40%",
    maintainAspectRatio: false,
  };

  return (
    <Box minH="300px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Teras Pendapatan dan Belanja Daerah
      </Heading>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box textAlign="center">
          <Box width="180px" height="200px">
            <Doughnut data={pendapatanChartData} options={pieOptions} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" mt={2} color="primary.800">
            Perbandingan Realisasi dan Anggaran KAS Pendapatan Daerah
          </Text>
        </Box>
        <Box textAlign="center">
          <Box width="180px" height="200px" mx="auto">
            <Doughnut data={belanjaChartData} options={pieOptions} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" mt={2} color="primary.800">
            Perbandingan Realisasi dan Anggaran KAS Belanja Daerah
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
