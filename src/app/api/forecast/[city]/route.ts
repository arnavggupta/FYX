import { NextResponse } from 'next/server';
import { WeatherService } from '../../../../lib/weather'; 
import { CacheManager } from '../../../../lib/cache'; 
import { initDB } from '../../../../lib/db'; 


export async function GET(
  req: Request,
  { params }: { params: { city: string } }
) {
  try {
    await initDB();
    const { city } = params;

    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City parameter is required' },
        { status: 400 }
      );
    }
    
    const decodedCity = decodeURIComponent(city);

    // Try to get from cache first
    const cachedData = await CacheManager.get(decodedCity, 'forecast_cache');
    if (cachedData) {
      return NextResponse.json({ success: true, data: cachedData, cached: true });
    }

    // Fetch fresh data
    const forecastData = await WeatherService.getForecast(decodedCity);
    
    // Cache the new data
    await CacheManager.set(decodedCity, forecastData, 'forecast_cache');
    
    return NextResponse.json({ success: true, data: forecastData, cached: false });

  } catch (error) {
    console.error('Forecast API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
