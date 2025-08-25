import axios from 'axios';
import { WeatherData, ForecastData } from '@/types/weatherType';


 interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// --- Interfaces for raw API responses ---

interface OpenWeatherCurrentResponse {
  id: number;
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
}

interface OpenWeatherForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
}

interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
}

interface OpenWeatherGeoResponse {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// --- Helper type for daily forecast aggregation ---

interface DailyForecastAccumulator {
  [key: string]: {
    date: string;
    temperatures: number[];
    condition: string;
    description: string;
    icon: string;
    humidity: number;
  };
}

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get<OpenWeatherCurrentResponse>(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const { data } = response;
      return {
        id: data.id,
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch current weather:', error);
      throw new Error(`Failed to fetch weather data for ${city}`);
    }
  }

  static async getForecast(city: string): Promise<ForecastData[]> {
    try {
      const response = await axios.get<OpenWeatherForecastResponse>(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = response.data.list;
      const dailyForecasts: DailyForecastAccumulator = {};
      
      forecastData.forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temperatures: [item.main.temp],
            condition: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity
          };
        } else {
          dailyForecasts[date].temperatures.push(item.main.temp);
        }
      });

      return Object.values(dailyForecasts).slice(0, 5).map((day) => ({
        date: day.date,
        temperature: {
          min: Math.round(Math.min(...day.temperatures)),
          max: Math.round(Math.max(...day.temperatures))
        },
        condition: day.condition,
        description: day.description,
        icon: day.icon,
        humidity: day.humidity
      }));
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      throw new Error(`Failed to fetch forecast data for ${city}`);
    }
  }

  static async searchCities(query: string): Promise<CitySearchResult[]> {
    try {
      const response = await axios.get<OpenWeatherGeoResponse[]>(
        `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      
      return response.data.map((city) => ({
        id: `${city.lat}-${city.lon}`,
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon
      }));
    } catch (error) {
      console.error('Failed to search cities:', error);
      throw new Error('Failed to search cities');
    }
  }
}
