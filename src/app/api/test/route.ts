import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key found' });
  }

  try {
    // Test with a simple weather API call for London
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,UK&appid=${apiKey}&units=metric`;
    const response = await fetch(testUrl);
    const data = await response.json();
    
    return NextResponse.json({
      apiKeyPresent: true,
      apiKeyLength: apiKey.length,
      testResponse: data,
      status: response.status
    });
  } catch (error) {
    return NextResponse.json({
      error: 'API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
