"use client";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  TooltipItem, ChartOptions,
} from "chart.js";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponse } from "@/app/api/perizinan/sektor/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartSektor() {
  const apiUrl = `${getBasePath()}/api/perizinan/sektor`;
  const { data, isLoading } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return (
      <Box minH="200px" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box minH="200px" display="flex" justifyContent="center" alignItems="center">
        <Text>Data tidak ditemukan atau terjadi kesalahan.</Text>
      </Box>
    );
  }

  const sektorData = {
    labels: data.data.map((item: any) => item.sektor),
    datasets: [
      {
        label: "Jumlah Perizinan",
        data: data.data.map((item: any) => item.jumlah),
        backgroundColor: [
          "#1E3A8A",
          "#15803D",
          "#D97706",
          "#EF4444",
          "#4B5563",
          "#6B7280",
          "#9333EA",
          "#F59E0B",
          "#84CC16",
          "#10B981",
          "#3B82F6",
          "#8B5CF6",
          "#EC4899",
        ],
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#1E3A8A",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#CBD5E1",
        },
      },
      y: {
        ticks: {
          color: "#1E3A8A",
          font: {
            weight: "bold",
            size: 10,
          },
        },
        grid: {
          color: "#CBD5E1",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const rawValue = context.raw;
            const value = typeof rawValue === "number" ? rawValue : 0;
            const formatted = new Intl.NumberFormat("id-ID").format(value);
            return `${context.label}: ${formatted}`;
          },
        },
      },
    },
  };

  return (
    <Box bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Data Perizinan Berdasarkan Sektor
      </Heading>
      <Box height="450px">
        <Bar data={sektorData} options={barOptions} />
      </Box>
    </Box>
  );
}
