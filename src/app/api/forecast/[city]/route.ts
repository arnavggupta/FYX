import { WeatherService } from '../../../../lib/weather';
import { CacheManager } from '../../../../lib/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;

    if (!city) {
      return Response.json({ success: false, error: 'City parameter required' }, { status: 400 });
    }

    // Try cache first
    const cachedData = await CacheManager.getForecast(city);
    if (cachedData) {
      return Response.json({ success: true, data: cachedData, cached: true });
    }

    // Fetch fresh data
    const forecastData = await WeatherService.getForecast(city);
    
    // Cache the data
    await CacheManager.setForecast(city, forecastData);
    
    return Response.json({ success: true, data: forecastData, cached: false });
  } catch (error) {
    console.error('Forecast API Error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}