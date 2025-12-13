"use client";
import { Box, Heading, Spinner, Text, HStack, Select, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { getBasePath } from "@/libs/utils/getBasePath";
import useGetData from "@/app/hooks/useGetData";
import { IResponsePermohonan } from "@/app/api/ppid/permohonan/route";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

export default function PermohonanWidget() {
  const apiUrl = `${getBasePath()}/api/ppid/permohonan`;
  const { data, isLoading, isError } = useGetData<IResponsePermohonan>(apiUrl.toString());
  // Sorting & slicing for Top N view
  const [limit, setLimit] = useState<number>(20);
  const [showDitolak, setShowDitolak] = useState<boolean>(false);
  const [showUnknown, setShowUnknown] = useState<boolean>(false);

  const itemsSorted = (data?.data ?? [])
    .slice()
    .sort((a, b) => Number(b.total_permohonan ?? 0) - Number(a.total_permohonan ?? 0));

  const visibleItems = itemsSorted.slice(0, Math.min(limit, itemsSorted.length));

  const labels = visibleItems.map((d) => d.opd);
  const totalPermohonan = visibleItems.map((d) => Number(d.total_permohonan ?? 0));
  const totalSelesai = visibleItems.map((d) => Number(d.total_selesai ?? 0));
  const totalProses = visibleItems.map((d) => Number(d.total_proses ?? 0));
  const totalDitolak = visibleItems.map((d) => Number(d.total_ditolak ?? 0));
  const totalUnknown = visibleItems.map((d) => Number(d.total_unknown ?? 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Selesai",
        data: totalSelesai,
        backgroundColor: "#10b981",
        stack: "status",
        maxBarThickness: 22,
      },
      {
        label: "Proses",
        data: totalProses,
        backgroundColor: "#f59e0b",
        stack: "status",
        maxBarThickness: 22,
      },
      ...(showDitolak
        ? [
            {
              label: "Ditolak",
              data: totalDitolak,
              backgroundColor: "#ef4444",
              stack: "status",
              maxBarThickness: 22,
            },
          ]
        : []),
      ...(showUnknown
        ? [
            {
              label: "Unknown",
              data: totalUnknown,
              backgroundColor: "#9ca3af",
              stack: "status",
              maxBarThickness: 22,
            },
          ]
        : []),
      {
        label: "Total Permohonan",
        data: totalPermohonan,
        backgroundColor: "#3b82f6",
        stack: "total",
        hidden: true, // digunakan untuk tooltip perbandingan
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const value = Number(context.parsed.x ?? 0);
            const total = totalPermohonan[context.dataIndex] || 0;
            const percent = total ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${context.dataset.label}: ${value} (${percent}%)`;
          },
        },
      },
      datalabels: {
        color: "#111827",
        anchor: "center",
        align: "center",
        display: (ctx: any) => {
          const v = Number(ctx.dataset.data?.[ctx.dataIndex] ?? 0);
          const total = totalPermohonan[ctx.dataIndex] || 0;
          const percent = total ? (v / total) * 100 : 0;
          return percent >= 8 && v > 0; // tampilkan hanya jika cukup besar
        },
        formatter: (value: unknown, ctx: any) => {
          const v = Number(value ?? 0);
          const total = totalPermohonan[ctx.dataIndex] || 0;
          const percent = total ? ((v / total) * 100).toFixed(0) : "0";
          return `${v} (${percent}%)`;
        },
        font: {
          size: 10,
        },
        clip: false,
      },
    },
  };

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={2}>Memuat data PPID...</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500">Gagal memuat data PPID</Text>
      </Box>
    );
  }

  const dynamicHeight = Math.max(labels.length * 26 + 120, 360);

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Permohonan Informasi per OPD</Heading>

      <HStack spacing={6} mb={4} alignItems="center">
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="limit" mb="0" fontSize="sm">Top</FormLabel>
          <Select id="limit" size="sm" value={String(limit)} onChange={(e) => setLimit(Number(e.target.value))} width="120px">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value={labels.length}>Semua</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="ditolak" mb="0" fontSize="sm">Tampilkan Ditolak</FormLabel>
          <Switch id="ditolak" size="sm" isChecked={showDitolak} onChange={(e) => setShowDitolak(e.target.checked)} />
        </FormControl>

        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="unknown" mb="0" fontSize="sm">Tampilkan Unknown</FormLabel>
          <Switch id="unknown" size="sm" isChecked={showUnknown} onChange={(e) => setShowUnknown(e.target.checked)} />
        </FormControl>
      </HStack>

      <Box height={dynamicHeight}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}
