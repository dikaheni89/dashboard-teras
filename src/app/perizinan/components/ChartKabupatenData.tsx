"use client";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartOptions,
} from "chart.js";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponse } from "@/app/api/perizinan/kabupatendata/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartKabupatenData() {
  const apiUrl = `${getBasePath()}/api/perizinan/kabupatendata`;
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

  const dataInvestasi = {
    labels: data.data.map((item: any) => item.kab_kota),
    datasets: [
      {
        label: "Jumlah Investasi",
        data: data.data.map((item: any) => item.jumlah),
        backgroundColor: [
          "#FACC15",
          "#1E3A8A",
          "#4B5563",
          "#A3A636",
          "#FBBF24",
          "#34D399",
          "#6366F1",
          "#E11D48",
          "#FB923C",
          "#60A5FA",
        ],
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const optionsInvestasi: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => `${value} unit`,
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
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.x} unit`,
        },
      },
    },
  };

  return (
    <>
      <Box bg="primary.50" p={4} borderRadius="lg" shadow="md">
        <Heading size="sm" mb={4} color="primary.800">
          Data Perizinan Berdasarkan Kabupaten/Kota
        </Heading>
        <Box height="450px">
          <Bar data={dataInvestasi} options={optionsInvestasi} />
        </Box>
      </Box>
    </>
  );
}
