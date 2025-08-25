import axios from 'axios';
import { WeatherData, ForecastData } from '@/types/weatherType';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const data = response.data;
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
      throw new Error(`Failed to fetch weather data for ${city}`);
    }
  }

  static async getForecast(city: string): Promise<ForecastData[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = response.data.list;
      const dailyForecasts: { [key: string]: any } = {};
      
      // Group forecasts by date and get daily min/max
      forecastData.forEach((item: any) => {
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
      

      return Object.values(dailyForecasts).slice(0, 5).map((day: any) => ({
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
      throw new Error(`Failed to fetch forecast data for ${city}`);
    }
  }

  static async searchCities(query: string) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      
      return response.data.map((city: any) => ({
        id: `${city.lat}-${city.lon}`,
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon
      }));
    } catch (error) {
      throw new Error('Failed to search cities');
    }
  }
}