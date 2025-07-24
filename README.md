# 🛡️ WeatherGuard

A **production-ready weather alert system** built with Next.js and AWS services. Users can subscribe to location-based weather alerts and receive email notifications for severe weather conditions.

## 🌟 Features

- **Real-time Weather Data**: Integration with OpenWeatherMap API
- **Email Notifications**: AWS SES for reliable email delivery
- **Cloud Database**: AWS DynamoDB for scalable data storage
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Production Architecture**: Hybrid local/cloud development setup
- **Error Handling**: Comprehensive fallbacks and validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: AWS DynamoDB (with local fallback)
- **Email Service**: AWS SES
- **Weather API**: OpenWeatherMap
- **Cloud Provider**: AWS (IAM, DynamoDB, SES)

## 🚀 Live Demo

**[View Live Application](https://your-vercel-url.vercel.app)** *(Coming Soon)*

### Demo Features
- Subscribe with any email address
- Real-time weather validation
- Cloud database storage
- Email notifications (requires SES verification)

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS Account (for production features)
- OpenWeatherMap API key
- Git

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```bash
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key

# AWS Configuration (Optional - falls back to local storage)
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_NAME=WeatherGuardSubscriptions
SES_FROM_EMAIL=your_verified_email@domain.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_API_KEY=dev-admin-key-2024
```

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/cannoahgkt/weather-guard.git
   cd weather-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your OpenWeatherMap API key
   - (Optional) Add AWS credentials for cloud features

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 AWS Setup (Optional)

For full cloud functionality:

1. **Create AWS Account** and configure IAM user
2. **Set up DynamoDB table** named `WeatherGuardSubscriptions`
3. **Configure SES** and verify email address
4. **Add AWS credentials** to `.env.local`

Detailed setup instructions: [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)

## 🧪 Testing

```bash
# Test AWS connections
curl http://localhost:3000/api/test-aws

# Test email functionality
curl http://localhost:3000/api/test-email

# View subscription data
curl http://localhost:3000/api/subscribe?email=test@example.com
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── lib/           # Utilities and AWS config
│   ├── components/    # React components
│   └── globals.css    # Global styles
├── public/            # Static assets
└── ...config files
```

## 🔧 Key Features Implementation

- **Hybrid Database**: Automatically switches between AWS DynamoDB and local storage
- **Email Resilience**: Graceful degradation when email services are unavailable
- **Weather Validation**: Real-time location verification via OpenWeatherMap
- **Error Boundaries**: Comprehensive error handling and user feedback

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🔒 Security

- Environment variables for sensitive data
- AWS IAM roles with minimal permissions
- Input validation and sanitization
- Rate limiting and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Can Goktekin**
- GitHub: [@cannoahgkt](https://github.com/cannoahgkt)
- Email: cangoktekin@gmail.com

---

*Built with ❤️ for reliable weather notifications*
