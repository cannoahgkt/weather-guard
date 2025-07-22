'use client';

import { useState } from 'react';
import { Cloud, Mail, MapPin, Bell, Shield } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && location) {
      setIsSubscribed(true);
      // TODO: Implement API call to save user preferences
    }
  };

  return (
    <div className="min-h-screen theme-gradient">
      {/* Header */}
      <header className="pt-8 pb-4">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold theme-text-primary">WeatherGuard</h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-center theme-text-secondary text-lg">
            Stay protected with intelligent weather alerts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-8">
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
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-500 theme-input"
                    placeholder="London, UK"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Weather Protection
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
          <div className="theme-card rounded-3xl shadow-xl p-8 border text-center">
            <div className="p-4 theme-green-bg rounded-2xl w-fit mx-auto mb-4">
              <Shield className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold theme-text-primary mb-2">
              You're Protected!
            </h2>
            <p className="theme-text-secondary mb-6">
              Weather alerts for <span className="font-medium">{location}</span> will be sent to{' '}
              <span className="font-medium">{email}</span>
            </p>
            <div className="theme-blue-bg rounded-2xl p-4">
              <p className="text-blue-700 text-sm">
                You'll receive notifications for severe weather conditions in your area.
              </p>
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
