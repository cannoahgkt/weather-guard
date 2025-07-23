import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json();
    
    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Get coordinates from location name
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
    console.log('Geocoding URL:', geoUrl);
    
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    console.log('Geocoding response status:', geoResponse.status);
    console.log('Geocoding data:', geoData);

    if (!geoData || geoData.length === 0) {
      console.log('No geocoding results found for:', location);
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const { lat, lon, name, country } = geoData[0];

    // Get current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Get 5-day forecast (free API)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Process forecast to identify potential severe weather
    const alerts: Array<{
      type: string;
      severity: string;
      description: string;
      time: string;
    }> = [];
    const currentTime = Date.now() / 1000;
    
    // Check next 24 hours for severe weather conditions
    const next24Hours = forecastData.list.filter((item: any) => 
      item.dt <= currentTime + (24 * 60 * 60)
    );

    for (const item of next24Hours) {
      const weather = item.weather[0];
      const temp = item.main.temp;
      const windSpeed = item.wind.speed;
      
      // Detect severe weather conditions
      if (weather.main === 'Thunderstorm') {
        alerts.push({
          type: 'thunderstorm',
          severity: 'moderate',
          description: 'Thunderstorm expected',
          time: new Date(item.dt * 1000).toISOString()
        });
      }
      
      if (temp > 35) {
        alerts.push({
          type: 'extreme_heat',
          severity: 'high',
          description: `Extreme heat warning: ${Math.round(temp)}°C`,
          time: new Date(item.dt * 1000).toISOString()
        });
      }
      
      if (temp < -10) {
        alerts.push({
          type: 'extreme_cold',
          severity: 'high',
          description: `Extreme cold warning: ${Math.round(temp)}°C`,
          time: new Date(item.dt * 1000).toISOString()
        });
      }
      
      if (windSpeed > 15) {
        alerts.push({
          type: 'high_wind',
          severity: 'moderate',
          description: `High wind warning: ${windSpeed} m/s`,
          time: new Date(item.dt * 1000).toISOString()
        });
      }
    }

    return NextResponse.json({
      success: true,
      location: {
        name,
        country,
        coordinates: { lat, lon }
      },
      weather: {
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0].icon
      },
      alerts: alerts
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
