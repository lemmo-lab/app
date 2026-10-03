import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

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

  async rewrites() {
    const gatewayUrl = process.env.GATEWAY_INTERNAL_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${gatewayUrl}/api/v1/:path*`,
      },
    ];
  },

  // Note: Zero-Leakage audit (no mock/ imports outside sdk/) is enforced
  // via ESLint rules added in M8.
  experimental: {},
};

export default nextConfig;
