/**
 * Settings Page — Production Implementation
 *
 * Provides a comprehensive, accessible Settings hub for Lemmo Studio:
 * - General tab: Default Workspace switcher (Agent Studio vs Canvas Pipeline), Language switcher, Appearance
 * - Account & Profile tab: User identity, email, plan tier
 * - Plans & Billing tab: Subscription status & token credit balance
 * - API Keys tab: Developer tokens & webhooks
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Styleguide) & @lemmo-lab/tokens (Dual SSOT)
 * - DOC-DS-008 (Concentric radii & 4px spacing ladder)
 * - DOC-DS-011 (Accessible & Agent-operable)
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Settings01,
  LayersThree,
  Globe01,
  UserCheck01,
  CreditCard01,
  Key01,
  Check01,
  Sparks,
  Maximize01,
  ChevronLeft,
  ChevronRight,
  Shield01,
} from 'synthline/react';
import { useUiStore, Locale, DefaultWorkspace } from '@/stores/uiStore';

type SettingsTab = 'general' | 'account' | 'billing' | 'api';

function SettingsContent() {
  const searchParams = useSearchParams();
  const { locale, dir, setLocale, defaultWorkspace, setDefaultWorkspace } = useUiStore();
  const isRtl = dir === 'rtl';

  const initialTab = (searchParams.get('tab') as SettingsTab) || 'general';
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsTab;
    if (tabParam && ['general', 'account', 'billing', 'api'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="settings-page-wrapper">
      {/* Top Header & Breadcrumb */}
      <header className="settings-header">
        <div className="header-breadcrumbs">
          <Link href="/app" className="crumb-link">
            {locale === 'fa' ? 'استودیو' : 'Studio'}
          </Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">
            {locale === 'fa' ? 'تنظیمات' : 'Settings'}
          </span>
        </div>
        <h1 className="settings-page-title">
          {locale === 'fa' ? 'تنظیمات و ترجیحات' : 'Settings & Preferences'}
        </h1>
        <p className="settings-page-subtitle">
          {locale === 'fa'
            ? 'محیط پیش‌فرض فضای کاری، زبان رابط کاربری، حساب و کلیدهای دسترسی خود را سفارشی‌سازی کنید.'
            : 'Customize your default workspace, system language, account preferences, and API access keys.'}
        </p>
      </header>

      {/* Main Settings Layout: Side Navigation + Content Area */}
      <div className="settings-layout-grid">
        {/* Navigation Sidebar */}
        <aside className="settings-nav-aside" role="tablist" aria-label="Settings categories">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
            role="tab"
            aria-selected={activeTab === 'general'}
          >
            <Settings01 size={18} strokeWidth={1.7} color="currentColor" />
            <span>{locale === 'fa' ? 'عمومی و فضای کاری' : 'General & Workspace'}</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
            role="tab"
            aria-selected={activeTab === 'account'}
          >
            <UserCheck01 size={18} strokeWidth={1.7} color="currentColor" />
            <span>{locale === 'fa' ? 'حساب کاربری' : 'Account & Profile'}</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
            role="tab"
            aria-selected={activeTab === 'billing'}
          >
            <CreditCard01 size={18} strokeWidth={1.7} color="currentColor" />
            <span>{locale === 'fa' ? 'طرح‌ها و صورت‌حساب' : 'Billing & Plans'}</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
            role="tab"
            aria-selected={activeTab === 'api'}
          >
            <Key01 size={18} strokeWidth={1.7} color="currentColor" />
            <span>{locale === 'fa' ? 'کلیدهای API و اتصال‌ها' : 'API Keys & Webhooks'}</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="settings-content-main">
          {/* TAB 1: GENERAL & WORKSPACE */}
          {activeTab === 'general' && (
            <div className="settings-tab-panel">
              {/* SECTION: DEFAULT WORKSPACE */}
              <div className="settings-card-section">
                <div className="section-title-row">
                  <div className="section-title-box">
                    <span className="section-icon-badge">
                      <LayersThree size={20} strokeWidth={1.7} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    </span>
                    <div>
                      <h2 className="section-heading">
                        {locale === 'fa' ? 'محیط پیش‌فرض فضای کاری' : 'Default Workspace'}
                      </h2>
                      <p className="section-subtext">
                        {locale === 'fa'
                          ? 'انتخاب کنید هنگام ورود به فضای کاربری به کدام محیط هدایت شوید.'
                          : 'Choose which workspace environment opens when launching projects or navigating to the app.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="workspace-choice-cards">
                  {/* Option 1: Agent Studio */}
                  <div
                    className={`workspace-option-card ${defaultWorkspace === 'agent' ? 'selected' : ''}`}
                    onClick={() => setDefaultWorkspace('agent')}
                    role="button"
                    tabIndex={0}
                    aria-pressed={defaultWorkspace === 'agent'}
                  >
                    <div className="option-card-header">
                      <div className="option-icon-box">
                        <Sparks size={20} strokeWidth={2} color="currentColor" />
                      </div>
                      <div className="option-radio-dot">
                        {defaultWorkspace === 'agent' && <span className="inner-dot" />}
                      </div>
                    </div>
                    <h3 className="option-title">
                      {locale === 'fa' ? 'ایجنت استودیو' : 'Agent Studio'}
                    </h3>
                    <p className="option-desc">
                      {locale === 'fa'
                        ? 'محیط گفت‌وگومحور و پرامپت هوشمند با ابزارهای تولید چندرسانه‌ای و دستیار هوش مصنوعی.'
                        : 'Conversational and prompt-driven creation suite with multi-agent orchestration and generative models.'}
                    </p>
                    <div className="option-footer-status">
                      {defaultWorkspace === 'agent' ? (
                        <span className="status-badge-active">
                          <Check01 size={12} strokeWidth={2.4} />
                          <span>{locale === 'fa' ? 'پیش‌فرض فعال' : 'Active Default'}</span>
                        </span>
                      ) : (
                        <span className="status-badge-inactive">
                          {locale === 'fa' ? 'انتخاب به عنوان پیش‌فرض' : 'Set as Default'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Option 2: Canvas Pipeline */}
                  <div
                    className={`workspace-option-card ${defaultWorkspace === 'canvas' ? 'selected' : ''}`}
                    onClick={() => setDefaultWorkspace('canvas')}
                    role="button"
                    tabIndex={0}
                    aria-pressed={defaultWorkspace === 'canvas'}
                  >
                    <div className="option-card-header">
                      <div className="option-icon-box">
                        <Maximize01 size={20} strokeWidth={2} color="currentColor" />
                      </div>
                      <div className="option-radio-dot">
                        {defaultWorkspace === 'canvas' && <span className="inner-dot" />}
                      </div>
                    </div>
                    <h3 className="option-title">
                      {locale === 'fa' ? 'بوم لایه‌ها (Canvas)' : 'Canvas Pipeline'}
                    </h3>
                    <p className="option-desc">
                      {locale === 'fa'
                        ? 'بوم بی‌نهایت نودی جهت زنجیره‌سازی ابزارها، ویرایش لایه‌ای و خط لوله‌های پیچیده طراحی.'
                        : 'Node-based infinite canvas for visual chaining of AI tools, layered retouching, and pipelines.'}
                    </p>
                    <div className="option-footer-status">
                      {defaultWorkspace === 'canvas' ? (
                        <span className="status-badge-active">
                          <Check01 size={12} strokeWidth={2.4} />
                          <span>{locale === 'fa' ? 'پیش‌فرض فعال' : 'Active Default'}</span>
                        </span>
                      ) : (
                        <span className="status-badge-inactive">
                          {locale === 'fa' ? 'انتخاب به عنوان پیش‌فرض' : 'Set as Default'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: LANGUAGE & REGIONAL SETTINGS */}
              <div className="settings-card-section">
                <div className="section-title-row">
                  <div className="section-title-box">
                    <span className="section-icon-badge">
                      <Globe01 size={20} strokeWidth={1.7} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    </span>
                    <div>
                      <h2 className="section-heading">
                        {locale === 'fa' ? 'زبان رابط کاربری و جهت نوشتار' : 'Language & Text Direction'}
                      </h2>
                      <p className="section-subtext">
                        {locale === 'fa'
                          ? 'زبان مورد نظر خود را برای متون، چیدمان و منوهای سیستم انتخاب کنید.'
                          : 'Select your preferred language for interface elements, typography, and text orientation.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="language-choice-grid">
                  {/* Persian */}
                  <div
                    className={`language-choice-card ${locale === 'fa' ? 'selected' : ''}`}
                    onClick={() => setLocale('fa')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lang-flag-row">
                      <span className="lang-native-title">فارسی</span>
                      <span className="lang-code-badge">RTL • fa</span>
                    </div>
                    <p className="lang-desc">
                      راست‌چین کامل همراه با تایپوگرافی اختصاصی و فونت‌های استاندارد لیمو.
                    </p>
                    {locale === 'fa' && (
                      <div className="lang-selected-check">
                        <Check01 size={14} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                      </div>
                    )}
                  </div>

                  {/* English */}
                  <div
                    className={`language-choice-card ${locale === 'en' ? 'selected' : ''}`}
                    onClick={() => setLocale('en')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lang-flag-row">
                      <span className="lang-native-title">English</span>
                      <span className="lang-code-badge">LTR • en</span>
                    </div>
                    <p className="lang-desc">
                      Left-to-right alignment with international styling and typography.
                    </p>
                    {locale === 'en' && (
                      <div className="lang-selected-check">
                        <Check01 size={14} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNT & PROFILE */}
          {activeTab === 'account' && (
            <div className="settings-tab-panel">
              <div className="settings-card-section">
                <div className="section-title-row">
                  <div className="section-title-box">
                    <span className="section-icon-badge">
                      <UserCheck01 size={20} strokeWidth={1.7} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    </span>
                    <div>
                      <h2 className="section-heading">
                        {locale === 'fa' ? 'مشخصات حساب کاربری' : 'Account Profile'}
                      </h2>
                      <p className="section-subtext">
                        {locale === 'fa'
                          ? 'اطلاعات پروفایل و هویت شما در پلتفرم لیمو استودیو.'
                          : 'Your public and workspace identity across the Lemmo Studio platform.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="profile-detail-card">
                  <div className="profile-avatar-large">
                    <span>LM</span>
                    <span className="avatar-status-indicator" />
                  </div>
                  <div className="profile-fields-col">
                    <div className="field-row">
                      <span className="field-label">{locale === 'fa' ? 'نام نمایشی:' : 'Display Name:'}</span>
                      <span className="field-value">Behroz</span>
                    </div>
                    <div className="field-row">
                      <span className="field-label">{locale === 'fa' ? 'آدرس ایمیل:' : 'Email Address:'}</span>
                      <span className="field-value">behroz@lemmo.space</span>
                    </div>
                    <div className="field-row">
                      <span className="field-label">{locale === 'fa' ? 'سطح دسترسی:' : 'Workspace Role:'}</span>
                      <span className="plan-badge-inline">PRO Workspace Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING & PLANS */}
          {activeTab === 'billing' && (
            <div className="settings-tab-panel">
              <div className="settings-card-section">
                <div className="section-title-row">
                  <div className="section-title-box">
                    <span className="section-icon-badge">
                      <CreditCard01 size={20} strokeWidth={1.7} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    </span>
                    <div>
                      <h2 className="section-heading">
                        {locale === 'fa' ? 'طرح اشتراک و اعتبارات' : 'Subscription & Token Usage'}
                      </h2>
                      <p className="section-subtext">
                        {locale === 'fa'
                          ? 'بررسی وضعیت مصرف توکن‌ها و شارژ دوره‌ای حساب کاربری.'
                          : 'Monitor monthly token credit consumption and manage subscription tier.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="billing-summary-card">
                  <div className="billing-header">
                    <div>
                      <span className="billing-tier-title">{locale === 'fa' ? 'طرح حرفه‌ای (Pro)' : 'Pro Studio Plan'}</span>
                      <span className="billing-renew-date">{locale === 'fa' ? 'تمدید خودکار در ۲۸ مهر ۱۴۰۵' : 'Renews on Oct 20, 2026'}</span>
                    </div>
                    <Link href="/settings/billing" className="btn-manage-billing">
                      <span>{locale === 'fa' ? 'مدیریت صورت‌حساب کامل' : 'Full Billing Center'}</span>
                      {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    </Link>
                  </div>
                  <div className="token-progress-area">
                    <div className="token-text-row">
                      <span>{locale === 'fa' ? 'توکن‌های مصرف‌شده این ماه:' : 'Used monthly tokens:'}</span>
                      <strong className="token-numbers">2,450 / 5,000 Credits (49%)</strong>
                    </div>
                    <div className="token-bar-track">
                      <div className="token-bar-fill" style={{ width: '49%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API KEYS */}
          {activeTab === 'api' && (
            <div className="settings-tab-panel">
              <div className="settings-card-section">
                <div className="section-title-row">
                  <div className="section-title-box">
                    <span className="section-icon-badge">
                      <Key01 size={20} strokeWidth={1.7} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    </span>
                    <div>
                      <h2 className="section-heading">
                        {locale === 'fa' ? 'کلیدهای API و یکپارچه‌سازی' : 'API Keys & Developer Tokens'}
                      </h2>
                      <p className="section-subtext">
                        {locale === 'fa'
                          ? 'کلیدهای دسترسی امن برای اتصال SDK، اسکریپت‌ها و وب‌هوک‌های اتوماسیون.'
                          : 'Secure API tokens for integrating Lemmo models with SDKs and automated pipelines.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="api-key-item-box">
                  <div className="key-info">
                    <span className="key-name">{locale === 'fa' ? 'کلید پیش‌فرض استودیو' : 'Studio Production Key'}</span>
                    <code className="key-secret">lemmo_live_9f88***c304</code>
                  </div>
                  <span className="key-badge">{locale === 'fa' ? 'فعال' : 'Active'}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .settings-page-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 64px;
          box-sizing: border-box;
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        /* ================= Header ================= */
        .settings-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 28px;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
          margin-bottom: 4px;
        }

        :global(.crumb-link) {
          color: var(--lemmo-text-secondary, #b5b6b8);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        :global(.crumb-link:hover) {
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .crumb-sep {
          opacity: 0.4;
        }

        .crumb-current {
          color: #ffffff;
          font-weight: 600;
        }

        .settings-page-title {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: 1.625rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .settings-page-subtitle {
          font-size: 0.875rem;
          color: var(--lemmo-text-secondary, #a1a1a5);
          margin: 0;
          max-width: 720px;
          line-height: 1.5;
        }

        /* ================= Layout Grid ================= */
        .settings-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ================= Side Navigation ================= */
        .settings-nav-aside {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--lemmo-radius-lg, 12px);
          padding: 8px;
        }

        .tab-nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--lemmo-radius-md, 8px);
          background: transparent;
          border: none;
          color: var(--lemmo-text-secondary, #a1a1a5);
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          text-align: start;
          transition: all 0.15s ease;
        }

        .tab-nav-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .tab-nav-btn.active {
          background: rgba(209, 254, 23, 0.12);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: 700;
        }

        /* ================= Content Area ================= */
        .settings-content-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }

        .settings-tab-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: panelFadeIn 0.18s cubic-bezier(0, 0, 0.2, 1);
        }

        @keyframes panelFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-card-section {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--lemmo-radius-xl, 16px);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .section-title-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .section-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--lemmo-radius-md, 10px);
          background: rgba(209, 254, 23, 0.1);
          border: 1px solid rgba(209, 254, 23, 0.2);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .section-heading {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
        }

        .section-subtext {
          font-size: 0.8125rem;
          color: var(--lemmo-text-muted, #898a8b);
          margin: 0;
          line-height: 1.45;
        }

        /* ================= Workspace Choice Cards ================= */
        .workspace-choice-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .workspace-option-card {
          display: flex;
          flex-direction: column;
          padding: 18px;
          border-radius: var(--lemmo-radius-lg, 12px);
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .workspace-option-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .workspace-option-card.selected {
          background: rgba(209, 254, 23, 0.06);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .option-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .option-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          display: grid;
          place-items: center;
          color: var(--lemmo-text-secondary, #cccccc);
        }

        .workspace-option-card.selected .option-icon-box {
          background: rgba(209, 254, 23, 0.15);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .option-radio-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: grid;
          place-items: center;
        }

        .workspace-option-card.selected .option-radio-dot {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .option-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px;
        }

        .option-desc {
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          line-height: 1.45;
          margin: 0 0 16px;
          flex: 1;
        }

        .option-footer-status {
          display: flex;
          align-items: center;
        }

        .status-badge-active {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          background: rgba(209, 254, 23, 0.12);
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .status-badge-inactive {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #7c7e80);
        }

        /* ================= Language Choice Grid ================= */
        .language-choice-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .language-choice-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px;
          border-radius: var(--lemmo-radius-lg, 12px);
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .language-choice-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .language-choice-card.selected {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          background: rgba(209, 254, 23, 0.06);
        }

        .lang-flag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lang-native-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
        }

        .lang-code-badge {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 9999px;
        }

        .lang-desc {
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          line-height: 1.4;
          margin: 0;
        }

        .lang-selected-check {
          position: absolute;
          top: 14px;
          inset-inline-end: 14px;
        }

        /* ================= Account & Profile ================= */
        .profile-detail-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .profile-avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2a2d30 0%, #17191a 100%);
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 1.125rem;
          color: #ffffff;
          position: relative;
          flex-shrink: 0;
        }

        .avatar-status-indicator {
          position: absolute;
          bottom: 2px;
          inset-inline-end: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--lemmo-text-success, #4ee466);
          border: 2px solid #1c1e20;
        }

        .profile-fields-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
        }

        .field-label {
          color: var(--lemmo-text-muted, #898a8b);
        }

        .field-value {
          color: #ffffff;
          font-weight: 600;
        }

        .plan-badge-inline {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #131517;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          padding: 1px 8px;
          border-radius: 9999px;
        }

        /* ================= Billing Summary ================= */
        .billing-summary-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .billing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .billing-tier-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          display: block;
        }

        .billing-renew-date {
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        :global(.btn-manage-billing) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          text-decoration: none;
        }

        .token-progress-area {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .token-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
        }

        .token-numbers {
          color: #ffffff;
        }

        .token-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 9999px;
          overflow: hidden;
        }

        .token-bar-fill {
          height: 100%;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          border-radius: 9999px;
          box-shadow: 0 0 8px rgba(209, 254, 23, 0.4);
        }

        /* ================= API Key Box ================= */
        .api-key-item-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .key-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .key-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #ffffff;
        }

        .key-secret {
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .key-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-text-success, #4ee466);
          background: rgba(78, 228, 102, 0.1);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        /* ================= Responsive ================= */
        @media (max-width: 768px) {
          .settings-layout-grid {
            grid-template-columns: 1fr;
          }

          .workspace-choice-cards,
          .language-choice-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <SettingsContent />
    </React.Suspense>
  );
}
