'use client';

import React, { useMemo } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import useGetData from '@/app/hooks/useGetData';
import { getBasePath } from '@/libs/utils/getBasePath';

type JenisDokumenKey = 'amdal' | 'ukl_upl' | 'sppl' | 'belum_proses';

interface IzinLingkunganRow {
  jenis_dokumen: JenisDokumenKey | string;
  kabkota: string;
  total: number;
}

interface IResponseIzinLingkungan {
  status: number;
  success: boolean;
  message: string;
  data: IzinLingkunganRow[];
}

const LABELS: Record<JenisDokumenKey, string> = {
  amdal: 'AMDAL',
  ukl_upl: 'UKL-UPL',
  sppl: 'SPPL',
  belum_proses: 'Belum Proses',
};

const ORDER: JenisDokumenKey[] = ['amdal', 'ukl_upl', 'sppl', 'belum_proses'];

export default function StatistikJumlahDokumenIzin() {
  const apiUrl = `${getBasePath()}/api/lingkungan/totalizin`;
  const { data, isLoading, isError } = useGetData<IResponseIzinLingkungan>(apiUrl);

  const { categories, totals } = useMemo(() => {
    const rows = data?.data ?? [];
    const agg: Record<string, number> = {};
    let kk = rows[0]?.kabkota ?? '';

    for (const r of rows) {
      kk = r.kabkota || kk;
      const key = r.jenis_dokumen as JenisDokumenKey;
      agg[key] = (agg[key] ?? 0) + Number(r.total ?? 0);
    }

    const cats = ORDER.map((k) => LABELS[k]);
    const vals = ORDER.map((k) => agg[k] ?? 0);
    return { categories: cats, totals: vals, kabkota: kk };
  }, [data]);

  const options = {
    grid: { left: 12, right: 18, bottom: 60, top: 40, containLabel: true },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      formatter: (params: any[]) => {
        const p = params?.[0];
        return `${p?.name}<br/>Total: <b>${p?.value}</b>`;
      },
    },
    xAxis: {
      type: 'category' as const,
      data: categories,
      axisLabel: { interval: 0, rotate: 0, width: 120, overflow: 'truncate' as const },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value' as const,
      name: 'Total',
      minInterval: 1,
    },
    series: [
      {
        name: 'Total',
        type: 'bar' as const,
        data: totals,
        barMaxWidth: 36,
        label: { show: true, position: 'top' as const },
        emphasis: { focus: 'series' as const },
      },
    ],
    animationDuration: 400,
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isError) {
    return <Text color="red.500">Gagal memuat data</Text>;
  }

  if (!data?.success || (totals?.every((v) => v === 0))) {
    return <Text color="red.500">Tidak ada data izin lingkungan.</Text>;
  }

  return (
    <Box p={4} bg="white" w="full" borderRadius="lg">
      <ReactECharts option={options} style={{ height: 500, width: '100%' }} />
    </Box>
  );
}
