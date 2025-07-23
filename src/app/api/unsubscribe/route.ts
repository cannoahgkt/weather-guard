import { NextRequest, NextResponse } from 'next/server';
import { deactivateSubscription, getSubscription } from '../../lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const subscription = await getSubscription(email);
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Deactivate subscription
    const success = await deactivateSubscription(email);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from weather alerts'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

// Handle unsubscribe via GET request (for email links)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const subscription = await getSubscription(email);
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (!subscription.isActive) {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed'
      });
    }

    // Deactivate subscription
    const success = await deactivateSubscription(email);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    // Return HTML page for successful unsubscribe
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Unsubscribed - WeatherGuard</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            text-align: center;
            background: #f8fafc;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .icon { font-size: 48px; margin-bottom: 20px; }
          h1 { color: #059669; margin-bottom: 16px; }
          p { color: #6b7280; line-height: 1.6; }
          .email { color: #374151; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>Successfully Unsubscribed</h1>
          <p>
            <span class="email">${email}</span> has been unsubscribed from WeatherGuard alerts.
          </p>
          <p>
            You will no longer receive weather alert notifications.
          </p>
          <p style="margin-top: 30px; font-size: 14px;">
            You can always subscribe again at any time.
          </p>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe GET error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
