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
import useGetData from "@/app/hooks/useGetData";
import { getBasePath } from "@/libs/utils/getBasePath";
import { IResponse } from "@/app/api/perizinan/sektor/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function InvestasiWidget() {
  const apiUrl = `${getBasePath()}/api/perizinan/sektor`;
  const { data, isLoading, isError } = useGetData<IResponse>(apiUrl.toString());

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="250px">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="250px">
        <Text color="red.500">Gagal memuat data</Text>
      </Box>
    );
  }

  const dataInvestasi = {
    labels: data?.data.map((item) => item.sektor),
    datasets: [
      {
        label: "Realisasi",
        data: data?.data.map((item) => item.jumlah),
        backgroundColor: [
          '#FACC15',
          '#1E3A8A',
          '#4B5563',
          '#A3A636',
          '#FBBF24',
          '#34D399',
          '#60A5FA',
          '#F87171',
          '#FB923C',
          '#A78BFA',
          '#10B981',
          '#F472B6',
          '#93C5FD',
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
          callback: (value: string | number) => `${value}`,
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
            size: 8,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.x}`,
        },
      },
    },
  };

  return (
    <Box bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Realisasi Investasi Per Sektor
      </Heading>
      <Box height="400px">
        <Bar data={dataInvestasi} options={optionsInvestasi} />
      </Box>
    </Box>
  );
}
