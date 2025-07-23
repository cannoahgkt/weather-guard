# WeatherGuard - Phase 1 Setup Guide

## OpenWeatherMap API Setup

To test the weather functionality, you need a free API key from OpenWeatherMap:

### Step 1: Get Your API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (it's free)
3. Create your account
4. Go to "My API Keys" in your account dashboard
5. Copy your API key

### Step 2: Configure Your Environment
1. Open `.env.local` in the project root
2. Replace `your_api_key_here` with your actual API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

### Step 3: Test the Application
1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Enter your email and a location (e.g., "London, UK")
4. Click "Start Weather Protection"

## Current Features (Phase 1)

✅ **Real Weather Data Integration (FREE APIs only)**
- OpenWeatherMap Current Weather API (free)
- OpenWeatherMap 5-Day Forecast API (free)
- Custom weather alert detection based on forecast data
- Location validation and geocoding (free)
- Current weather display with temperature, humidity, wind speed

✅ **Smart Weather Alert Detection**
- Thunderstorm detection
- Extreme temperature warnings (>35°C or <-10°C)
- High wind warnings (>15 m/s)
- 24-hour forecast analysis

✅ **Subscription System**
- Email + Location storage (in-memory for now)
- Form validation and error handling
- Success state with current weather

✅ **Modern UI**
- Responsive design with iOS-style elements
- Dark mode support
- Loading states and error handling

## API Endpoints

### POST /api/weather
Fetch weather data for a location
```json
{
  "location": "London, UK"
}
```

### POST /api/subscribe
Subscribe to weather alerts
```json
{
  "email": "user@example.com",
  "location": "London, UK"
}
```

### GET /api/subscribe
View current subscriptions (development only)

## Next Steps (Phase 2)

🔄 **AWS Integration**
- DynamoDB for subscription storage
- Lambda functions for weather monitoring
- SES for email notifications
- EventBridge for scheduled checks

🔄 **Advanced Features**
- Weather alert thresholds
- Multiple location support
- Historical weather data
- Mobile notifications

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.ts     # Weather API endpoint
│   │   └── subscribe/route.ts   # Subscription endpoint
│   ├── components/
│   │   └── ThemeToggle.tsx      # Dark mode toggle
│   ├── globals.css              # Global styles & CSS variables
│   └── page.tsx                 # Main application page
└── ...
```

## Development Notes

- Using only **FREE OpenWeatherMap APIs** (Current Weather + 5-Day Forecast)
- Custom weather alert logic based on forecast analysis
- Currently using in-memory storage for subscriptions
- All data is temporary until AWS integration in Phase 2
- No paid APIs required for Phase 1 functionality
