import { getRedis } from './redis';
import { WeatherData,ForecastData } from '@/types/weatherType';

const CACHE_DURATION = 10 * 60; // 10 minutes in seconds

export class CacheManager {
  private static getWeatherKey(city: string): string {
    return `weather:${city.toLowerCase()}`;
  }

  private static getForecastKey(city: string): string {
    return `forecast:${city.toLowerCase()}`;
  }

  static async getWeather(city: string): Promise<WeatherData | null> {
    try {
      const redis = getRedis();
      const key = this.getWeatherKey(city);
      const data = await redis.get(key);
      
      if (!data) {
        return null;
      }
    
      return JSON.parse(data) as WeatherData;
    } catch (error) {
      console.error('Error getting weather cache:', error);
      return null;
    }
  }

  static async setWeather(city: string, data: WeatherData): Promise<void> {
    try {
      const redis = getRedis();
      const key = this.getWeatherKey(city);
      await redis.setex(key, CACHE_DURATION, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting weather cache:', error);
    }
  }

  
  static async getForecast(city: string): Promise<ForecastData[] | null> {
    try {
      const redis = getRedis();
      const key = this.getForecastKey(city);
      const data = await redis.get(key);

      if (!data) {
        return null;
      }
      return JSON.parse(data) as ForecastData[];
    } catch (error) {
      console.error('Error getting forecast cache:', error);
      return null;
    }
  }

  static async setForecast(city: string, data: ForecastData[]): Promise<void> {
    try {
      const redis = getRedis();
      const key = this.getForecastKey(city);
      await redis.setex(key, CACHE_DURATION, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting forecast cache:', error);
    }
  }

 
  static async clear(): Promise<void> {
    try {
      const redis = getRedis();
      const weatherKeys = await redis.keys('weather:*');
      const forecastKeys = await redis.keys('forecast:*');
      
      const keysToDelete = [...weatherKeys, ...forecastKeys];

      if (keysToDelete.length > 0) {
      // Deletes all found keys in a single, efficient operation
        await redis.del(keysToDelete);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
