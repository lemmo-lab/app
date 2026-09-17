/**
 * Studio Sidebar — Global workspace navigation rail (72px)
 * - Highlights the active route automatically via usePathname()
 * - Desktop: Sticky 72px rail on the right side of workspace
 * - Mobile: Fixed 64px bottom navigation rail
 * - Includes interactive ProfilePopover trigger at the bottom
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfilePopover from './ProfilePopover';

export default function StudioSidebar() {
  const pathname = usePathname();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Active route detection
  const isFeedActive = pathname === '/app' || pathname.startsWith('/app/feed');
  const isAgentActive = pathname.startsWith('/app/agent');
  const isAssetsActive = pathname.startsWith('/app/assets');
  const isCanvasActive = pathname === '/canvas' || pathname.startsWith('/app/canvas');
  const isToolsActive = pathname === '/tools' || pathname.startsWith('/app/tools');
  const isGalleryActive = pathname.startsWith('/gallery');
  const isSettingsActive = pathname.startsWith('/settings');

  return (
    <aside className="studio-sidebar" aria-label="Studio Navigation">
      {/* Top Logo / Home Button */}
      <div className="button-home">
        <Link href="/app" className="icon-link" title="Lemmo Studio Home">
          <div className="rect-8-large" />
        </Link>
      </div>

      {/* Primary Category Nav Items */}
      <nav className="primary-cats" aria-label="Primary Categories">
        {/* 1. Feed */}
        <Link
          href="/app"
          className={`nav-btn ${isFeedActive ? 'active' : ''}`}
          title="Community Feed"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>

        {/* 2. Agent */}
        <Link
          href="/app/agent"
          className={`nav-btn ${isAgentActive ? 'active' : ''}`}
          title="Agent Studio"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>

        {/* 3. Assets */}
        <Link
          href="/app/assets"
          className={`nav-btn ${isAssetsActive ? 'active' : ''}`}
          title="Assets Archive"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>

        {/* 4. Canvas */}
        <Link
          href="/app/canvas"
          className={`nav-btn ${isCanvasActive ? 'active' : ''}`}
          title="Interactive Canvas"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>
      </nav>

      {/* Specialized Tools Section */}
      <div className="tools-section">
        <Link
          href="/app/tools"
          className={`nav-btn ${isToolsActive ? 'active' : ''}`}
          title="Tools Catalog"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>
      </div>

      {/* Footer Navigation & Profile Trigger */}
      <div className="footer-sidebar">
        {/* Gallery */}
        <Link
          href="/gallery"
          className={`nav-btn ${isGalleryActive ? 'active' : ''}`}
          title="Community Gallery"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="indicator-pill" />
        </Link>

        {/* Settings & Profile Trigger */}
        <div className="profile-container">
          <button
            type="button"
            className={`profile-trigger-btn ${popoverOpen || isSettingsActive ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(!popoverOpen);
            }}
            title="Account & Settings"
            aria-label="Account & Settings"
            aria-expanded={popoverOpen}
          >
            <div className="rect-8-large" />
          </button>

          {/* Settings / Profile Popover Modal */}
          <ProfilePopover isOpen={popoverOpen} onClose={() => setPopoverOpen(false)} />
        </div>
      </div>

      <style jsx>{`
        .studio-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          width: 72px;
          min-width: 72px;
          height: 100dvh;
          background: #131517;
          position: sticky;
          top: 0;
          box-sizing: border-box;
          z-index: 50;
          border-inline-end: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .button-home {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          width: 56px;
          height: 56px;
          background: #171717;
          border-radius: 8px;
          margin-bottom: 8px;
          box-sizing: border-box;
        }

        :global(.icon-link) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          text-decoration: none;
        }

        .rect-8-large {
          width: 40px;
          height: 40px;
          background: #D9D9D9;
          border-radius: 4px;
          transition: opacity 0.15s ease;
        }

        .rect-8-large:hover {
          opacity: 0.85;
        }

        .primary-cats {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          gap: 8px;
          width: 56px;
        }

        :global(.nav-btn) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 6px;
          width: 56px;
          height: 60px;
          background: #171717;
          border-radius: 8px;
          text-decoration: none;
          box-sizing: border-box;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        :global(.nav-btn:hover) {
          background: #262626;
        }

        :global(.nav-btn.active) {
          background: #453D3D;
        }

        .icon-shape {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .rect-icon {
          width: 20px;
          height: 20px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .indicator-pill {
          width: 40px;
          height: 14px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .tools-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          width: 56px;
          margin-top: 8px;
        }

        .footer-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 0;
          width: 56px;
          flex-grow: 1;
          gap: 8px;
          position: relative;
        }

        .profile-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-trigger-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          width: 56px;
          height: 56px;
          background: #171717;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
          box-sizing: border-box;
        }

        .profile-trigger-btn:hover {
          background: #262626;
        }

        .profile-trigger-btn.active {
          background: #453D3D;
        }

        /* ===== MOBILE RESPONSIVE BOTTOM RAIL ===== */
        @media (max-width: 900px) {
          .studio-sidebar {
            position: fixed;
            bottom: 0;
            inset-inline: 0;
            top: auto;
            width: 100%;
            height: 64px;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 4px 8px calc(4px + env(safe-area-inset-bottom)) 8px;
            z-index: 90;
            border-inline-end: none;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.75);
            background: #131517;
          }

          .button-home {
            display: none;
          }

          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
            gap: 6px;
          }

          :global(.nav-btn) {
            width: 44px;
            height: 44px;
            padding: 4px;
            margin-bottom: 0;
          }

          .indicator-pill {
            display: none;
          }

          .tools-section {
            display: flex;
            flex-direction: row;
            margin-top: 0;
            width: auto;
          }

          .footer-sidebar {
            flex-direction: row;
            padding: 0;
            width: auto;
            flex-grow: 0;
            gap: 6px;
          }

          .profile-trigger-btn {
            width: 44px;
            height: 44px;
            padding: 4px;
          }

          .profile-trigger-btn .rect-8-large {
            width: 24px;
            height: 24px;
            border-radius: 4px;
          }
        }
      `}</style>
    </aside>
  );
}
