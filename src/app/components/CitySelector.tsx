'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import { popularCities, groupedCities } from '../data/cities';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CitySelector({ value, onChange, className }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search term
  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    setSearchTerm('');
    setCustomInput(false);
  };

  const handleCustomInput = () => {
    setCustomInput(true);
    setIsOpen(false);
    onChange('');
  };

  if (customInput) {
    return (
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-12 pr-16 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-500 theme-input ${className}`}
          placeholder="Enter custom location..."
        />
        <button
          onClick={() => setCustomInput(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          Use list
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-left theme-input ${className}`}
      >
        <span className={value ? 'theme-text-primary' : 'text-gray-500'}>
          {value || 'Select a city...'}
        </span>
      </button>
      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 theme-card border rounded-2xl shadow-xl max-h-72 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b" style={{borderColor: 'var(--card-border)'}}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm theme-input"
              />
            </div>
          </div>
          
          {/* Cities List */}
          <div className="max-h-56 overflow-y-auto pb-2">
            {searchTerm ? (
              // Show filtered results
              filteredCities.length > 0 ? (
                <div className="py-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="group w-full px-4 py-3 text-left hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition-colors theme-text-primary"
                    >
                      <div className="flex items-center justify-between">
                        <span>{city.name}</span>
                        <span className="text-xs theme-text-secondary country-code">{city.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center theme-text-secondary">
                  <p>No cities found</p>
                  <button
                    onClick={handleCustomInput}
                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Enter custom location
                  </button>
                </div>
              )
            ) : (
              // Show grouped cities
              Object.entries(groupedCities).map(([region, cities]) => (
                <div key={region}>
                  <div className="px-4 py-2 text-xs font-semibold region-header uppercase tracking-wider bg-blue-50 dark:bg-gray-800">
                    {region}
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="group w-full px-4 py-3 text-left hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition-colors theme-text-primary"
                    >
                      <div className="flex items-center justify-between">
                        <span>{city.name}</span>
                        <span className="text-xs theme-text-secondary country-code">{city.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
            
            {/* Custom Location Option */}
            <div className="border-t py-2" style={{borderColor: 'var(--card-border)'}}>
              <button
                onClick={handleCustomInput}
                className="w-full px-4 py-3 text-left hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition-colors text-blue-500 hover:text-white font-medium"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Enter custom location</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
