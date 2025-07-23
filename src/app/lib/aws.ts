import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';

// DynamoDB Client Configuration
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);

// SES Client Configuration
export const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Table name
export const SUBSCRIPTIONS_TABLE = process.env.DYNAMODB_TABLE_NAME || 'WeatherGuardSubscriptions';
export const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'weather-alerts@example.com';
