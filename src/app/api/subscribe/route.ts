import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionSafe, getSubscriptionSafe } from '../../lib/database';
import { sendWelcomeEmail } from '../../lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, location } = await request.json();
    
    if (!email || !location) {
      return NextResponse.json(
        { error: 'Email and location are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate location by calling weather API
    console.log('Validating location:', location);
    const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    });

    if (!weatherResponse.ok) {
      console.log('Weather API validation failed for location:', location);
      return NextResponse.json(
        { error: 'Invalid location or weather data unavailable' },
        { status: 400 }
      );
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data validated successfully:', weatherData.location);

    // Parse location to extract city and country
    const locationParts = location.split(',').map((part: string) => part.trim());
    const city = locationParts[0];
    const country = locationParts[1] || '';

    console.log('Creating subscription for:', { email, location, city, country });

    try {
      // Create subscription in DynamoDB
      const subscription = await createSubscriptionSafe({
        email,
        city,
        country,
        location: weatherData.location.name // Use validated location name
      });

      console.log('Subscription created successfully:', subscription.email);

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, weatherData.location.name).catch(error => {
        console.error('Failed to send welcome email:', error);
        // Don't fail the API call if email fails
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to weather alerts',
        subscription: {
          email: subscription.email,
          location: subscription.location,
          subscribedAt: subscription.subscribedAt,
          isActive: subscription.isActive
        },
        currentWeather: weatherData.weather
      });

    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      
      // If subscription already exists, try to reactivate it
      if (dbError instanceof Error && (dbError.message?.includes('already exists') || dbError.name === 'ConditionalCheckFailedException')) {
        console.log('Subscription already exists, attempting to reactivate...');
        
        // You could implement reactivation logic here
        return NextResponse.json({
          success: true,
          message: 'Subscription already exists and is active',
          currentWeather: weatherData.weather
        });
      }
      
      throw dbError; // Re-throw if it's not a duplicate error
    }

  } catch (error: unknown) {
    console.error('Subscription error:', error);
    return NextResponse.json({
      error: 'Failed to create subscription',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
}

// Development endpoint to view subscriptions
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (email) {
      // Get specific subscription
      const subscription = await getSubscriptionSafe(email);
      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        subscription: {
          email: subscription.email,
          location: subscription.location,
          subscribedAt: subscription.subscribedAt,
          isActive: subscription.isActive
        }
      });
    }

    // For security, don't allow listing all subscriptions in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    return NextResponse.json({
      message: 'Use ?email=your@email.com to get specific subscription'
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json({ error: 'Failed to get subscription' }, { status: 500 });
  }
}
