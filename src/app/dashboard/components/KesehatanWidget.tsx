"use client";

import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import {IResponseStatus} from "@/app/api/kesehatan/status/route";
import {IResponsePasien} from "@/app/api/kesehatan/pasienperdepartment/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function KesehatanWidget() {
  const apiUrlStatus = `${getBasePath()}/api/kesehatan/status`;
  const apiUrlPasien = `${getBasePath()}/api/kesehatan/pasienperdepartment`;

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    isError: isErrorStatus,
  } = useGetData<IResponseStatus>(apiUrlStatus.toString());

  const {
    data: pasienData,
    isLoading: isLoadingPasien,
    isError: isErrorPasien,
  } = useGetData<IResponsePasien>(apiUrlPasien.toString());

  if (isLoadingStatus || isLoadingPasien) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isErrorStatus || isErrorPasien) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Text color="red.500">Gagal memuat data kesehatan.</Text>
      </Box>
    );
  }

  const statusLabels = statusData?.data.map((item) => item.status) || [];
  const statusValues = statusData?.data.map((item) => item.jumlah) || [];

  const pasienLabels = pasienData?.data.map((item) => item.departemen) || [];
  const pasienValues = pasienData?.data.map((item) => item.jumlah) || [];

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusValues,
        backgroundColor: ["#1E3A8A", "#15803D", "#FACC15", "#9CA3AF"],
        hoverOffset: 10,
      },
    ],
  };

  const pasienChartData = {
    labels: pasienLabels,
    datasets: [
      {
        data: pasienValues,
        backgroundColor: ["#1E3A8A", "#15803D", "#FACC15", "#9CA3AF", "#D97706"],
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<"doughnut">[]) => {
            return context[0].label || "";
          },
          label: (context: TooltipItem<"doughnut">) => {
            const rawValue = context.raw;
            const value = typeof rawValue === "number" ? rawValue : 0;
            const formatted = new Intl.NumberFormat("id-ID").format(value);
            return `${formatted} Pasien`;
          },
        },
      },
    },
    cutout: "40%",
    maintainAspectRatio: false,
  };

  return (
    <Box minH="200px" bg="primary.50" p={4} borderRadius="lg" shadow="md">
      <Heading size="sm" mb={4} color="primary.800">
        Teras Kesehatan
      </Heading>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box textAlign="center">
          <Box width="150px" height="150px">
            <Doughnut data={statusChartData} options={pieOptions} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" mt={2} color="primary.800">
            Status Tempat Tidur
          </Text>
        </Box>
        <Box textAlign="center">
          <Box width="150px" height="150px" mx="auto">
            <Doughnut data={pasienChartData} options={pieOptions} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" mt={2} color="primary.800">
            Pasien per Departemen
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
