import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";

dayjs.extend(utc);

export const formatRp = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);

export const formatPercent = (value: number): string => {
  if (isNaN(value)) return "0.00%";
  return `${value.toFixed(2)}%`;
};

export const formatDateIndonesia = (dateString: string): string => {
  if (!dateString) return "";

  const hari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const date = new Date(
    new Date(dateString).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  const namaHari = hari[date.getDay()];
  const tanggal = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";
  // Use UTC mode to prevent timezone shift (e.g. 22:00 -> 05:00 next day)
  // Format: "Kamis, 4 Februari 2026 22.02"
  return dayjs(dateString).utc().locale('id').format('dddd, D MMMM YYYY HH.mm');
};

export const formatDateIndonesia2 = (dateString: string): string => {
  if (!dateString) return "-";

  const bulanIndonesia = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  try {
    const [datePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-");

    return `${parseInt(day)} ${bulanIndonesia[parseInt(month) - 1]} ${year}`;
  } catch (error) {
    console.error("Format tanggal tidak valid:", error);
    return "-";
  }
};

export const persenFloat = (value: string | number): number => {
  if (!value) return 0;

  if (typeof value === "number") {
    return value;
  }

  return parseFloat(value.replace(/,/g, '')) || 0;
};

export const formatNumberIndonesia = (number: number | string): string => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }
  if (isNaN(number)) {
    return "0";
  }
  return number.toLocaleString("id-ID");
};

export const roundToEven = (value: number): number => {
  const rounded = Math.round(value);
  return rounded % 2 === 0 ? rounded : rounded + 1;
};

export function parseMultiLineString(wkt: string): number[][][] {
  if (!wkt.startsWith('MULTILINESTRING')) return [];

  const trimmed = wkt
    .replace(/^MULTILINESTRING\s*\(\(/, '')
    .replace(/\)\)$/, '');
  return trimmed.split('),(').map(line =>
    line.split(',').map(coord => {
      const [lng, lat] = coord.trim().split(/\s+/).map(parseFloat);
      return [lng, lat];
    })
  );
}

export const getMidPoint = (coords: number[][]): number[] => {
  const mid = Math.floor(coords.length / 2);
  return coords[mid];
};
