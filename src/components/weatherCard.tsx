import React from 'react';
import { Thermometer, Droplets, Wind, X } from 'lucide-react';
import { WeatherData } from '@/types/weatherType';

interface WeatherCardProps {
  weather: WeatherData;
  onRemove: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onRemove }) => {
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative hover:shadow-xl transition-shadow duration-300">
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {weather.city}, {weather.country}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
        </div>
        <img 
          src={getWeatherIcon(weather.icon)} 
          alt={weather.condition}
          className="w-16 h-16"
        />
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl font-bold text-blue-600">{weather.temperature}°C</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-600">{weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{weather.windSpeed} m/s</span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Updated: {new Date(weather.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherCard;