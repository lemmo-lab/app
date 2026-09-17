/**
 * Studio Sidebar — Workspace navigation rail with 2 states:
 * 1. Expanded (256px) — Horizontal rows with icon + wireframe text pill, full header & profile meta.
 * 2. Collapsed (72px) — Mini-rail with centered icons, centered header toggle & avatar.
 *
 * Conforms strictly to wireframe standards:
 * - Simple geometric shapes only (#D9D9D9 rects & pills, #171717 subtle surfaces, #453D3D active)
 * - Standard 4px ladder grid (256px expanded / 72px collapsed / 40px buttons)
 * - Dedicated 40px circular avatar wireframe
 * - Pure logical CSS properties for RTL/LTR compatibility
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfilePopover from './ProfilePopover';

export default function StudioSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
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
    <aside
      className={`studio-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      aria-label="Studio Navigation"
    >
      {/* Header: Brand Logo + Expand/Collapse Toggle */}
      <div className="header">
        <Link href="/app" className="brand-box" title="Lemmo Studio Home">
          <div className="logo-shape" />
          <div className="brand-pill" />
        </Link>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <div className="chevron-icon" />
        </button>
      </div>

      {/* Primary Category Nav Items */}
      <nav className="primary-cats" aria-label="Primary Categories">
        {/* 1. Feed / Home */}
        <Link
          href="/app"
          className={`nav-btn ${isFeedActive ? 'active' : ''}`}
          title="Community Feed"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="label-pill" />
        </Link>

        {/* 2. Agent */}
        <Link
          href="/app/agent"
          className={`nav-btn ${isAgentActive ? 'active' : ''}`}
          title="Agent Studio"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="label-pill" />
        </Link>

        {/* 3. Assets */}
        <Link
          href="/app/assets"
          className={`nav-btn ${isAssetsActive ? 'active' : ''}`}
          title="Assets Archive"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="label-pill" />
        </Link>

        {/* 4. Canvas */}
        <Link
          href="/app/canvas"
          className={`nav-btn ${isCanvasActive ? 'active' : ''}`}
          title="Interactive Canvas"
        >
          <div className="icon-shape"><div className="rect-icon" /></div>
          <div className="label-pill" />
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
          <div className="label-pill" />
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
          <div className="label-pill" />
        </Link>

        {/* User Profile & Settings Trigger (Fixed Avatar) */}
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
            <div className="avatar-shape" />
            <div className="meta">
              <div className="meta-primary" />
              <div className="meta-secondary" />
            </div>
          </button>

          {/* Settings / Profile Popover Modal */}
          <ProfilePopover isOpen={popoverOpen} onClose={() => setPopoverOpen(false)} />
        </div>
      </div>

      <style jsx>{`
        .studio-sidebar {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px;
          height: 100dvh;
          background: #131517;
          position: sticky;
          top: 0;
          box-sizing: border-box;
          z-index: 50;
          border-inline-end: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        /* Expanded State (256px — 8px grid aligned) */
        .studio-sidebar.expanded {
          width: 256px;
          min-width: 256px;
        }

        /* Collapsed State (72px — mini-rail) */
        .studio-sidebar.collapsed {
          width: 72px;
          min-width: 72px;
        }

        /* ================= Header Section ================= */
        .header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 48px;
          flex-shrink: 0;
          margin-bottom: 8px;
          position: relative;
        }

        :global(.brand-box) {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          height: 48px;
          padding: 0 8px;
          background: #171717;
          border-radius: 8px;
          text-decoration: none;
          flex: 1;
          min-width: 0;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        :global(.brand-box:hover) {
          background: #222529;
        }

        .logo-shape {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .brand-pill {
          height: 14px;
          width: 76px;
          background: #D9D9D9;
          border-radius: 99px;
          flex-shrink: 0;
          transition: opacity 0.2s ease;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #171717;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          flex-shrink: 0;
          margin-inline-start: 6px;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .toggle-btn:hover {
          background: #222529;
        }

        .toggle-btn:active {
          transform: scale(0.94);
        }

        .chevron-icon {
          width: 8px;
          height: 8px;
          border-top: 2px solid #D9D9D9;
          border-inline-start: 2px solid #D9D9D9;
          transform: rotate(-45deg);
          transition: transform 0.25s ease;
        }

        :global([dir="rtl"]) .chevron-icon {
          transform: rotate(135deg);
        }

        .studio-sidebar.collapsed .chevron-icon {
          transform: rotate(135deg);
        }

        :global([dir="rtl"]) .studio-sidebar.collapsed .chevron-icon {
          transform: rotate(-45deg);
        }

        /* Collapsed Header Behavior */
        .studio-sidebar.collapsed .header {
          justify-content: center;
        }

        .studio-sidebar.collapsed :global(.brand-box) {
          display: none;
        }

        .studio-sidebar.collapsed .toggle-btn {
          width: 44px;
          height: 44px;
          margin-inline-start: 0;
        }

        /* ================= Nav Buttons ================= */
        .primary-cats {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 0;
          gap: 8px;
          width: 100%;
          flex-shrink: 0;
        }

        :global(.nav-btn) {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 10px;
          gap: 12px;
          width: 100%;
          height: 40px;
          background: #171717;
          border-radius: 8px;
          text-decoration: none;
          box-sizing: border-box;
          transition: background 0.15s ease;
          border: 1px solid transparent;
          flex-shrink: 0;
          position: relative;
        }

        :global(.nav-btn:hover) {
          background: #222529;
        }

        :global(.nav-btn.active) {
          background: #453D3D;
          border-color: rgba(255, 255, 255, 0.12);
        }

        :global(.nav-btn.active)::before {
          content: '';
          position: absolute;
          inset-inline-start: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: #d1fe17;
          border-start-end-radius: 4px;
          border-end-end-radius: 4px;
        }

        .icon-shape {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .rect-icon {
          width: 20px;
          height: 20px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .label-pill {
          height: 12px;
          max-width: 120px;
          flex: 1;
          background: #D9D9D9;
          border-radius: 99px;
          transition: opacity 0.2s ease;
        }

        .tools-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          width: 100%;
          flex-shrink: 0;
        }

        /* Collapsed Button Behavior */
        .studio-sidebar.collapsed :global(.nav-btn) {
          width: 56px;
          height: 44px;
          padding: 0;
          justify-content: center;
          align-self: center;
        }

        .studio-sidebar.collapsed .label-pill {
          display: none;
        }

        /* ================= Footer Section & Profile ================= */
        .footer-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 12px 0 0 0;
          width: 100%;
          flex-grow: 1;
          gap: 8px;
          position: relative;
        }

        .profile-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .profile-trigger-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 8px 10px;
          gap: 12px;
          width: 100%;
          height: 56px;
          background: #171717;
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
          box-sizing: border-box;
          text-align: start;
        }

        .profile-trigger-btn:hover {
          background: #222529;
        }

        .profile-trigger-btn.active {
          background: #453D3D;
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* Fixed Avatar shape */
        .avatar-shape {
          width: 40px;
          height: 40px;
          background: #D9D9D9;
          border-radius: 9999px;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.08);
        }

        .meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          transition: opacity 0.2s ease;
        }

        .meta-primary {
          width: 80%;
          height: 12px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .meta-secondary {
          width: 50%;
          height: 10px;
          background: #525252;
          border-radius: 99px;
        }

        /* Collapsed Profile Behavior */
        .studio-sidebar.collapsed .profile-container {
          align-items: center;
        }

        .studio-sidebar.collapsed .profile-trigger-btn {
          width: 56px;
          height: 56px;
          padding: 0;
          justify-content: center;
          align-self: center;
        }

        .studio-sidebar.collapsed .avatar-shape {
          margin: 0 auto;
        }

        .studio-sidebar.collapsed .meta {
          display: none;
        }

        /* ================= Mobile Responsive (< 900px) ================= */
        @media (max-width: 900px) {
          .studio-sidebar,
          .studio-sidebar.expanded,
          .studio-sidebar.collapsed {
            position: fixed;
            bottom: 0;
            inset-inline: 0;
            top: auto;
            width: 100%;
            min-width: 100%;
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

          .header {
            display: none;
          }

          .label-pill,
          .meta {
            display: none;
          }

          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
            gap: 6px;
            align-items: center;
          }

          :global(.nav-btn),
          .studio-sidebar.collapsed :global(.nav-btn) {
            width: 44px;
            height: 44px;
            padding: 4px;
            margin-bottom: 0;
            justify-content: center;
          }

          .tools-section {
            display: flex;
            flex-direction: row;
            padding: 0;
            width: auto;
            align-items: center;
          }

          .footer-sidebar {
            flex-direction: row;
            padding: 0;
            width: auto;
            flex-grow: 0;
            gap: 6px;
            align-items: center;
          }

          .profile-container {
            width: auto;
          }

          .profile-trigger-btn,
          .studio-sidebar.collapsed .profile-trigger-btn {
            width: 44px;
            height: 44px;
            padding: 4px;
            justify-content: center;
          }

          .avatar-shape {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </aside>
  );
}
