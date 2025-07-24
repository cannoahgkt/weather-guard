import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // AWS SDK external packages for better compatibility
  serverExternalPackages: ['@aws-sdk/client-dynamodb', '@aws-sdk/client-ses', '@aws-sdk/lib-dynamodb']
};

export default nextConfig;
