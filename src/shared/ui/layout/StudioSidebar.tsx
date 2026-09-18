/**
 * Studio Sidebar — Workspace navigation rail with 2 display contexts:
 *
 * 1. Desktop (> 900px):
 *    - Expanded state (256px) with horizontal rows, icon + wireframe text pill, full header & profile meta.
 *    - Collapsed state (72px) with centered icons, centered header toggle & avatar.
 *
 * 2. Mobile (<= 900px):
 *    - NO bottom bar!
 *    - Top App Header (48px) with Hamburger button (inline-start) and token pill / avatar (inline-end).
 *    - Slide-over Navigation Drawer (256px) with dark backdrop, close button (X), full categories & profile.
 *
 * Conforms strictly to wireframe standards:
 * - Simple geometric shapes only (#D9D9D9 rects & pills, #171717 subtle surfaces, #453D3D active)
 * - Standard 4px ladder grid (256px expanded / 72px collapsed / 40px buttons / 48px headers)
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Active route detection
  const isFeedActive = pathname === '/app' || pathname.startsWith('/app/feed');
  const isAgentActive = pathname.startsWith('/app/agent');
  const isAssetsActive = pathname.startsWith('/app/assets');
  const isCanvasActive = pathname === '/canvas' || pathname.startsWith('/app/canvas');
  const isToolsActive = pathname === '/tools' || pathname.startsWith('/app/tools');
  const isGalleryActive = pathname.startsWith('/gallery');
  const isSettingsActive = pathname.startsWith('/settings');

  const closeMobileDrawer = () => setMobileOpen(false);

  return (
    <>
      {/* ================= MOBILE TOP APP HEADER (<= 900px) ================= */}
      <header className="mobile-header" aria-label="Mobile Navigation Header">
        {/* Hamburger Menu Button */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setMobileOpen(true)}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
          aria-expanded={mobileOpen}
        >
          <div className="hamburger-icon-shape">
            <span />
            <span />
            <span />
          </div>
        </button>

        {/* User Meta: Token Balance Pill & Profile Avatar Trigger */}
        <div className="mobile-header-meta">
          <div className="token-balance-pill" title="Token Balance">
            <div className="token-icon-dot" />
            <div className="token-text-wire" />
          </div>

          <button
            type="button"
            className="mobile-avatar-btn"
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(!popoverOpen);
            }}
            title="Account & Settings"
            aria-label="Account & Settings"
            aria-expanded={popoverOpen}
          />
        </div>
      </header>

      {/* ================= MOBILE SLIDE-OVER BACKDROP ================= */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMobileDrawer}
          aria-hidden="true"
        />
      )}

      {/* ================= MAIN STUDIO SIDEBAR / DRAWER ================= */}
      <aside
        className={`studio-sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
        aria-label="Studio Navigation"
      >
        {/* Header: Brand Logo + Expand/Collapse Toggle (Desktop) / Close Button (Mobile) */}
        <div className="header">
          <Link
            href="/app"
            className="brand-box"
            onClick={closeMobileDrawer}
            title="Lemmo Studio Home"
          >
            <div className="logo-shape" />
            <div className="brand-pill" />
          </Link>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            className="toggle-btn desktop-only-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <div className="chevron-icon" />
          </button>

          {/* Mobile Close Button (X) */}
          <button
            type="button"
            className="close-drawer-btn mobile-only-btn"
            onClick={closeMobileDrawer}
            title="Close navigation menu"
            aria-label="Close navigation menu"
          >
            <div className="close-x-shape" />
          </button>
        </div>

        {/* Primary Category Nav Items */}
        <nav className="primary-cats" aria-label="Primary Categories">
          {/* 1. Feed / Home */}
          <Link
            href="/app"
            className={`nav-btn ${isFeedActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title="Community Feed"
          >
            <div className="icon-shape"><div className="rect-icon" /></div>
            <div className="label-pill" />
          </Link>

          {/* 2. Agent */}
          <Link
            href="/app/agent"
            className={`nav-btn ${isAgentActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title="Agent Studio"
          >
            <div className="icon-shape"><div className="rect-icon" /></div>
            <div className="label-pill" />
          </Link>

          {/* 3. Assets */}
          <Link
            href="/app/assets"
            className={`nav-btn ${isAssetsActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title="Assets Archive"
          >
            <div className="icon-shape"><div className="rect-icon" /></div>
            <div className="label-pill" />
          </Link>

          {/* 4. Canvas */}
          <Link
            href="/app/canvas"
            className={`nav-btn ${isCanvasActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
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
            onClick={closeMobileDrawer}
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
            onClick={closeMobileDrawer}
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
      </aside>

      <style jsx>{`
        /* ================= MOBILE TOP HEADER (<= 900px) ================= */
        .mobile-header {
          display: none;
        }

        .mobile-backdrop {
          display: none;
        }

        .mobile-only-btn {
          display: none;
        }

        .desktop-only-btn {
          display: flex;
        }

        /* ================= DESKTOP SIDEBAR (> 900px) ================= */
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
          overflow: hidden;
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
          overflow: hidden;
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

        /* ================= MOBILE DRAWER ARCHITECTURE (<= 900px) ================= */
        @media (max-width: 900px) {
          /* 1. Mobile Top Header */
          .mobile-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            width: 100%;
            height: 48px;
            background: #0A0A0A;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            z-index: 40;
            position: fixed;
            top: 0;
            inset-inline: 0;
            box-sizing: border-box;
          }

          .hamburger-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            cursor: pointer;
            background: #171717;
            border: none;
            transition: background 0.15s ease;
          }

          .hamburger-btn:hover {
            background: #222529;
          }

          .hamburger-icon-shape {
            width: 18px;
            height: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .hamburger-icon-shape span {
            display: block;
            height: 2px;
            width: 100%;
            background: #D9D9D9;
            border-radius: 2px;
          }

          .mobile-header-meta {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }

          .token-balance-pill {
            width: 64px;
            height: 20px;
            background: #171717;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 9999px;
            display: flex;
            align-items: center;
            padding: 0 6px;
            gap: 4px;
          }

          .token-icon-dot {
            width: 8px;
            height: 8px;
            background: #d1fe17;
            border-radius: 50%;
          }

          .token-text-wire {
            width: 36px;
            height: 6px;
            background: #D9D9D9;
            border-radius: 9999px;
          }

          .mobile-avatar-btn {
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: #D9D9D9;
            border: 2px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            flex-shrink: 0;
          }

          /* 2. Slide-over Backdrop */
          .mobile-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(2px);
            z-index: 90;
            animation: backdropFadeIn 0.2s ease;
          }

          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* 3. Slide-over Drawer Sidebar (256px, NO bottom bar!) */
          .studio-sidebar,
          .studio-sidebar.expanded,
          .studio-sidebar.collapsed {
            position: fixed;
            top: 0;
            bottom: 0;
            inset-inline-start: 0;
            width: 256px;
            min-width: 256px;
            height: 100dvh;
            background: #131517;
            border-inline-end: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.85);
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 8px;
            flex-direction: column;
            overflow-y: auto;
          }

          :global([dir="rtl"]) .studio-sidebar,
          :global([dir="rtl"]) .studio-sidebar.expanded,
          :global([dir="rtl"]) .studio-sidebar.collapsed {
            transform: translateX(100%);
          }

          /* Open Drawer State */
          .studio-sidebar.mobile-open,
          :global([dir="rtl"]) .studio-sidebar.mobile-open {
            transform: translateX(0);
          }

          /* 4. Controls inside Drawer Header */
          .desktop-only-btn {
            display: none;
          }

          .mobile-only-btn {
            display: flex;
          }

          .close-drawer-btn {
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: #171717;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-inline-start: 6px;
            transition: background 0.15s ease;
            position: relative;
          }

          .close-drawer-btn:hover {
            background: #222529;
          }

          .close-x-shape {
            width: 16px;
            height: 16px;
            position: relative;
          }

          .close-x-shape::before,
          .close-x-shape::after {
            content: '';
            position: absolute;
            top: 7px;
            left: 0;
            width: 16px;
            height: 2px;
            background: #D9D9D9;
            border-radius: 2px;
          }

          .close-x-shape::before {
            transform: rotate(45deg);
          }

          .close-x-shape::after {
            transform: rotate(-45deg);
          }

          /* Drawer elements always display expanded on mobile */
          .studio-sidebar.collapsed .header {
            justify-content: space-between;
          }

          .studio-sidebar.collapsed :global(.brand-box) {
            display: flex;
          }

          .studio-sidebar.collapsed .label-pill {
            display: block;
          }

          .studio-sidebar.collapsed :global(.nav-btn) {
            width: 100%;
            height: 40px;
            padding: 0 10px;
            justify-content: flex-start;
          }

          .studio-sidebar.collapsed .profile-trigger-btn {
            width: 100%;
            height: 56px;
            padding: 8px 10px;
            justify-content: flex-start;
          }

          .studio-sidebar.collapsed .meta {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
