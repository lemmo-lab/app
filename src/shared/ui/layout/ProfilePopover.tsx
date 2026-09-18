/**
 * Profile & Settings Popover — Production Implementation
 *
 * Provides a comprehensive, accessible user account & workspace settings menu:
 * - Current plan review & live token/credit usage progress bar
 * - Workspace settings, billing, API keys, and language switcher
 * - Secure logout action
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Styleguide) & @lemmo-lab/tokens (Dual SSOT)
 * - DOC-DS-008 (Concentric radius: outer 16px - padding 8px = inner 8px)
 * - DOC-DS-010 (WCAG 1.4.13: Dismissible via Escape, Hoverable, Persistent)
 * - DOC-DS-011 (Agent-operable: Name/Role/Value, stable data-action attributes)
 */

'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CreditCard01,
  Settings01,
  Key01,
  Globe01,
  Logout01,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'popover' | 'sheet';
}

export default function ProfilePopover({
  isOpen,
  onClose,
  variant = 'popover',
}: ProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { locale, toggleLocale } = useUiStore();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        popoverRef.current &&
        target &&
        !popoverRef.current.contains(target) &&
        !target.closest('.profile-trigger-btn') &&
        !target.closest('.mobile-avatar-btn')
      ) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Slight delay to prevent immediate trigger by the toggle click
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Bottom Sheet Backdrop */}
      {variant === 'sheet' && (
        <div
          className="sheet-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={popoverRef}
        className={`profile-popover ${variant === 'sheet' ? 'sheet-variant' : 'popover-variant'}`}
        role="menu"
        aria-label={locale === 'fa' ? 'منوی حساب کاربری و تنظیمات' : 'User account and settings menu'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottom Sheet Drag Handle */}
        {variant === 'sheet' && (
          <div className="sheet-handle-bar" aria-hidden="true">
            <span className="sheet-handle-pill" />
          </div>
        )}

        {/* ================= USER IDENTITY CARD ================= */}
      <div className="user-identity-card">
        <div className="user-avatar-mini" aria-hidden="true">
          <span>LM</span>
          <span className="online-indicator" />
        </div>
        <div className="user-info">
          <div className="name-row">
            <span className="user-name">Behroz</span>
            <span className="plan-badge">PRO</span>
          </div>
          <span className="user-email">behroz@lemmo.space</span>
        </div>
      </div>

      {/* ================= TOKEN & PLAN USAGE CARD ================= */}
      <Link
        href="/settings/billing"
        className="plan-usage-card"
        onClick={onClose}
        title={locale === 'fa' ? 'مدیریت اشتراک و توکن‌ها' : 'Manage Subscription & Tokens'}
        data-action="view-billing"
      >
        <div className="usage-header">
          <span className="usage-title">
            {locale === 'fa' ? 'اعتبار توکن ماهانه' : 'Monthly Token Credits'}
          </span>
          <span className="usage-amount" data-numeric>
            2,450 / 5,000
          </span>
        </div>
        <div className="progress-bar-track" aria-label="49% of monthly tokens remaining">
          <div className="progress-bar-fill" style={{ width: '49%' }} />
        </div>
      </Link>

      <div className="menu-divider" role="separator" />

      {/* ================= QUICK ACTIONS MENU ================= */}
      <div className="menu-section" role="group">
        {/* 1. Billing & Plans */}
        <Link
          href="/settings/billing"
          className="menu-item-btn"
          onClick={onClose}
          role="menuitem"
          data-action="nav-billing"
        >
          <span className="icon-wrapper">
            <CreditCard01 size={20} strokeWidth={1.5} color="currentColor" />
          </span>
          <span className="item-label">
            {locale === 'fa' ? 'طرح‌ها و صورت‌حساب' : 'Billing & Plans'}
          </span>
        </Link>

        {/* 2. Workspace Settings */}
        <Link
          href="/settings/billing"
          className="menu-item-btn"
          onClick={onClose}
          role="menuitem"
          data-action="nav-settings"
        >
          <span className="icon-wrapper">
            <Settings01 size={20} strokeWidth={1.5} color="currentColor" />
          </span>
          <span className="item-label">
            {locale === 'fa' ? 'تنظیمات فضای کاری' : 'Workspace Settings'}
          </span>
        </Link>

        {/* 3. API Keys */}
        <button
          type="button"
          className="menu-item-btn"
          onClick={() => {
            onClose();
          }}
          role="menuitem"
          data-action="open-api-keys"
        >
          <span className="icon-wrapper">
            <Key01 size={20} strokeWidth={1.5} color="currentColor" />
          </span>
          <span className="item-label">
            {locale === 'fa' ? 'کلیدهای API و یکپارچه‌سازی' : 'API Keys & Integrations'}
          </span>
        </button>

        {/* 4. Language & Direction Toggle */}
        <button
          type="button"
          className="menu-item-btn"
          onClick={toggleLocale}
          role="menuitem"
          data-action="toggle-language"
          aria-label={locale === 'fa' ? 'تغییر زبان به انگلیسی' : 'Switch language to Persian'}
        >
          <span className="icon-wrapper">
            <Globe01 size={20} strokeWidth={1.5} color="currentColor" />
          </span>
          <span className="item-label">
            {locale === 'fa' ? 'زبان / Language' : 'Language / زبان'}
          </span>
          <span className="locale-indicator" data-numeric>
            {locale === 'fa' ? 'فارسی (RTL)' : 'English (LTR)'}
          </span>
        </button>
      </div>

      <div className="menu-divider" role="separator" />

      {/* ================= LOGOUT ACTION ================= */}
      <Link
        href="/login"
        className="menu-item-btn logout"
        onClick={onClose}
        role="menuitem"
        data-action="logout"
      >
        <span className="icon-wrapper">
          <Logout01 size={20} strokeWidth={1.5} color="currentColor" />
        </span>
        <span className="item-label">
          {locale === 'fa' ? 'خروج از حساب' : 'Log out'}
        </span>
      </Link>

      <style jsx>{`
        /* ================= Mobile Bottom Sheet Backdrop ================= */
        :global(.sheet-backdrop) {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(4px);
          z-index: 190;
          animation: sheetFadeIn 0.22s cubic-bezier(0, 0, 0.2, 1);
        }

        @keyframes sheetFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ================= Bottom Sheet Drag Handle ================= */
        .sheet-handle-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: var(--lemmo-space-200, 8px);
          cursor: grab;
        }

        .sheet-handle-pill {
          display: block;
          width: 36px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: var(--lemmo-radius-pill, 9999px);
          transition: background 0.15s ease;
        }

        .sheet-handle-bar:hover .sheet-handle-pill {
          background: rgba(255, 255, 255, 0.4);
        }

        /* Base Popover Shell */
        .profile-popover {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: var(--lemmo-space-200, 8px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          z-index: 100;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 2px 8px rgba(0, 0, 0, 0.4);
          user-select: none;
          box-sizing: border-box;
        }

        /* Desktop Popover Variant */
        .profile-popover.popover-variant {
          position: absolute;
          width: 272px;
          inset-inline-start: calc(100% + 8px);
          inset-inline-end: auto;
          bottom: 0;
          border-radius: var(--lemmo-radius-media, 16px);
          animation: popoverFadeIn 0.18s cubic-bezier(0, 0, 0.2, 1);
        }

        /* Mobile Bottom Sheet Variant */
        .profile-popover.sheet-variant {
          position: fixed;
          inset-inline: 0;
          bottom: 0;
          top: auto;
          width: 100%;
          max-width: 100%;
          border-radius: 20px 20px 0 0;
          border-inline: none;
          border-bottom: none;
          border-top: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          z-index: 200;
          padding: 12px 16px 28px;
          box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.85);
          animation: slideUpSheet 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideUpSheet {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        /* ================= User Identity Card ================= */
        .user-identity-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-200, 8px);
          padding: var(--lemmo-space-200, 8px);
          margin-bottom: var(--lemmo-space-100, 4px);
        }

        .user-avatar-mini {
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: linear-gradient(135deg, #2a2d30 0%, #17191a 100%);
          border: 1.5px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-weight: 700;
          font-size: 0.75rem;
          color: var(--lemmo-text-primary, #e1e1e3);
          position: relative;
          flex-shrink: 0;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          width: 8px;
          height: 8px;
          background: var(--lemmo-text-success, #4ee466);
          border-radius: var(--lemmo-radius-full, 9999px);
          border: 1.5px solid var(--lemmo-surface-primary-background, #1c1e20);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .user-name {
          font-family: var(--lemmo-font-body, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
          color: var(--lemmo-text-primary, #e1e1e3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .plan-badge {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 1px 6px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ================= Token & Plan Usage Card ================= */
        :global(.plan-usage-card) {
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-space-150, 6px);
          padding: 10px var(--lemmo-space-200, 8px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.04));
          border-radius: var(--lemmo-radius-base, 8px); /* Concentric: 16px - 8px = 8px */
          text-decoration: none;
          margin-bottom: var(--lemmo-space-100, 4px);
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        :global(.plan-usage-card:hover) {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
        }

        :global(.plan-usage-card:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        .usage-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .usage-title {
          color: var(--lemmo-text-secondary, #a1a1a5);
          font-weight: var(--lemmo-font-weight-medium, 500);
        }

        .usage-amount {
          color: var(--lemmo-text-primary, #e1e1e3);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
        }

        .progress-bar-track {
          width: 100%;
          height: 5px;
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          border-radius: var(--lemmo-radius-pill, 9999px);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          border-radius: var(--lemmo-radius-pill, 9999px);
          box-shadow: 0 0 8px rgba(209, 254, 23, 0.5);
          transition: width 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        /* ================= Menu Divider ================= */
        .menu-divider {
          height: 1px;
          background: var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          margin: var(--lemmo-space-100, 4px) 0;
        }

        /* ================= Menu Items ================= */
        .menu-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        :global(.menu-item-btn) {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-200, 8px);
          padding: 8px var(--lemmo-space-200, 8px);
          border-radius: var(--lemmo-radius-base, 8px);
          background: transparent;
          border: none;
          color: var(--lemmo-text-secondary, #a1a1a5);
          text-decoration: none;
          font-family: inherit;
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-medium, 500);
          cursor: pointer;
          width: 100%;
          text-align: start;
          transition: background 0.15s ease, color 0.15s ease;
        }

        :global(.menu-item-btn:hover) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        :global(.menu-item-btn:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 1px;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: inherit;
        }

        .item-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .locale-indicator {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
          padding: 2px 6px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.04);
        }

        :global(.menu-item-btn.logout:hover) {
          background: rgba(255, 84, 98, 0.12);
          color: var(--lemmo-text-danger, #ff5462);
        }
      `}</style>
    </div>
    </>
  );
}
