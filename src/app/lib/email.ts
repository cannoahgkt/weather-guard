import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient, FROM_EMAIL } from './aws';
import { AlertEmailData, WeatherAlert } from './types';

// Send weather alert email
export async function sendWeatherAlert(emailData: AlertEmailData): Promise<boolean> {
  const { recipientEmail, location, alerts, currentWeather, unsubscribeUrl } = emailData;

  const htmlBody = generateAlertEmailHTML(emailData);
  const textBody = generateAlertEmailText(emailData);

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [recipientEmail]
    },
    Message: {
      Subject: {
        Data: `⚠️ Weather Alert for ${location}`,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8'
        }
      }
    }
  });

  try {
    const response = await sesClient.send(command);
    console.log('Weather alert sent successfully:', response.MessageId);
    return true;
  } catch (error) {
    console.error('Error sending weather alert:', error);
    return false;
  }
}

// Send welcome email after subscription
export async function sendWelcomeEmail(email: string, location: string): Promise<boolean> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to WeatherGuard</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #3b82f6; color: white; width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;">
          🛡️
        </div>
        <h1 style="color: #1f2937; margin: 0;">Welcome to WeatherGuard!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="color: #059669; margin-top: 0;">You're Protected! ✅</h2>
        <p>Weather alerts are now active for <strong>${location}</strong></p>
        <p>We'll send you notifications about:</p>
        <ul>
          <li>🌪️ Strong winds (>10 m/s)</li>
          <li>🌧️ Heavy rain (>5 mm/h)</li>
          <li>⛈️ Thunderstorms and severe weather</li>
          <li>🌡️ Extreme temperatures</li>
        </ul>
      </div>

      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="color: #1e40af; margin-top: 0;">How It Works</h3>
        <p>Our system checks weather conditions every 6 hours and will alert you when severe weather is expected in the next 24-48 hours.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          You can <a href="${unsubscribeUrl}" style="color: #3b82f6;">unsubscribe</a> at any time.
        </p>
        <p style="color: #6b7280; font-size: 12px;">
          WeatherGuard - Stay protected with intelligent weather alerts
        </p>
      </div>
    </body>
    </html>
  `;

  const textBody = `
Welcome to WeatherGuard!

You're Protected! ✅

Weather alerts are now active for ${location}

We'll send you notifications about:
- Strong winds (>10 m/s)
- Heavy rain (>5 mm/h) 
- Thunderstorms and severe weather
- Extreme temperatures

How It Works:
Our system checks weather conditions every 6 hours and will alert you when severe weather is expected in the next 24-48 hours.

You can unsubscribe at any time: ${unsubscribeUrl}

WeatherGuard - Stay protected with intelligent weather alerts
  `;

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Subject: {
        Data: `🛡️ Welcome to WeatherGuard - ${location}`,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8'
        }
      }
    }
  });

  try {
    const response = await sesClient.send(command);
    console.log('Welcome email sent successfully:', response.MessageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Generate HTML email template for weather alerts
function generateAlertEmailHTML(emailData: AlertEmailData): string {
  const { location, alerts, currentWeather, unsubscribeUrl } = emailData;
  
  const alertsHTML = alerts.map(alert => {
    const severityColor = {
      low: '#10b981',
      moderate: '#f59e0b', 
      high: '#ef4444',
      severe: '#dc2626'
    }[alert.severity];

    const alertIcon = {
      wind: '💨',
      rain: '🌧️',
      storm: '⛈️',
      temperature: '🌡️'
    }[alert.type];

    return `
      <div style="background: #fef2f2; border-left: 4px solid ${severityColor}; padding: 16px; margin: 12px 0; border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">${alertIcon}</span>
          <strong style="color: ${severityColor}; text-transform: uppercase; font-size: 12px;">${alert.severity} ${alert.type} Alert</strong>
        </div>
        <p style="margin: 0; color: #374151;">${alert.description}</p>
        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Expected: ${new Date(alert.time).toLocaleString()}</p>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Weather Alert - ${location}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #ef4444; color: white; width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;">
          ⚠️
        </div>
        <h1 style="color: #dc2626; margin: 0;">Weather Alert for ${location}</h1>
      </div>

      <div style="background: #fef2f2; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #fecaca;">
        <h2 style="color: #dc2626; margin-top: 0;">⚠️ Severe Weather Expected</h2>
        ${alertsHTML}
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="color: #374151; margin-top: 0;">Current Conditions</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div>
            <strong>Temperature:</strong> ${currentWeather.temperature}°C
          </div>
          <div>
            <strong>Conditions:</strong> ${currentWeather.description}
          </div>
          <div>
            <strong>Humidity:</strong> ${currentWeather.humidity}%
          </div>
          <div>
            <strong>Wind Speed:</strong> ${currentWeather.windSpeed} m/s
          </div>
        </div>
      </div>

      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="color: #1e40af; margin-top: 0;">💡 Stay Safe</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Monitor local weather updates</li>
          <li>Avoid unnecessary outdoor activities</li>
          <li>Secure loose objects if high winds expected</li>
          <li>Keep emergency supplies ready</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          You can <a href="${unsubscribeUrl}" style="color: #3b82f6;">unsubscribe</a> from these alerts at any time.
        </p>
        <p style="color: #6b7280; font-size: 12px;">
          WeatherGuard - Stay protected with intelligent weather alerts
        </p>
      </div>
    </body>
    </html>
  `;
}

// Generate text email template for weather alerts
function generateAlertEmailText(emailData: AlertEmailData): string {
  const { location, alerts, currentWeather, unsubscribeUrl } = emailData;
  
  const alertsText = alerts.map(alert => 
    `⚠️ ${alert.severity.toUpperCase()} ${alert.type.toUpperCase()} ALERT
${alert.description}
Expected: ${new Date(alert.time).toLocaleString()}
`).join('\n');

  return `
WEATHER ALERT FOR ${location.toUpperCase()}

⚠️ SEVERE WEATHER EXPECTED

${alertsText}

CURRENT CONDITIONS:
- Temperature: ${currentWeather.temperature}°C
- Conditions: ${currentWeather.description}
- Humidity: ${currentWeather.humidity}%
- Wind Speed: ${currentWeather.windSpeed} m/s

💡 STAY SAFE:
- Monitor local weather updates
- Avoid unnecessary outdoor activities
- Secure loose objects if high winds expected
- Keep emergency supplies ready

You can unsubscribe from these alerts at any time: ${unsubscribeUrl}

WeatherGuard - Stay protected with intelligent weather alerts
  `;
}
