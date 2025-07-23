import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, SUBSCRIPTIONS_TABLE } from './aws';
import { WeatherSubscription } from './types';

// Create a new subscription
export async function createSubscription(subscription: Omit<WeatherSubscription, 'subscribedAt' | 'isActive'>): Promise<WeatherSubscription> {
  const newSubscription: WeatherSubscription = {
    ...subscription,
    subscribedAt: new Date().toISOString(),
    isActive: true,
    preferences: {
      windThreshold: 10, // m/s
      rainThreshold: 5,  // mm/h
      temperatureAlerts: true,
      stormAlerts: true,
      ...subscription.preferences
    }
  };

  const command = new PutCommand({
    TableName: SUBSCRIPTIONS_TABLE,
    Item: newSubscription,
    // Prevent overwriting existing subscriptions
    ConditionExpression: 'attribute_not_exists(email)'
  });

  try {
    await dynamoDb.send(command);
    console.log('Subscription created:', newSubscription.email);
    return newSubscription;
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      // Update existing subscription instead
      const updated = await updateSubscription(subscription.email, {
        city: subscription.city,
        country: subscription.country,
        location: subscription.location,
        isActive: true
      });
      if (!updated) {
        throw new Error('Failed to update existing subscription');
      }
      return updated;
    }
    throw error;
  }
}

// Get subscription by email
export async function getSubscription(email: string): Promise<WeatherSubscription | null> {
  const command = new GetCommand({
    TableName: SUBSCRIPTIONS_TABLE,
    Key: { email }
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Item as WeatherSubscription || null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

// Get all active subscriptions
export async function getAllActiveSubscriptions(): Promise<WeatherSubscription[]> {
  const command = new ScanCommand({
    TableName: SUBSCRIPTIONS_TABLE,
    FilterExpression: 'isActive = :active',
    ExpressionAttributeValues: {
      ':active': true
    }
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Items as WeatherSubscription[] || [];
  } catch (error) {
    console.error('Error getting active subscriptions:', error);
    return [];
  }
}

// Update subscription
export async function updateSubscription(
  email: string, 
  updates: Partial<Omit<WeatherSubscription, 'email'>>
): Promise<WeatherSubscription | null> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  Object.entries(updates).forEach(([key, value], index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    
    updateExpressions.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = value;
  });

  const command = new UpdateCommand({
    TableName: SUBSCRIPTIONS_TABLE,
    Key: { email },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Attributes as WeatherSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return null;
  }
}

// Deactivate subscription (soft delete)
export async function deactivateSubscription(email: string): Promise<boolean> {
  try {
    await updateSubscription(email, { isActive: false });
    console.log('Subscription deactivated:', email);
    return true;
  } catch (error) {
    console.error('Error deactivating subscription:', error);
    return false;
  }
}

// Update last alert sent timestamp
export async function updateLastAlertSent(email: string): Promise<void> {
  await updateSubscription(email, {
    lastAlertSent: new Date().toISOString()
  });
}
