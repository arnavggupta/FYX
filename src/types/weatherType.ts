export interface WeatherData {
  id: number;
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: number;
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  description: string;
  icon: string;
  humidity: number;
}

export interface CityPreference {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}