import { getRedis } from './redis';

export interface CityPreference {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export class DatabaseService {
  private static CITIES_KEY = 'cities';

  static async getCities(): Promise<CityPreference[]> {
    try {
      const redis = getRedis();
      const citiesData = await redis.get(this.CITIES_KEY);
      return citiesData ? JSON.parse(citiesData) : [];
    } catch (error) {
      console.error('Error getting cities:', error);
      return [];
    }
  }

  static async addCity(city: CityPreference): Promise<CityPreference> {
    try {
      const redis = getRedis();
      const cities = await this.getCities();
      const existingIndex = cities.findIndex(c => c.id === city.id);
      
      if (existingIndex >= 0) {
        cities[existingIndex] = city;
      } else {
        cities.unshift(city);
      }
      
      await redis.set(this.CITIES_KEY, JSON.stringify(cities));
      return city;
    } catch (error) {
      console.error('Error adding city:', error);
      throw new Error('Failed to add city');
    }
  }

  static async removeCity(cityId: string): Promise<void> {
    try {
      const redis = getRedis();
      const cities = await this.getCities();
      const filteredCities = cities.filter(city => city.id !== cityId);
      await redis.set(this.CITIES_KEY, JSON.stringify(filteredCities));
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city');
    }
  }
}

export default DatabaseService;