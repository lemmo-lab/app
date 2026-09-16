/**
 * Root Layout — لایوت ریشه برنامه
 * مسئول تنظیم تگ html با dir/lang صحیح بر اساس ترجیح کاربر
 */

import type { Metadata } from 'next';
import './globals.css';
import { DirectionProvider } from '@/shared/ui/primitives/DirectionProvider';

export const metadata: Metadata = {
  title: 'Lemmo Studio',
  description: 'Lemmo AI Studio — Create with intelligence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // مقدار پیش‌فرض rtl/fa — توسط DirectionProvider در کلاینت به‌روز می‌شود
    <html lang="fa" dir="rtl" data-theme="default" data-locale="fa" suppressHydrationWarning>
      <body>
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
