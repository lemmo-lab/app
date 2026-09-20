/**
 * Profile & Settings Popover — Production Implementation
 *
 * Provides a comprehensive, accessible user account & workspace settings menu:
 * - Current plan review & live token/credit usage progress bar
 * - Workspace Default 1-click switch action (Agent Studio ⇄ Canvas Pipeline)
 * - Explicit Settings entrypoint (/settings)
 * - Billing & Plans (/settings/billing)
 * - API Keys & Integrations
 * - Modern Floating Language Dropdown (Non-expanding, zero-stretch floating menu)
 * - Secure logout action
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Styleguide) & @lemmo-lab/tokens (Dual SSOT)
 * - DOC-DS-008 (Concentric radius: outer 16px - padding 8px = inner 8px)
 * - DOC-DS-010 (WCAG 1.4.13: Dismissible via Escape, Hoverable, Persistent)
 * - DOC-DS-011 (Agent-operable: Name/Role/Value, stable data-action attributes)
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard01,
  Settings01,
  Key01,
  Globe01,
  Logout01,
  LayersThree,
  Check01,
  Sparks,
  Maximize01,
} from 'synthline/react';
import { useUiStore, Locale, Direction, DefaultWorkspace } from '@/stores/uiStore';

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'popover' | 'sheet';
}

interface LanguageOption {
  code: Locale;
  nameFa: string;
  nameEn: string;
  nativeName: string;
  dir: Direction;
}

const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'fa',
    nameFa: 'فارسی',
    nameEn: 'Persian',
    nativeName: 'فارسی',
    dir: 'rtl',
  },
  {
    code: 'en',
    nameFa: 'انگلیسی',
    nameEn: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
];

export default function ProfilePopover({
  isOpen,
  onClose,
  variant = 'popover',
}: ProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { locale, dir, setLocale, defaultWorkspace, setDefaultWorkspace } = useUiStore();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const isRtl = dir === 'rtl';

  // Popover close and Escape handler
  useEffect(() => {
    if (!isOpen) {
      setLanguageDropdownOpen(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (languageDropdownOpen) {
          setLanguageDropdownOpen(false);
        } else {
          onClose();
        }
      }
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
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, languageDropdownOpen]);

  // Click-outside listener specifically for closing the floating language dropdown
  useEffect(() => {
    if (!languageDropdownOpen) return;

    const handleLangOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        langDropdownRef.current &&
        target &&
        !langDropdownRef.current.contains(target)
      ) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleLangOutside);
    return () => {
      document.removeEventListener('click', handleLangOutside);
    };
  }, [languageDropdownOpen]);

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
        style={
          variant === 'popover'
            ? {
                [isRtl ? 'right' : 'left']: 'calc(100% + 8px)',
                [isRtl ? 'left' : 'right']: 'auto',
              }
            : undefined
        }
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
          {/* 1. Workspace Default Toggle (1-Click Switch Action) */}
          <div
            className="menu-item-row workspace-default-row"
            onClick={() => {
              setDefaultWorkspace(defaultWorkspace === 'agent' ? 'canvas' : 'agent');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDefaultWorkspace(defaultWorkspace === 'agent' ? 'canvas' : 'agent');
              }
            }}
            title={
              locale === 'fa'
                ? `محیط پیش‌فرض: ${defaultWorkspace === 'agent' ? 'ایجنت استودیو' : 'بوم لایه‌ها'} (کلیک برای تغییر)`
                : `Default Workspace: ${defaultWorkspace === 'agent' ? 'Agent Studio' : 'Canvas Pipeline'} (Click to toggle)`
            }
            aria-label={locale === 'fa' ? 'تغییر محیط پیش‌فرض' : 'Toggle default workspace'}
            data-action="toggle-default-workspace"
          >
            <div className="item-main-info">
              <span className="icon-wrapper">
                <LayersThree size={18} strokeWidth={1.5} color="currentColor" />
              </span>
              <span className="item-label">
                {locale === 'fa' ? 'محیط پیش‌فرض' : 'Default Workspace'}
              </span>
            </div>

            <div className={`workspace-action-pill ${defaultWorkspace}`}>
              {defaultWorkspace === 'agent' ? (
                <>
                  <Sparks size={12} strokeWidth={2.2} color="currentColor" />
                  <span className="pill-text">{locale === 'fa' ? 'ایجنت' : 'Agent'}</span>
                </>
              ) : (
                <>
                  <Maximize01 size={12} strokeWidth={2.2} color="currentColor" />
                  <span className="pill-text">{locale === 'fa' ? 'بوم' : 'Canvas'}</span>
                </>
              )}
            </div>
          </div>

          {/* 2. Settings Entrypoint */}
          <Link
            href="/settings"
            className="menu-item-btn"
            onClick={onClose}
            role="menuitem"
            data-action="nav-settings"
          >
            <span className="icon-wrapper">
              <Settings01 size={18} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="item-label">
              {locale === 'fa' ? 'تنظیمات' : 'Settings'}
            </span>
          </Link>

          {/* 3. Billing & Plans */}
          <Link
            href="/settings/billing"
            className="menu-item-btn"
            onClick={onClose}
            role="menuitem"
            data-action="nav-billing"
          >
            <span className="icon-wrapper">
              <CreditCard01 size={18} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="item-label">
              {locale === 'fa' ? 'طرح‌ها و صورت‌حساب' : 'Billing & Plans'}
            </span>
          </Link>

          {/* 4. API Keys */}
          <Link
            href="/settings?tab=api"
            className="menu-item-btn"
            onClick={onClose}
            role="menuitem"
            data-action="open-api-keys"
          >
            <span className="icon-wrapper">
              <Key01 size={18} strokeWidth={1.5} color="currentColor" />
            </span>
            <span className="item-label">
              {locale === 'fa' ? 'کلیدهای API و یکپارچه‌سازی' : 'API Keys & Integrations'}
            </span>
          </Link>

          {/* 5. Language Switcher (Modern Floating Popover Dropdown — Zero stretching) */}
          <div className="language-dropdown-wrapper" ref={langDropdownRef}>
            <div
              className={`menu-item-row language-trigger-row ${languageDropdownOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setLanguageDropdownOpen(!languageDropdownOpen);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLanguageDropdownOpen(!languageDropdownOpen);
                }
              }}
              aria-haspopup="listbox"
              aria-expanded={languageDropdownOpen}
              title={locale === 'fa' ? 'انتخاب زبان سیستم' : 'Select system language'}
              data-action="toggle-language-dropdown"
            >
              <div className="item-main-info">
                <span className="icon-wrapper">
                  <Globe01 size={18} strokeWidth={1.5} color="currentColor" />
                </span>
                <span className="item-label">
                  {locale === 'fa' ? 'زبان' : 'Language'}
                </span>
              </div>

              <div className={`language-select-trigger ${languageDropdownOpen ? 'open' : ''}`}>
                <span className="current-lang-pill">
                  {locale === 'fa' ? 'فارسی' : 'English'}
                </span>
                <span className={`trigger-chevron ${languageDropdownOpen ? 'rotated' : ''}`} aria-hidden="true">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Modern Floating Dropdown Panel (Anchored above, never stretches parent) */}
            {languageDropdownOpen && (
              <div
                className="language-floating-menu"
                role="listbox"
                aria-label={locale === 'fa' ? 'انتخاب زبان سیستم' : 'Select System Language'}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="floating-menu-header">
                  <span className="header-label">
                    {locale === 'fa' ? 'زبان سیستم' : 'System Language'}
                  </span>
                </div>

                <div className="floating-lang-list">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = locale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        className={`floating-lang-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setLocale(lang.code);
                          setLanguageDropdownOpen(false);
                        }}
                        role="option"
                        aria-selected={isSelected}
                        data-action={`select-locale-${lang.code}`}
                      >
                        <div className="lang-meta-info">
                          <span className="lang-title">{lang.nativeName}</span>
                          <span className="lang-subtitle">
                            {locale === 'fa' ? lang.nameFa : lang.nameEn} • {lang.dir.toUpperCase()}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="lang-check" aria-hidden="true">
                            <Check01 size={14} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="floating-menu-footer">
                  <span>
                    {locale === 'fa' ? '+ زبان‌های بیشتر به‌زودی' : '+ More languages coming soon'}
                  </span>
                </div>
              </div>
            )}
          </div>
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
            <Logout01 size={18} strokeWidth={1.5} color="currentColor" />
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
            width: 290px;
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
            border-radius: var(--lemmo-radius-base, 8px);
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

          .menu-item-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 7px var(--lemmo-space-200, 8px);
            border-radius: var(--lemmo-radius-base, 8px);
            color: var(--lemmo-text-secondary, #a1a1a5);
            font-size: var(--lemmo-type-size-200, 0.875rem);
            font-weight: var(--lemmo-font-weight-medium, 500);
            transition: background 0.15s ease, color 0.15s ease;
            cursor: pointer;
            user-select: none;
          }

          .menu-item-row:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--lemmo-text-primary, #e1e1e3);
          }

          .menu-item-row:focus-visible {
            outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
            outline-offset: 1px;
          }

          .item-main-info {
            display: flex;
            align-items: center;
            gap: var(--lemmo-space-200, 8px);
            min-width: 0;
            flex: 1;
          }

          :global(.menu-item-btn) {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--lemmo-space-200, 8px);
            padding: 7px var(--lemmo-space-200, 8px);
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

          /* ================= Workspace Default Toggle Pill ================= */
          .workspace-default-row {
            cursor: pointer;
          }

          .workspace-action-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 9px;
            border-radius: var(--lemmo-radius-pill, 9999px);
            background: rgba(209, 254, 23, 0.1);
            border: 1px solid rgba(209, 254, 23, 0.28);
            color: var(--lemmo-surface-brand-background, #d1fe17);
            font-size: 0.6875rem;
            font-weight: 700;
            transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            flex-shrink: 0;
          }

          .workspace-action-pill:hover,
          .workspace-default-row:hover .workspace-action-pill {
            background: rgba(209, 254, 23, 0.18);
            border-color: rgba(209, 254, 23, 0.45);
            transform: scale(1.02);
          }

          .pill-text {
            white-space: nowrap;
          }

          /* ================= Language Dropdown (Floating) ================= */
          .language-dropdown-wrapper {
            position: relative;
            width: 100%;
          }

          .language-trigger-row {
            cursor: pointer;
          }

          .language-trigger-row:hover,
          .language-trigger-row.active {
            background: rgba(255, 255, 255, 0.06);
            color: #ffffff;
          }

          .language-select-trigger {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 8px;
            border-radius: var(--lemmo-radius-pill, 9999px);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--lemmo-text-secondary, #cccccc);
            font-size: 0.6875rem;
            font-weight: 600;
            transition: all 0.15s ease;
            flex-shrink: 0;
          }

          .language-trigger-row:hover .language-select-trigger,
          .language-select-trigger.open {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
          }

          .current-lang-pill {
            white-space: nowrap;
          }

          .trigger-chevron {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--lemmo-text-muted, #898a8b);
            transition: transform 0.2s ease;
          }

          .trigger-chevron.rotated {
            transform: rotate(180deg);
          }

          /* Floating Modern Dropdown Panel */
          .language-floating-menu {
            position: absolute;
            bottom: calc(100% + 6px);
            inset-inline-end: 0;
            width: 210px;
            background: rgba(22, 24, 27, 0.98);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: var(--lemmo-radius-lg, 12px);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 2px 10px rgba(0, 0, 0, 0.4);
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            z-index: 250;
            animation: floatMenuIn 0.16s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes floatMenuIn {
            from {
              opacity: 0;
              transform: translateY(6px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .floating-menu-header {
            padding: 6px 10px 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            margin-bottom: 2px;
          }

          .header-label {
            font-size: 0.6875rem;
            font-weight: 700;
            color: var(--lemmo-text-muted, #898a8b);
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .floating-lang-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .floating-lang-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 7px 10px;
            border-radius: var(--lemmo-radius-md, 8px);
            background: transparent;
            border: none;
            cursor: pointer;
            font-family: inherit;
            text-align: start;
            color: var(--lemmo-text-secondary, #b5b6b8);
            transition: all 0.12s ease;
          }

          .floating-lang-btn:hover {
            background: rgba(255, 255, 255, 0.06);
            color: #ffffff;
          }

          .floating-lang-btn.active {
            background: rgba(209, 254, 23, 0.1);
            color: var(--lemmo-surface-brand-background, #d1fe17);
            font-weight: 600;
          }

          .lang-meta-info {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }

          .lang-title {
            font-size: 0.75rem;
            font-weight: 600;
          }

          .lang-subtitle {
            font-size: 0.625rem;
            color: var(--lemmo-text-muted, #7c7e80);
          }

          .lang-check {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .floating-menu-footer {
            padding: 6px 10px 2px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 2px;
            font-size: 0.625rem;
            color: var(--lemmo-text-muted, #707275);
            font-style: italic;
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
