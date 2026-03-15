import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev', // Placeholder for Cloudflare R2
      }
    ],
  },
  // Optimize for modern web features
  experimental: {
    // serverActions: true, // Enabled by default in newer Next.js
  },
  // Ensure we can use the lucide icons with proper tree shaking
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
