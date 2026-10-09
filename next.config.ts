import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

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

  experimental: {},
};

export default nextConfig;
