import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing AWS connection...');
    
    // Test environment variables
    const awsRegion = process.env.AWS_REGION;
    const hasAccessKey = !!process.env.AWS_ACCESS_KEY_ID;
    const hasSecretKey = !!process.env.AWS_SECRET_ACCESS_KEY;
    const tableName = process.env.DYNAMODB_TABLE_NAME;
    const fromEmail = process.env.SES_FROM_EMAIL;

    console.log('Environment check:', {
      awsRegion,
      hasAccessKey,
      hasSecretKey,
      tableName,
      fromEmail
    });

    if (!hasAccessKey || !hasSecretKey) {
      return NextResponse.json({
        success: false,
        error: 'AWS credentials not configured',
        details: {
          hasAccessKey,
          hasSecretKey,
          awsRegion,
          tableName,
          fromEmail
        }
      });
    }

    // Test DynamoDB connection
    try {
      const { dynamoDb, SUBSCRIPTIONS_TABLE } = await import('../../lib/aws');
      const { DescribeTableCommand } = await import('@aws-sdk/client-dynamodb');
      
      const command = new DescribeTableCommand({
        TableName: SUBSCRIPTIONS_TABLE
      });

      const result = await dynamoDb.send(command);
      console.log('DynamoDB table found:', result.Table?.TableName);

      return NextResponse.json({
        success: true,
        message: 'AWS connection successful!',
        services: {
          dynamodb: {
            status: 'connected',
            tableName: result.Table?.TableName,
            tableStatus: result.Table?.TableStatus
          },
          environment: {
            region: awsRegion,
            fromEmail,
            hasCredentials: true
          }
        }
      });

    } catch (dynamoError: any) {
      console.error('DynamoDB connection failed:', dynamoError);
      
      return NextResponse.json({
        success: false,
        error: 'DynamoDB connection failed',
        details: {
          message: dynamoError.message,
          code: dynamoError.name,
          region: awsRegion,
          tableName
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('AWS test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'AWS test failed',
      details: error.message
    }, { status: 500 });
  }
}
