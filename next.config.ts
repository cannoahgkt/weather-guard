import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable telemetry for better CI/CD performance
  telemetry: false,
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Ensure compatibility
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-dynamodb', '@aws-sdk/client-ses']
  }
};

export default nextConfig;
