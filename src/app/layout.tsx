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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Default: en / ltr
    <html lang="en" dir="ltr" data-theme="default" data-locale="en" suppressHydrationWarning>
      <body>
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
