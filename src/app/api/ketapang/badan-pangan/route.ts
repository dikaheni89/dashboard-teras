import { NextRequest, NextResponse } from 'next/server';
import { BANTEN_PROV_API_URL, BANTEN_PROV_API_KEY, BADAN_PANGAN_API_URL } from '@/config/server-constant';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province_id') || '16';
    const cityId = searchParams.get('city_id') || '';
    const levelHargaId = searchParams.get('level_harga_id') || '1';

    // Try Banten Prov API first
    try {
      const bantenUrl = new URL(BANTEN_PROV_API_URL);
      bantenUrl.searchParams.set('province_id', provinceId);
      if (cityId) bantenUrl.searchParams.set('city_id', cityId);
      bantenUrl.searchParams.set('level_harga_id', levelHargaId);

      const bantenResponse = await fetch(bantenUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'http://localhost:3000/ketapang',
          'X-API-Key': BANTEN_PROV_API_KEY
        },
      });

      if (bantenResponse.ok) {
        const bantenData = await bantenResponse.json();
        if (bantenData.success && bantenData.data && bantenData.data.data) {
          console.log('Using Banten Prov API');
          // Transform Banten Prov response to match Badan Pangan structure
          return NextResponse.json({
            data: bantenData.data.data,
            request_data: bantenData.data.request_data
          });
        }
      }
    } catch {
      console.log('Banten Prov API failed, falling back to Badan Pangan API');
    }

    // Fallback to Badan Pangan API
    const badanUrl = new URL(BADAN_PANGAN_API_URL);
    badanUrl.searchParams.set('province_id', provinceId);
    if (cityId) badanUrl.searchParams.set('city_id', cityId);
    badanUrl.searchParams.set('level_harga_id', levelHargaId);

    const badanResponse = await fetch(badanUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'http://localhost:3000/ketapang'
      },
    });

    if (!badanResponse.ok) {
      throw new Error(`HTTP error! status: ${badanResponse.status}`);
    }

    const badanData = await badanResponse.json();
    console.log('Using Badan Pangan API (fallback)');
    
    return NextResponse.json(badanData);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}
