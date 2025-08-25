import React from 'react';
import { ForecastData } from '@/types/weatherType';

interface ForecastCardProps {
  forecasts: ForecastData[];
  city: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecasts, city }) => {
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!forecasts.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">5-Day Forecast - {city}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecasts.map((forecast, index) => (
          <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {formatDate(forecast.date)}
            </p>
            
            <img 
              src={getWeatherIcon(forecast.icon)} 
              alt={forecast.condition}
              className="w-12 h-12 mx-auto mb-2"
            />
            
            <p className="text-xs text-gray-500 capitalize mb-2">
              {forecast.description}
            </p>
            
            <div className="text-sm">
              <span className="font-bold text-blue-600">{forecast.temperature.max}°</span>
              <span className="text-gray-400 ml-1">{forecast.temperature.min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;