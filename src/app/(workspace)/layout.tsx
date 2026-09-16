/**
 * Workspace Layout — لایوت پوسته اصلی استودیو
 * شامل سایدبار + هدر + ناحیه محتوای اصلی
 *
 * توجه: در M1 این یک stub ساده است.
 * پیاده‌سازی کامل (AppSidebar, StudioHeader, SurfaceSwitcher) در M3 انجام می‌شود.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Lemmo Studio',
    default: 'Lemmo Studio',
  },
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100dvh',
        background: 'var(--lemmo-canvas-bg, #131517)',
      }}
    >
      {/* TODO M3: AppSidebar */}
      <main
        style={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
