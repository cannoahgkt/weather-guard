import { dynamoDb, SUBSCRIPTIONS_TABLE } from './aws';
import { WeatherSubscription } from './types';

// Local fallback for development
const localSubscriptions: WeatherSubscription[] = [];

// Check if AWS is configured
export async function isAWSConfigured(): Promise<boolean> {
  try {
    return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  } catch {
    return false;
  }
}

// Create subscription with fallback
export async function createSubscriptionSafe(subscription: Omit<WeatherSubscription, 'subscribedAt' | 'isActive'>): Promise<WeatherSubscription> {
  const newSubscription: WeatherSubscription = {
    ...subscription,
    subscribedAt: new Date().toISOString(),
    isActive: true,
    preferences: {
      windThreshold: 10,
      rainThreshold: 5,
      temperatureAlerts: true,
      stormAlerts: true,
      ...subscription.preferences
    }
  };

  const awsConfigured = await isAWSConfigured();
  
  if (awsConfigured) {
    console.log('Using AWS DynamoDB...');
    // Use actual DynamoDB
    const { createSubscription } = await import('./dynamodb');
    return await createSubscription(subscription);
  } else {
    console.log('AWS not configured, using local storage...');
    // Use local fallback
    const existingIndex = localSubscriptions.findIndex(sub => sub.email === subscription.email);
    if (existingIndex >= 0) {
      localSubscriptions[existingIndex] = newSubscription;
    } else {
      localSubscriptions.push(newSubscription);
    }
    return newSubscription;
  }
}

// Get subscription with fallback
export async function getSubscriptionSafe(email: string): Promise<WeatherSubscription | null> {
  const awsConfigured = await isAWSConfigured();
  
  if (awsConfigured) {
    const { getSubscription } = await import('./dynamodb');
    return await getSubscription(email);
  } else {
    return localSubscriptions.find(sub => sub.email === email) || null;
  }
}

// Get all active subscriptions with fallback
export async function getAllActiveSubscriptionsSafe(): Promise<WeatherSubscription[]> {
  const awsConfigured = await isAWSConfigured();
  
  if (awsConfigured) {
    const { getAllActiveSubscriptions } = await import('./dynamodb');
    return await getAllActiveSubscriptions();
  } else {
    return localSubscriptions.filter(sub => sub.isActive);
  }
}

// Deactivate subscription with fallback
export async function deactivateSubscriptionSafe(email: string): Promise<boolean> {
  const awsConfigured = await isAWSConfigured();
  
  if (awsConfigured) {
    const { deactivateSubscription } = await import('./dynamodb');
    return await deactivateSubscription(email);
  } else {
    const subscription = localSubscriptions.find(sub => sub.email === email);
    if (subscription) {
      subscription.isActive = false;
      return true;
    }
    return false;
  }
}
