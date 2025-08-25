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

    // Try to get from cache first
    const cachedData = await CacheManager.getWeather(city);
    if (cachedData) {
      return Response.json({ success: true, data: cachedData, cached: true });
    }

    // Fetch fresh data
    const weatherData = await WeatherService.getCurrentWeather(city);
    
    // Cache the data
    await CacheManager.setWeather(city, weatherData);
    
    return Response.json({ success: true, data: weatherData, cached: false });
  } catch (error) {
    console.error('Weather API Error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
