/**
 * Workspace Layout — Studio shell layout.
 * Contains sidebar + header + main content area.
 *
 * Note: This is a stub for M1. Full implementation (AppSidebar, StudioHeader,
 * SurfaceSwitcher) is scheduled for M3.
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
