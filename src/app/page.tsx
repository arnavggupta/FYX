"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { RefreshCw, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '@/components/weatherCard';

import ForecastCard from '@/components/ForeCastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { WeatherData,ForecastData,CityPreference } from '@/types/weatherType';

interface SearchResult {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const Home: React.FC = () => {
  const [cities, setCities] = useState<CityPreference[]>([]);
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherData }>({});
  const [forecastData, setForecastData] = useState<{ [key: string]: ForecastData[] }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      
      if (data.success) {
        setCities(data.data);
        // Load weather data for each city  beacuse we need to show weathercard also 
        for (const city of data.data) {
          await loadWeatherData(city.name);
        }
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = async (cityName: string) => {
    try {
      // Load current weather using open weather api 
      const weatherResponse = await fetch(`/api/weather/${encodeURIComponent(cityName)}`);
      const weatherResult = await weatherResponse.json();
      
      if (weatherResult.success) {
        setWeatherData(prev => ({
          ...prev,
          [cityName]: weatherResult.data
        }));
      }

      // Load forecast for next days 
      const forecastResponse = await fetch(`/api/forecast/${encodeURIComponent(cityName)}`);
      const forecastResult = await forecastResponse.json();
      
      if (forecastResult.success) {
        setForecastData(prev => ({
          ...prev,
          [cityName]: forecastResult.data
        }));
      }
    } catch (error) {
      console.error(`Error loading weather data for ${cityName}:`, error);
    }
  };

  const handleCityAdd = async (city: SearchResult) => {
    setCities(prev => [...prev, {
      id: city.id,
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      addedAt: Date.now()
    }]);
    
    await loadWeatherData(city.name);
  };

  const handleCityRemove = async (cityId: string, cityName: string) => {
    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCities(prev => prev.filter(city => city.id !== cityId));
        setWeatherData(prev => {
          const newData = { ...prev };
          delete newData[cityName];
          return newData;
        });
        setForecastData(prev => {
          const newData = { ...prev };
          delete newData[cityName];
          return newData;
        });
      }
    } catch (error) {
      console.error('Error removing city:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    

    try {
      await fetch('/api/cache/clear', { method: 'POST' });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
   
    for (const city of cities) {
      await loadWeatherData(city.name);
    }
    
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="A comprehensive weather dashboard with forecasts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
        <div className="container mx-auto px-4 py-8">
         
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
            <p className="text-blue-100">Track weather conditions across multiple cities</p>
          </div>

          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
            <SearchBar onCityAdd={handleCityAdd} />
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh All'}</span>
            </button>
          </div>

         
          {cities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No cities added yet</h2>
              <p className="text-blue-100">Search and add cities to start tracking weather</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city,index) => (
                <div key={index} className="space-y-4">
                  {weatherData[city.name] ? (
                    <WeatherCard
                      weather={weatherData[city.name]}
                      onRemove={() => handleCityRemove(city.id, city.name)}
                    />
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        
          {Object.entries(forecastData).map(([cityName, forecasts]) => (
            <ForecastCard key={cityName} forecasts={forecasts} city={cityName} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;