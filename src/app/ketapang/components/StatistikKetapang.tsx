'use client';
import {
  Box, Grid,
} from '@chakra-ui/react';
import GKPPriceCards from './GKPPriceCards';
import ConsumerPrices from './ConsumerPrices';
import PriceTrendChart from './PriceTrendChart';
import LineChartTrend from './LineChartTrend';
import BarChartPrices from './BarChartPrices';
import PieChartCategory from './PieChartCategory';
import DonutChartStatus from './DonutChartStatus';
import AreaChartRange from './AreaChartRange';
import ScatterPlotCorrelation from './ScatterPlotCorrelation';
import HeatmapMatrix from './HeatmapMatrix';
import RadarChartMulti from './RadarChartMulti';

export default function StatistikKetapang(){
  return(
    <Box bg="gray.50" minH="100vh" pb={8}>
      {/* GKP Price Cards - Top */}
      <Box mb={6}>
        <GKPPriceCards />
      </Box>

      {/* Main Content Grid - 3 Columns (3-3-6) */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 2fr" }} gap={6} p={4}>
        
        {/* Left Column - Consumer Prices */}
        <Box h="500px" overflow="hidden">
          <ConsumerPrices />
        </Box>

        {/* Middle Column - Price Trend Chart */}
        <Box h="500px" overflow="hidden">
          <PriceTrendChart />
        </Box>

        {/* Right Column - Bar Chart Prices (Wide) */}
        <Box h="500px" overflow="hidden">
          <BarChartPrices />
        </Box>
      </Grid>

      {/* Chart Section 1 - Line Chart (Wide) */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr" }} gap={6} p={4}>
        <Box>
          <LineChartTrend />
        </Box>
      </Grid>

      {/* Chart Section 2 - Pie & Donut Charts */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} p={4}>
        <Box>
          <PieChartCategory />
        </Box>
        <Box>
          <DonutChartStatus />
        </Box>
      </Grid>

      {/* Chart Section 3 - Area Chart (Wide) */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr" }} gap={6} p={4}>
        <Box>
          <AreaChartRange />
        </Box>
      </Grid>

      {/* Chart Section 4 - Scatter Plot (Wide) */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr" }} gap={6} p={4}>
        <Box>
          <ScatterPlotCorrelation />
        </Box>
      </Grid>

      {/* Chart Section 5 - Heatmap & Radar Charts */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} p={4}>
        <Box>
          <HeatmapMatrix />
        </Box>
        <Box>
          <RadarChartMulti />
        </Box>
      </Grid>
    </Box>
  )
}
