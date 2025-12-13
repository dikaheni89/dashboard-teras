import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  const url = "https://www.bmkg.go.id/cuaca/peringatan-dini-cuaca/36";

  try {
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);
    const paragraph = $('p.prose').first();
    const fullText = paragraph.text().replace(/\s{2,}/g, ' ').trim();

    const keteranganMatch = fullText.match(/^(.+?pkl\. \d{2}:\d{2} WIB)/);
    const keterangan = keteranganMatch ? keteranganMatch[1] : "";

    const kabkotRegex = /Kabupaten ([A-Z][a-zA-Z ]+)|Kota ([A-Z][a-zA-Z ]+)/g;
    const kabkotSet = new Set<string>();
    let match;

    while ((match = kabkotRegex.exec(fullText)) !== null) {
      const kab = match[1] ?? match[2];
      if (kab) kabkotSet.add(`${match[1] ? 'Kabupaten' : 'Kota'} ${kab}`);
    }

    return NextResponse.json({
      success: true,
      keterangan,
      kabkot: Array.from(kabkotSet),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: (error as Error).message },
      { status: 500 }
    );
  }
}
