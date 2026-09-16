import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Expose the API mode to the client bundle
  env: {
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE ?? 'mock',
  },

  // Image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // M9: add the real API origin here
    ],
  },

  // Note: Zero-Leakage audit (no mock/ imports outside sdk/) is enforced
  // via ESLint rules added in M8.
  experimental: {},
};

export default nextConfig;
