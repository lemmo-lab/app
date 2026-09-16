import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // تنظیم متغیرهای محیطی عمومی
  env: {
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE ?? 'mock',
  },

  // بهینه‌سازی تصاویر
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // در M9: آدرس سرور واقعی اضافه می‌شود
    ],
  },

  // ممنوعیت import از mock/ در خارج از sdk/
  // در M8 (Zero-Leakage Audit) با eslint rule تأیید می‌شود
  experimental: {
    // تنظیمات آزمایشی آینده
  },
};

export default nextConfig;
