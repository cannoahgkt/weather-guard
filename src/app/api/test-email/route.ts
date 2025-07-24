import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../lib/email';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing email send...');
    
    // Test welcome email
    const result = await sendWelcomeEmail('cangoktekin@gmail.com', 'Berlin');
    
    return NextResponse.json({
      success: result,
      message: result ? 'Test email sent successfully!' : 'Failed to send test email',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 });
  }
}
