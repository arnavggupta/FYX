import { NextResponse } from 'next/server';
import { WeatherService } from '../../../../lib/weather'; 
import { CacheManager } from '../../../../lib/cache'; 
import { initDB } from '../../../../lib/db'; 


export async function GET(
  req: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    await initDB();
    const { city } = await params;

    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City parameter is required' },
        { status: 400 }
      );
    }
    
    const decodedCity = decodeURIComponent(city);


    const cachedData = await CacheManager.get(decodedCity, 'weather_cache');
    if (cachedData) {
      return NextResponse.json({ success: true, data: cachedData, cached: true });
    }

   
    const weatherData = await WeatherService.getCurrentWeather(decodedCity);
    
 
    await CacheManager.set(decodedCity, weatherData, 'weather_cache');
    
    return NextResponse.json({ success: true, data: weatherData, cached: false });

  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
