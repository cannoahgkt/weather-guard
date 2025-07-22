import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WeatherGuard - Intelligent Weather Alerts",
  description: "Stay protected with real-time weather alerts for storms, heat waves, and severe weather conditions. Get notified before dangerous weather hits your area.",
  keywords: "weather alerts, storm warnings, weather notifications, severe weather, weather protection",
  authors: [{ name: "WeatherGuard Team" }],
  openGraph: {
    title: "WeatherGuard - Intelligent Weather Alerts",
    description: "Stay protected with real-time weather alerts for severe weather conditions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
