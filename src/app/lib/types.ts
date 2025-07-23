// DynamoDB Schema for Weather Subscriptions
export interface WeatherSubscription {
  email: string; // Primary Key
  city: string;
  country: string;
  location: string; // Full location string (e.g., "London, GB")
  subscribedAt: string; // ISO timestamp
  isActive: boolean;
  lastAlertSent?: string; // ISO timestamp of last alert
  preferences?: {
    windThreshold: number; // m/s
    rainThreshold: number; // mm/h
    temperatureAlerts: boolean;
    stormAlerts: boolean;
  };
}

// Weather Alert Types
export interface WeatherAlert {
  type: 'wind' | 'rain' | 'storm' | 'temperature';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
  time: string;
  value?: number;
  unit?: string;
}

// Email Template Data
export interface AlertEmailData {
  recipientEmail: string;
  recipientName?: string;
  location: string;
  alerts: WeatherAlert[];
  currentWeather: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
  };
  unsubscribeUrl: string;
}
