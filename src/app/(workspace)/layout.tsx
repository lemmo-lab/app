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
      {/* Main Content Area for Pages */}
      <main className="studio-viewport">{children}</main>

      {/* Unified 72px Navigation Rail & Mobile Bottom Bar */}
      <StudioSidebar />

      <style>{`
        .studio-shell {
          display: flex;
          flex-direction: row;
          min-height: 100dvh;
          width: 100%;
          background: #0A0A0A;
          direction: ltr;
          position: relative;
          overflow-x: hidden;
        }

        .studio-viewport {
          flex: 1;
          min-width: 0;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        @media (max-width: 900px) {
          .studio-shell {
            flex-direction: column;
          }

          .studio-viewport {
            padding-bottom: 64px;
          }
        }
      `}</style>
    </div>
  );
}
