/**
 * Studio Sidebar — Production Implementation
 *
 * Workspace navigation rail with 2 responsive display contexts:
 *
 * 1. Desktop (> 900px):
 *    - Expanded state (256px) with horizontal rows, Synthline icons, typography labels, brand mark, and profile meta.
 *    - Collapsed state (72px) with centered icons, centered header toggle, and circular 40px avatar.
 *
 * 2. Mobile (<= 900px):
 *    - Top App Header (48px) with Hamburger button (inline-start), live token pill, and profile avatar (inline-end).
 *    - Slide-over Navigation Drawer (256px) with backdrop, close button, full navigation categories, and profile.
 *    - NO bottom bar (strict architecture constraint).
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Styleguide) & @lemmo-lab/tokens (Dual SSOT)
 * - DOC-BRAND-001 (Lemmo 3-dot triad mark, 32px logo box)
 * - DOC-DS-004 (Synthline icon ladder: 20px, strokeWidth 1.5, currentColor)
 * - DOC-DS-007 & DOC-DS-008 (Concentric radii & 4px ladder)
 * - DOC-DS-011 (Accessible names, stable data-action attributes)
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass01,
  AiRobot01,
  FolderCopy,
  LayersThree,
  AiMagicWand01,
  Image03,
  Menu02,
  ChevronLeft,
  ChevronRight,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import ProfilePopover from './ProfilePopover';

export default function StudioSidebar() {
  const pathname = usePathname();
  const { locale, dir } = useUiStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Active route detection
  const isFeedActive = pathname === '/app' || pathname.startsWith('/app/feed');
  const isAgentActive = pathname.startsWith('/app/agent');
  const isAssetsActive = pathname.startsWith('/app/assets');
  const isCanvasActive = pathname === '/canvas' || pathname.startsWith('/app/canvas');
  const isToolsActive = pathname === '/tools' || pathname.startsWith('/app/tools');
  const isGalleryActive = pathname.startsWith('/gallery');
  const isSettingsActive = pathname.startsWith('/settings');

  const closeMobileDrawer = () => setMobileOpen(false);
  const isRtl = dir === 'rtl';

  return (
    <>
      {/* ================= MOBILE TOP APP HEADER (<= 900px) ================= */}
      <header className="mobile-header" aria-label="Mobile Navigation Header">
        {/* Hamburger Menu Button */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setMobileOpen(true)}
          title={locale === 'fa' ? 'باز کردن منو' : 'Open Navigation Menu'}
          aria-label={locale === 'fa' ? 'باز کردن منو' : 'Open Navigation Menu'}
          aria-expanded={mobileOpen}
          data-action="open-mobile-drawer"
        >
          <Menu02 size={22} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* User Meta: Live Token Balance Pill & Profile Avatar Trigger */}
        <div className="mobile-header-meta">
          <Link
            href="/settings/billing"
            className="token-balance-pill"
            title={locale === 'fa' ? 'اعتبار توکن‌ها' : 'Token Balance'}
            data-action="view-tokens"
          >
            <span className="token-icon-dot" />
            <span className="token-text" data-numeric>
              2,450
            </span>
          </Link>

          <button
            type="button"
            className="mobile-avatar-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSheetOpen(!mobileSheetOpen);
            }}
            title={locale === 'fa' ? 'حساب کاربری و تنظیمات' : 'Account & Settings'}
            aria-label={locale === 'fa' ? 'حساب کاربری و تنظیمات' : 'Account & Settings'}
            aria-expanded={mobileSheetOpen}
            data-action="open-profile-menu-mobile"
          >
            <span className="avatar-initials">LM</span>
            <span className="status-dot" />
          </button>
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

      {/* ================= MOBILE BOTTOM SHEET (MOUNTED OUTSIDE SIDEBAR TO AVOID TRANSFORM CLIPPING) ================= */}
      <ProfilePopover
        variant="sheet"
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
      />

      {/* ================= MAIN STUDIO SIDEBAR / DRAWER ================= */}
      <aside
        className={`studio-sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
        aria-label={locale === 'fa' ? 'ناوبری استودیو' : 'Studio Navigation'}
      >
        {/* Header: Brand Logo + Expand/Collapse Toggle (Desktop) / Close Button (Mobile) */}
        <div className="header">
          {/* Desktop Collapsed Toggle: Hover changes 3-dot logo to expand chevron */}
          {!isExpanded ? (
            <button
              type="button"
              className="collapsed-brand-toggle desktop-only-btn"
              onClick={() => setIsExpanded(true)}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              title={locale === 'fa' ? 'باز کردن نوار کناری' : 'Expand sidebar'}
              aria-label={locale === 'fa' ? 'باز کردن نوار کناری' : 'Expand sidebar'}
              data-action="expand-sidebar"
            >
              <div className="logo-box" aria-hidden="true">
                {isLogoHovered ? (
                  isRtl ? (
                    <ChevronLeft size={20} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                  ) : (
                    <ChevronRight size={20} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                  )
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M143.836 311.343C174.673 311.343 199.671 336.341 199.671 367.178C199.671 398.015 174.673 423.014 143.836 423.014C112.998 423.014 88 398.015 88 367.178C88 336.341 112.998 311.343 143.836 311.343Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                    <path
                      d="M367.178 311.343C398.015 311.343 423.014 336.341 423.014 367.178C423.014 398.015 398.015 423.014 367.178 423.014C336.341 423.014 311.343 398.015 311.343 367.178C311.343 336.341 336.341 311.343 367.178 311.343Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                    <path
                      d="M255.507 88C286.344 88 311.343 112.998 311.343 143.836C311.343 174.673 286.344 199.671 255.507 199.671C224.67 199.671 199.671 174.673 199.671 143.836C199.671 112.998 224.67 88 255.507 88Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                  </svg>
                )}
              </div>
            </button>
          ) : (
            <>
              <Link
                href="/app"
                className="brand-box desktop-only-btn"
                title={locale === 'fa' ? 'صفحه اصلی لیمو استودیو' : 'Lemmo Studio Home'}
                data-action="nav-home"
              >
                <div className="logo-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M143.836 311.343C174.673 311.343 199.671 336.341 199.671 367.178C199.671 398.015 174.673 423.014 143.836 423.014C112.998 423.014 88 398.015 88 367.178C88 336.341 112.998 311.343 143.836 311.343Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                    <path
                      d="M367.178 311.343C398.015 311.343 423.014 336.341 423.014 367.178C423.014 398.015 398.015 423.014 367.178 423.014C336.341 423.014 311.343 398.015 311.343 367.178C311.343 336.341 336.341 311.343 367.178 311.343Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                    <path
                      d="M255.507 88C286.344 88 311.343 112.998 311.343 143.836C311.343 174.673 286.344 199.671 255.507 199.671C224.67 199.671 199.671 174.673 199.671 143.836C199.671 112.998 224.67 88 255.507 88Z"
                      fill="var(--lemmo-surface-brand-background, #d1fe17)"
                    />
                  </svg>
                </div>
                <span className="brand-wordmark">lemmo</span>
              </Link>

              {/* Desktop Collapse Toggle Button */}
              <button
                type="button"
                className="toggle-btn desktop-only-btn"
                onClick={() => setIsExpanded(false)}
                title={locale === 'fa' ? 'بستن نوار کناری' : 'Collapse sidebar'}
                aria-label={locale === 'fa' ? 'بستن نوار کناری' : 'Collapse sidebar'}
                data-action="collapse-sidebar"
              >
                {isRtl ? (
                  <ChevronRight size={18} strokeWidth={1.5} color="currentColor" />
                ) : (
                  <ChevronLeft size={18} strokeWidth={1.5} color="currentColor" />
                )}
              </button>
            </>
          )}

          {/* Mobile Drawer Header: Always Logo + Wordmark */}
          <Link
            href="/app"
            className="brand-box mobile-only-btn"
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'صفحه اصلی لیمو استودیو' : 'Lemmo Studio Home'}
            data-action="nav-home-mobile"
          >
            <div className="logo-box" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M143.836 311.343C174.673 311.343 199.671 336.341 199.671 367.178C199.671 398.015 174.673 423.014 143.836 423.014C112.998 423.014 88 398.015 88 367.178C88 336.341 112.998 311.343 143.836 311.343Z"
                  fill="var(--lemmo-surface-brand-background, #d1fe17)"
                />
                <path
                  d="M367.178 311.343C398.015 311.343 423.014 336.341 423.014 367.178C423.014 398.015 398.015 423.014 367.178 423.014C336.341 423.014 311.343 398.015 311.343 367.178C311.343 336.341 336.341 311.343 367.178 311.343Z"
                  fill="var(--lemmo-surface-brand-background, #d1fe17)"
                />
                <path
                  d="M255.507 88C286.344 88 311.343 112.998 311.343 143.836C311.343 174.673 286.344 199.671 255.507 199.671C224.67 199.671 199.671 174.673 199.671 143.836C199.671 112.998 224.67 88 255.507 88Z"
                  fill="var(--lemmo-surface-brand-background, #d1fe17)"
                />
              </svg>
            </div>
            <span className="brand-wordmark">lemmo</span>
          </Link>

          {/* Mobile Close Button (X) */}
          <button
            type="button"
            className="close-drawer-btn mobile-only-btn"
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'بستن منو' : 'Close navigation menu'}
            aria-label={locale === 'fa' ? 'بستن منو' : 'Close navigation menu'}
            data-action="close-mobile-drawer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary Category Nav Items */}
        <nav
          className="primary-cats"
          aria-label={locale === 'fa' ? 'بخش‌های اصلی' : 'Primary Categories'}
        >
          {/* 1. Feed / Home */}
          <Link
            href="/app"
            className={`nav-btn ${isFeedActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'کاوش و فید' : 'Community Feed'}
            data-action="nav-feed"
          >
            <span className="icon-slot">
              <Compass01 size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'کاوش و فید' : 'Feed'}
            </span>
            {isFeedActive && <span className="active-pill-indicator" />}
          </Link>

          {/* 2. Agent Studio */}
          <Link
            href="/app/agent"
            className={`nav-btn ${isAgentActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'استودیو ایجنت' : 'Agent Studio'}
            data-action="nav-agent"
          >
            <span className="icon-slot">
              <AiRobot01 size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'ایجنت استودیو' : 'Agent'}
            </span>
            {isAgentActive && <span className="active-pill-indicator" />}
          </Link>

          {/* 3. Assets */}
          <Link
            href="/app/assets"
            className={`nav-btn ${isAssetsActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'آرشیو دارایی‌ها' : 'Assets Archive'}
            data-action="nav-assets"
          >
            <span className="icon-slot">
              <FolderCopy size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'دارایی‌ها' : 'Assets'}
            </span>
            {isAssetsActive && <span className="active-pill-indicator" />}
          </Link>

          {/* 4. Canvas */}
          <Link
            href="/app/canvas"
            className={`nav-btn ${isCanvasActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'کانواس تعاملی' : 'Interactive Canvas'}
            data-action="nav-canvas"
          >
            <span className="icon-slot">
              <LayersThree size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'کانواس' : 'Canvas'}
            </span>
            {isCanvasActive && <span className="active-pill-indicator" />}
          </Link>
        </nav>

        {/* Specialized Tools Section */}
        <div
          className="tools-section"
          role="group"
          aria-label={locale === 'fa' ? 'ابزارها' : 'Specialized Tools'}
        >
          <Link
            href="/app/tools"
            className={`nav-btn ${isToolsActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'کاتالوگ ابزارها' : 'Tools Catalog'}
            data-action="nav-tools"
          >
            <span className="icon-slot">
              <AiMagicWand01 size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'ابزارها' : 'Tools'}
            </span>
            {isToolsActive && <span className="active-pill-indicator" />}
          </Link>
        </div>

        {/* Footer Navigation & Profile Trigger */}
        <div className="footer-sidebar">
          {/* Gallery */}
          <Link
            href="/gallery"
            className={`nav-btn ${isGalleryActive ? 'active' : ''}`}
            onClick={closeMobileDrawer}
            title={locale === 'fa' ? 'گالری عمومی' : 'Community Gallery'}
            data-action="nav-gallery"
          >
            <span className="icon-slot">
              <Image03 size={20} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="nav-label">
              {locale === 'fa' ? 'گالری' : 'Gallery'}
            </span>
            {isGalleryActive && <span className="active-pill-indicator" />}
          </Link>

          {/* User Profile & Settings Trigger */}
          <div className="profile-container">
            <button
              type="button"
              className={`profile-trigger-btn ${popoverOpen || isSettingsActive ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (typeof window !== 'undefined' && window.innerWidth <= 900) {
                  setMobileOpen(false);
                  setMobileSheetOpen(true);
                } else {
                  setPopoverOpen(!popoverOpen);
                }
              }}
              title={locale === 'fa' ? 'حساب کاربری و تنظیمات' : 'Account & Settings'}
              aria-label={locale === 'fa' ? 'حساب کاربری و تنظیمات' : 'Account & Settings'}
              aria-expanded={popoverOpen}
              data-action="toggle-profile-popover"
            >
              <div className="avatar-wrapper" aria-hidden="true">
                <span className="avatar-initials">LM</span>
                <span className="status-dot" />
              </div>
              <div className="user-meta">
                <span className="user-display-name">Behroz</span>
                <span className="user-plan-label">Pro Workspace</span>
              </div>
            </button>

            {/* Settings / Profile Popover Modal (Desktop) */}
            <ProfilePopover
              variant="popover"
              isOpen={popoverOpen}
              onClose={() => setPopoverOpen(false)}
            />
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

        :global(.mobile-only-btn),
        .mobile-only-btn {
          display: none !important;
        }

        :global(.desktop-only-btn),
        .desktop-only-btn {
          display: flex !important;
        }

        /* ================= DESKTOP SIDEBAR (> 900px) ================= */
        .studio-sidebar {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: var(--lemmo-space-200, 8px);
          height: 100dvh;
          background: var(--lemmo-page-background, #131517);
          position: sticky;
          top: 0;
          box-sizing: border-box;
          z-index: 50;
          border-inline-end: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          flex-shrink: 0;
          transition: width 0.24s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        /* Expanded State (256px — standard 8px grid aligned) */
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
          margin-bottom: var(--lemmo-space-200, 8px);
          position: relative;
        }

        :global(.brand-box) {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-200, 8px);
          text-decoration: none;
          padding: var(--lemmo-space-100, 4px);
          border-radius: var(--lemmo-radius-base, 8px);
          transition: opacity 0.15s ease;
        }

        :global(.brand-box:hover) {
          opacity: 0.88;
        }

        :global(.brand-box:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        .logo-box {
          width: 32px;
          height: 32px;
          border-radius: var(--lemmo-radius-base, 8px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.04));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .brand-wordmark {
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-size: var(--lemmo-type-size-400, 1.125rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        /* Collapse / Expand Toggle Button */
        .toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--lemmo-radius-base, 8px);
          background: transparent;
          border: 1px solid transparent;
          color: var(--lemmo-text-muted, #898a8b);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--lemmo-text-primary, #e1e1e3);
          border-color: var(--lemmo-border-subtle, rgba(255, 255, 255, 0.04));
        }

        .collapsed-brand-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: var(--lemmo-radius-base, 8px);
          cursor: pointer;
          transition: transform 0.15s ease;
          margin: 0 auto;
        }

        .collapsed-brand-toggle:hover .logo-box {
          background: var(--lemmo-surface-secondary-background, #23262a);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 12px rgba(209, 254, 23, 0.25);
        }

        .collapsed-brand-toggle:focus-visible {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        /* Centering header in collapsed mode */
        .studio-sidebar.collapsed .header {
          justify-content: center;
        }

        .studio-sidebar.collapsed .header :global(.brand-box) {
          margin: 0 auto;
        }

        .studio-sidebar.collapsed .toggle-btn {
          display: none;
        }

        /* Collapsed mode: hide labels and user meta on desktop */
        .studio-sidebar.collapsed:not(.mobile-open) .brand-wordmark,
        .studio-sidebar.collapsed:not(.mobile-open) .nav-label,
        .studio-sidebar.collapsed:not(.mobile-open) .user-meta {
          display: none;
        }

        .studio-sidebar.collapsed:not(.mobile-open) :global(.nav-btn) {
          padding: 0;
          justify-content: center;
        }

        .studio-sidebar.collapsed:not(.mobile-open) .active-pill-indicator {
          top: 6px;
          bottom: 6px;
          width: 3px;
        }

        .studio-sidebar.collapsed:not(.mobile-open) .profile-trigger-btn {
          padding: 0;
          justify-content: center;
        }

        /* ================= Navigation Rows ================= */
        .primary-cats {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--lemmo-space-100, 4px);
        }

        .tools-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-top: var(--lemmo-space-300, 12px);
          padding-top: var(--lemmo-space-300, 12px);
          border-top: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
        }

        .footer-sidebar {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-top: auto;
          gap: var(--lemmo-space-100, 4px);
          padding-top: var(--lemmo-space-200, 8px);
        }

        :global(.nav-btn) {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-300, 12px);
          height: 40px;
          width: 100%;
          padding: 0 var(--lemmo-space-300, 12px);
          border-radius: var(--lemmo-radius-base, 8px);
          text-decoration: none;
          color: var(--lemmo-text-secondary, #a1a1a5);
          background: transparent;
          border: 1px solid transparent;
          box-sizing: border-box;
          position: relative;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        :global(.nav-btn:hover) {
          background: rgba(255, 255, 255, 0.04);
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        :global(.nav-btn:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 1px;
        }

        :global(.nav-btn.active) {
          background: var(--lemmo-surface-primary-background, #1c1e20);
          color: var(--lemmo-text-primary, #e1e1e3);
          border-color: var(--lemmo-border-subtle, rgba(255, 255, 255, 0.04));
        }

        .icon-slot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: inherit;
        }

        :global(.nav-btn.active) .icon-slot {
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .nav-label {
          font-family: var(--lemmo-font-body, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-medium, 500);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .active-pill-indicator {
          position: absolute;
          inset-inline-start: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          border-radius: var(--lemmo-radius-pill, 9999px);
          box-shadow: 0 0 6px rgba(209, 254, 23, 0.6);
        }

        /* Collapsed mode centering */
        .studio-sidebar.collapsed :global(.nav-btn) {
          padding: 0;
          justify-content: center;
        }

        .studio-sidebar.collapsed .active-pill-indicator {
          top: 6px;
          bottom: 6px;
          width: 3px;
        }

        /* ================= User Profile Section ================= */
        .profile-container {
          position: relative;
          width: 100%;
          margin-top: var(--lemmo-space-100, 4px);
        }

        .profile-trigger-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-250, 10px);
          height: 52px;
          width: 100%;
          padding: var(--lemmo-space-150, 6px);
          border-radius: var(--lemmo-radius-base, 8px);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          box-sizing: border-box;
          transition: background 0.15s ease, border-color 0.15s ease;
          text-align: start;
        }

        .profile-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .profile-trigger-btn:focus-visible {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 1px;
        }

        .profile-trigger-btn.active {
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border-color: var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
        }

        .avatar-wrapper {
          width: 40px;
          height: 40px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: linear-gradient(135deg, #2a2d30 0%, #151718 100%);
          border: 1.5px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-weight: 700;
          font-size: 0.8125rem;
        }

        .status-dot {
          position: absolute;
          bottom: 1px;
          inset-inline-end: 1px;
          width: 9px;
          height: 9px;
          background: var(--lemmo-text-success, #4ee466);
          border-radius: var(--lemmo-radius-full, 9999px);
          border: 1.5px solid var(--lemmo-page-background, #131517);
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .user-display-name {
          font-family: var(--lemmo-font-body, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
          color: var(--lemmo-text-primary, #e1e1e3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-plan-label {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ================= MOBILE BREAKPOINT (<= 900px) ================= */
        @media (max-width: 900px) {
          .desktop-only-btn {
            display: none !important;
          }

          .mobile-only-btn {
            display: flex !important;
          }

          /* Force full drawer elements to always display on mobile */
          .studio-sidebar .brand-wordmark {
            display: inline-block !important;
          }

          .studio-sidebar .nav-label {
            display: inline-block !important;
          }

          .studio-sidebar .user-meta {
            display: flex !important;
          }

          .studio-sidebar :global(.nav-btn) {
            padding: 0 var(--lemmo-space-300, 12px) !important;
            justify-content: flex-start !important;
          }

          .studio-sidebar .profile-trigger-btn {
            padding: var(--lemmo-space-150, 6px) !important;
            justify-content: flex-start !important;
          }

          .studio-sidebar .header {
            justify-content: space-between !important;
          }

          /* 48px Top App Header */
          .mobile-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 48px;
            width: 100%;
            padding: 0 var(--lemmo-space-300, 12px);
            background: var(--lemmo-page-background, #131517);
            border-bottom: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
            position: fixed;
            top: 0;
            inset-inline: 0;
            z-index: 40;
            box-sizing: border-box;
          }

          .hamburger-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--lemmo-radius-base, 8px);
            background: transparent;
            border: none;
            color: var(--lemmo-text-primary, #e1e1e3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .hamburger-btn:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .hamburger-btn:focus-visible {
            outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          }

          .mobile-header-meta {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--lemmo-space-200, 8px);
          }

          :global(.token-balance-pill) {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 6px;
            height: 28px;
            padding: 0 10px;
            background: rgba(209, 254, 23, 0.08);
            border: 1px solid rgba(209, 254, 23, 0.2);
            border-radius: var(--lemmo-radius-pill, 9999px);
            text-decoration: none;
          }

          .token-icon-dot {
            width: 6px;
            height: 6px;
            border-radius: var(--lemmo-radius-full, 9999px);
            background: var(--lemmo-surface-brand-background, #d1fe17);
            box-shadow: 0 0 6px rgba(209, 254, 23, 0.6);
          }

          .token-text {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--lemmo-surface-brand-background, #d1fe17);
          }

          .mobile-avatar-btn {
            width: 32px;
            height: 32px;
            border-radius: var(--lemmo-radius-full, 9999px);
            background: linear-gradient(135deg, #2a2d30 0%, #151718 100%);
            border: 1.5px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
            position: relative;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-avatar-btn .avatar-initials {
            font-size: 0.6875rem;
            font-weight: 700;
            color: var(--lemmo-text-primary, #e1e1e3);
          }

          .mobile-avatar-btn .status-dot {
            width: 7px;
            height: 7px;
            bottom: 0;
            inset-inline-end: 0;
          }

          /* Backdrop */
          .mobile-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 90;
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          /* Slide-Over Drawer */
          .studio-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            inset-inline-start: 0;
            width: 256px !important;
            min-width: 256px !important;
            height: 100dvh;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.28s ease;
            box-shadow: 0 0 32px rgba(0, 0, 0, 0.85);
            visibility: hidden;
            pointer-events: none;
          }

          :global([dir='rtl']) .studio-sidebar,
          [dir='rtl'] .studio-sidebar {
            transform: translateX(100%);
          }

          .studio-sidebar.mobile-open {
            transform: translateX(0) !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }

          .close-drawer-btn {
            width: 32px;
            height: 32px;
            border-radius: var(--lemmo-radius-base, 8px);
            background: transparent;
            border: none;
            color: var(--lemmo-text-secondary, #a1a1a5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-drawer-btn:hover {
            background: rgba(255, 255, 255, 0.06);
            color: var(--lemmo-text-primary, #e1e1e3);
          }
        }
      `}</style>
    </>
  );
}
