import { getAllActiveSubscriptions, updateLastAlertSent } from './dynamodb';
import { sendWeatherAlert } from './email';
import { WeatherAlert, AlertEmailData } from './types';

// This function would be called by a scheduled Lambda or cron job
export async function checkWeatherForAllSubscriptions(): Promise<void> {
  console.log('Starting weather check for all subscriptions...');
  
  try {
    // Get all active subscriptions
    const subscriptions = await getAllActiveSubscriptions();
    console.log(`Found ${subscriptions.length} active subscriptions`);

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        await checkWeatherForSubscription(subscription);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error checking weather for ${subscription.email}:`, error);
        // Continue with other subscriptions
      }
    }

    console.log('Completed weather check for all subscriptions');
  } catch (error) {
    console.error('Error in weather check process:', error);
    throw error;
  }
}

// Check weather for a specific subscription
export async function checkWeatherForSubscription(subscription: any): Promise<void> {
  const { email, location, lastAlertSent, preferences } = subscription;
  
  console.log(`Checking weather for ${email} (${location})`);

  try {
    // Get weather data
    const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    });

    if (!weatherResponse.ok) {
      console.error(`Weather API failed for ${location}:`, weatherResponse.status);
      return;
    }

    const weatherData = await weatherResponse.json();
    const { weather, alerts } = weatherData;

    // Check if we have any alerts
    if (!alerts || alerts.length === 0) {
      console.log(`No weather alerts for ${location}`);
      return;
    }

    // Filter alerts based on user preferences
    const relevantAlerts = filterAlertsByPreferences(alerts, preferences);
    
    if (relevantAlerts.length === 0) {
      console.log(`No relevant alerts for ${email} based on preferences`);
      return;
    }

    // Check if we should send alert (avoid spam)
    if (shouldSendAlert(lastAlertSent)) {
      console.log(`Sending weather alert to ${email}`);
      
      const emailData: AlertEmailData = {
        recipientEmail: email,
        location,
        alerts: relevantAlerts,
        currentWeather: {
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed
        },
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`
      };

      const emailSent = await sendWeatherAlert(emailData);
      
      if (emailSent) {
        // Update last alert sent timestamp
        await updateLastAlertSent(email);
        console.log(`Weather alert sent successfully to ${email}`);
      } else {
        console.error(`Failed to send weather alert to ${email}`);
      }
    } else {
      console.log(`Skipping alert for ${email} - too soon since last alert`);
    }

  } catch (error) {
    console.error(`Error checking weather for ${email}:`, error);
    throw error;
  }
}

// Filter alerts based on user preferences
function filterAlertsByPreferences(alerts: WeatherAlert[], preferences: any): WeatherAlert[] {
  if (!preferences) {
    return alerts; // Return all alerts if no preferences set
  }

  return alerts.filter(alert => {
    switch (alert.type) {
      case 'wind':
        return alert.value && alert.value >= (preferences.windThreshold || 10);
      case 'rain':
        return alert.value && alert.value >= (preferences.rainThreshold || 5);
      case 'storm':
        return preferences.stormAlerts !== false;
      case 'temperature':
        return preferences.temperatureAlerts !== false;
      default:
        return true;
    }
  });
}

// Determine if we should send an alert (avoid spam)
function shouldSendAlert(lastAlertSent?: string): boolean {
  if (!lastAlertSent) {
    return true; // First alert
  }

  const lastSent = new Date(lastAlertSent);
  const now = new Date();
  const hoursSinceLastAlert = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

  // Don't send alerts more frequently than every 6 hours
  return hoursSinceLastAlert >= 6;
}

// Manual trigger function for testing
export async function triggerWeatherCheck(): Promise<{ success: boolean; message: string; processed: number }> {
  try {
    const subscriptions = await getAllActiveSubscriptions();
    
    let processed = 0;
    for (const subscription of subscriptions) {
      try {
        await checkWeatherForSubscription(subscription);
        processed++;
      } catch (error) {
        console.error(`Failed to process ${subscription.email}:`, error);
      }
    }

    return {
      success: true,
      message: `Weather check completed`,
      processed
    };
  } catch (error) {
    console.error('Manual weather check failed:', error);
    return {
      success: false,
      message: 'Weather check failed',
      processed: 0
    };
  }
}
