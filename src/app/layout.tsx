/**
 * Root Layout — Application root layout.
 * Sets the default html dir/lang to RTL/FA; updated dynamically by DirectionProvider on the client.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DirectionProvider } from '@/shared/ui/primitives/DirectionProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

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
    // Default: rtl/fa — updated by DirectionProvider on the client after hydration
    <html lang="fa" dir="rtl" data-theme="default" data-locale="fa" suppressHydrationWarning>
      <body>
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
