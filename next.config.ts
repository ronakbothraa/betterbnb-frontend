import type { NextConfig } from "next";

const nextConfig = {
  // ... any other configurations you have
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Or 'https' if your local server uses HTTPS
        hostname: 'localhost',
        port: '8000', // The port your local media server is running on
        pathname: '/media/uploads/properties/**', // Optional: be more specific about the path
      },
      // If you also use HTTPS for localhost:8000
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/uploads/properties/**',
      },
      // Add other domains here if needed for production, staging, etc.
      // e.g., { protocol: 'https', hostname: 'your-cdn.com' }
    ],
  },
};

module.exports = nextConfig;
