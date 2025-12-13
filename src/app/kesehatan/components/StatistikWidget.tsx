'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  BarElement, BarController
} from 'chart.js';


import StatistikData from "@/app/kesehatan/components/StatistikData";
import StatistikPie from "@/app/kesehatan/components/StatistikPie";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LineElement, LinearScale, PointElement, Filler, BarElement, BarController);

export default function StatistikBelanja() {
  return (
    <>
      <StatistikPie />
      <StatistikData />
    </>
  );
}
