import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for development
// In production, this will be replaced with DynamoDB
const subscriptions: Array<{
  id: string;
  email: string;
  location: string;
  coordinates?: { lat: number; lon: number };
  createdAt: string;
  isActive: boolean;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const { email, location } = await request.json();
    
    if (!email || !location) {
      return NextResponse.json(
        { error: 'Email and location are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = subscriptions.find(sub => sub.email === email);
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Validate location by calling weather API
    const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    });

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 400 }
      );
    }

    const weatherData = await weatherResponse.json();

    // Create subscription
    const subscription = {
      id: Date.now().toString(),
      email,
      location: weatherData.location.name,
      coordinates: weatherData.location.coordinates,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    subscriptions.push(subscription);

    // TODO: In production, this will:
    // 1. Save to DynamoDB
    // 2. Send confirmation email via SES
    // 3. Set up scheduled Lambda for weather monitoring

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to weather alerts',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        location: subscription.location,
        createdAt: subscription.createdAt
      },
      currentWeather: weatherData.weather
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Development endpoint to view subscriptions
  return NextResponse.json({
    subscriptions: subscriptions.map(sub => ({
      id: sub.id,
      email: sub.email,
      location: sub.location,
      createdAt: sub.createdAt,
      isActive: sub.isActive
    }))
  });
}
