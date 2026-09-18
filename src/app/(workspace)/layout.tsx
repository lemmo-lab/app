/**
 * Workspace Layout — Studio shell layout.
 * Hosts the global StudioSidebar navigation rail and provides a clean container
 * for all workspace pages.
 */

import type { Metadata } from 'next';
import StudioSidebar from '@/shared/ui/layout/StudioSidebar';

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
    <div className="studio-shell">
      {/* Unified 72px Navigation Rail (docked at inline-start / left in LTR) */}
      <StudioSidebar />

      {/* Main Content Area for Pages (independently scrollable viewport) */}
      <main className="studio-viewport">{children}</main>

      <style>{`
        .studio-shell {
          display: flex;
          flex-direction: row;
          height: 100dvh;
          max-height: 100dvh;
          width: 100%;
          background: var(--lemmo-page-background, #131517);
          position: relative;
          overflow: hidden;
        }

        .studio-viewport {
          flex: 1;
          min-width: 0;
          height: 100dvh;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        @media (max-width: 900px) {
          .studio-shell {
            flex-direction: column;
            height: 100dvh;
          }

          .studio-viewport {
            height: calc(100dvh - 48px);
            margin-top: 48px;
            padding-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
