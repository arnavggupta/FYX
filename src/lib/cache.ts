import { getRedis } from './redis';

const CACHE_DURATION = 10 * 60; // 10 minutes in seconds

export class CacheManager {
  private static getWeatherKey(city: string) {
    return `weather:${city.toLowerCase()}`;
  }

  private static getForecastKey(city: string) {
    return `forecast:${city.toLowerCase()}`;
  }

  static async getWeather(city: string): Promise<any> {
    try {
      const redis = getRedis();
      const key = this.getWeatherKey(city);
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting weather cache:', error);
      return null;
    }
  }

  static async setWeather(city: string, data: any): Promise<void> {
    try {
      const redis = getRedis();
      const key = this.getWeatherKey(city);
      await redis.setex(key, CACHE_DURATION, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting weather cache:', error);
    }
  }

  static async getForecast(city: string): Promise<any> {
    try {
      const redis = getRedis();
      const key = this.getForecastKey(city);
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting forecast cache:', error);
      return null;
    }
  }

  static async setForecast(city: string, data: any): Promise<void> {
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
      // Get all keys and delete weather/forecast cache
      const weatherKeys = await redis.keys('weather:*');
      const forecastKeys = await redis.keys('forecast:*');
      
      if (weatherKeys.length > 0) {
        await redis.del(...weatherKeys);
      }
      if (forecastKeys.length > 0) {
        await redis.del(...forecastKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}