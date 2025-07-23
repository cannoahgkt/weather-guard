import { NextRequest, NextResponse } from 'next/server';
import { triggerWeatherCheck } from '../../lib/weather-checker';
import { getAllActiveSubscriptions } from '../../lib/dynamodb';

// Manual trigger for weather checking (for testing/admin)
export async function POST(request: NextRequest) {
  try {
    // Simple auth check for development
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'dev-key'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    switch (action) {
      case 'check-weather':
        console.log('Manual weather check triggered');
        const result = await triggerWeatherCheck();
        return NextResponse.json({
          success: result.success,
          message: result.message,
          processed: result.processed,
          timestamp: new Date().toISOString()
        });

      case 'list-subscriptions':
        const subscriptions = await getAllActiveSubscriptions();
        return NextResponse.json({
          success: true,
          count: subscriptions.length,
          subscriptions: subscriptions.map(sub => ({
            email: sub.email,
            location: sub.location,
            subscribedAt: sub.subscribedAt,
            lastAlertSent: sub.lastAlertSent
          }))
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: check-weather, list-subscriptions' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const subscriptions = await getAllActiveSubscriptions();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: {
        activeSubscriptions: subscriptions.length,
        environment: process.env.NODE_ENV,
        version: '2.0.0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
