import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onCityAdd: (city: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCityAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {   
      setResults([]);
      setShowResults(false);
      return;
    }
// console.log("I reached here ")
    setLoading(true);
    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    

    // console.log(value);

    setTimeout(() => {
      searchCities(value);
    }, 300);

  };

  const handleCitySelect = async (city: SearchResult) => {
    try {
      const response = await fetch('/api/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city)
      });
      
      if (response.ok) {
        onCityAdd(city);
        setQuery('');
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Add city error:', error);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for cities..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left p-3 hover:bg-blue-400 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </div>
                </div>
                <Plus className="w-4 h-4 text-green-500" />
              </button>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;