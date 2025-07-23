# WeatherGuard AWS Infrastructure Deployment Guide

## Prerequisites
1. AWS CLI installed and configured
2. Appropriate IAM permissions for DynamoDB, SES, and Lambda
3. Node.js and npm installed

## 1. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name WeatherGuardSubscriptions \
  --attribute-definitions \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-west-1
```

## 2. Set up Amazon SES

### Verify your domain/email:
```bash
# Verify sender email address
aws ses verify-email-identity \
  --email-address weather-alerts@your-domain.com \
  --region eu-west-1

# Check verification status
aws ses get-identity-verification-attributes \
  --identities weather-alerts@your-domain.com \
  --region eu-west-1
```

### Move out of SES Sandbox (for production):
- Go to AWS Console → SES → Account dashboard
- Request production access

## 3. Create IAM Role for Lambda (if using Lambda)

```bash
# Create trust policy file
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name WeatherGuardLambdaRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name WeatherGuardLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name WeatherGuardLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
  --role-name WeatherGuardLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
```

## 4. Environment Variables for Production

Update your `.env.local` with real AWS credentials:

```bash
# AWS Configuration (replace with your actual values)
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
DYNAMODB_TABLE_NAME=WeatherGuardSubscriptions
SES_FROM_EMAIL=weather-alerts@your-verified-domain.com

# Admin API Key (generate a secure random key)
ADMIN_API_KEY=your-secure-admin-key-here

# Application URL (update for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 5. Deploy to Vercel/AWS/etc.

### For Vercel:
```bash
npm install -g vercel
vercel --env-file .env.local
```

### For AWS Lambda (optional):
You can package the weather checker as a Lambda function and schedule it with EventBridge.

## 6. Test the Integration

### Test subscription:
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","location":"London, GB"}'
```

### Test admin endpoint:
```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-admin-key-2024" \
  -d '{"action":"list-subscriptions"}'
```

### Trigger manual weather check:
```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-admin-key-2024" \
  -d '{"action":"check-weather"}'
```

## 7. Set up Scheduled Weather Checks

### Option A: Use AWS EventBridge + Lambda
Create a Lambda function that calls your weather checker and schedule it to run every 6 hours.

### Option B: Use a cron job on your server
```bash
# Add to crontab (runs every 6 hours)
0 */6 * * * curl -X POST https://your-domain.com/api/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-key" \
  -d '{"action":"check-weather"}'
```

## Security Notes

1. **Never commit real AWS credentials to git**
2. **Use IAM roles with minimal permissions**
3. **Enable AWS CloudTrail for auditing**
4. **Set up billing alerts**
5. **Use different environments (dev/staging/prod)**

## Monitoring

- Monitor DynamoDB metrics in CloudWatch
- Set up SES sending statistics
- Monitor API Gateway/Lambda logs
- Set up error alerting

## Cost Optimization

- DynamoDB: Use on-demand billing for low usage
- SES: First 62,000 emails/month are free
- Lambda: First 1M requests/month are free
- Consider AWS Free Tier limits
