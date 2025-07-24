'use client';

import { useState } from 'react';
import { Cloud, Mail, MapPin, Bell, Shield } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import CitySelector from './components/CitySelector';

export default function Home() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !location) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setWeatherData(data.currentWeather);
      setIsSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-gradient relative">
      {/* Header */}
      <header className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Logo and Title - Centered */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6">
            <div className="p-3 sm:p-4 bg-blue-500 rounded-3xl shadow-lg">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold theme-text-primary tracking-tight">WeatherGuard</h1>
          </div>
          {/* Theme Toggle - Top Right */}
          <div className="absolute top-6 right-4 sm:top-8 sm:right-8">
            <ThemeToggle />
          </div>
          {/* Subtitle - Centered */}
          <div>
            <p className="theme-text-secondary text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-2">
              Stay protected with intelligent weather alerts
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {!isSubscribed ? (
          <div className="theme-card rounded-3xl shadow-xl p-8 border">
            <div className="text-center mb-8">
              <div className="p-4 theme-blue-bg rounded-2xl w-fit mx-auto mb-4">
                <Cloud className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold theme-text-primary mb-2">
                Get Weather Alerts
              </h2>
              <p className="theme-text-secondary">
                Receive notifications for storms, heat waves, and severe weather conditions in your area.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium theme-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-500 theme-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium theme-text-secondary mb-2">
                  Location
                </label>
                <CitySelector
                  value={location}
                  onChange={setLocation}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isLoading ? 'Setting up protection...' : 'Start Weather Protection'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t theme-text-secondary" style={{borderColor: 'var(--card-border)'}}>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Real-time alerts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy protected</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="theme-card rounded-3xl shadow-xl p-8 border text-center">
              <div className="p-4 theme-green-bg rounded-2xl w-fit mx-auto mb-4">
                <Shield className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold theme-text-primary mb-2">
                You&apos;re Protected!
              </h2>
              <p className="theme-text-secondary mb-4">
                Weather alerts are now active for <strong>{location}</strong>
              </p>
              <p className="text-sm theme-text-secondary">
                We&apos;ll send notifications to <strong>{email}</strong>
              </p>
            </div>

            {/* Current Weather Display */}
            {weatherData && (
              <div className="theme-card rounded-3xl shadow-xl p-8 border">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold theme-text-primary mb-2">
                    Current Weather
                  </h3>
                  <p className="theme-text-secondary">
                    {location}
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold theme-text-primary">
                      {weatherData.temperature}°C
                    </div>
                    <div className="theme-text-secondary capitalize">
                      {weatherData.description}
                    </div>
                  </div>
                  <div className="p-4 theme-blue-bg rounded-2xl">
                    <Cloud className="w-12 h-12 text-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 theme-blue-bg rounded-xl">
                    <div className="font-medium theme-text-primary">Humidity</div>
                    <div className="theme-text-secondary">{weatherData.humidity}%</div>
                  </div>
                  <div className="text-center p-3 theme-blue-bg rounded-xl">
                    <div className="font-medium theme-text-primary">Wind Speed</div>
                    <div className="theme-text-secondary">{weatherData.windSpeed} m/s</div>
                  </div>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsSubscribed(false);
                  setEmail('');
                  setLocation('');
                  setWeatherData(null);
                  setError('');
                }}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Subscribe another location
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 theme-text-secondary text-sm">
        <p>Powered by weather data APIs and AWS cloud services</p>
      </footer>
    </div>
  );
}
