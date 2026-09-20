'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUiStore } from '@/stores/uiStore';
import type { SettingsTabId } from '../types';
import SettingsNav from './SettingsNav';
import ProfilePanel from './panels/ProfilePanel';
import AccountPanel from './panels/AccountPanel';
import AppearancePanel from './panels/AppearancePanel';
import PromoPanel from './panels/PromoPanel';
import OverviewPanel from './panels/OverviewPanel';
import MembersPanel from './panels/MembersPanel';
import WorkspaceSettingsPanel from './panels/WorkspaceSettingsPanel';
import BillingPanel from './panels/BillingPanel';
import ComputePacksPanel from './panels/ComputePacksPanel';
import ApiTokensPanel from './panels/ApiTokensPanel';

export default function SettingsLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dir } = useUiStore();

  const initialTab =
    (searchParams.get('tab') as SettingsTabId) ||
    (searchParams.get('panel') as SettingsTabId) ||
    'profile';

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  useEffect(() => {
    const tabParam =
      (searchParams.get('tab') as SettingsTabId) ||
      (searchParams.get('panel') as SettingsTabId);
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  const handleSelectTab = (tab: SettingsTabId) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`/settings?${params.toString()}`, { scroll: false });
  };

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  }, []);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePanel onShowToast={showToast} />;
      case 'account':
        return <AccountPanel onShowToast={showToast} />;
      case 'appearance':
        return <AppearancePanel onShowToast={showToast} />;
      case 'promo':
        return <PromoPanel onShowToast={showToast} />;
      case 'overview':
        return <OverviewPanel onShowToast={showToast} />;
      case 'members':
        return <MembersPanel onShowToast={showToast} />;
      case 'settings':
        return <WorkspaceSettingsPanel onShowToast={showToast} />;
      case 'billing':
        return <BillingPanel onShowToast={showToast} />;
      case 'compute-packs':
        return <ComputePacksPanel onShowToast={showToast} />;
      case 'api-tokens':
        return <ApiTokensPanel onShowToast={showToast} />;
      default:
        return <ProfilePanel onShowToast={showToast} />;
    }
  };

  return (
    <div className="settings-page-wrapper" dir={dir}>
      {/* Sub-Navigation Sidebar */}
      <SettingsNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Main Settings Content Viewport */}
      <main className="settings-content-viewport">
        <div className="settings-content-shell">{renderActivePanel()}</div>
      </main>

      {/* Global Toast Notification */}
      <div
        className={`settings-toast ${toastMessage ? 'visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>

      <style jsx>{`
        .settings-page-wrapper {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: var(--lemmo-font-sans, ui-sans-serif, system-ui, sans-serif);
          position: relative;
          overflow: hidden;
        }

        .settings-content-viewport {
          flex: 1;
          min-width: 0;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background: var(--lemmo-page-background, #131517);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .settings-content-shell {
          width: min(720px, 100%);
          padding: var(--lemmo-space-1000, 40px) var(--lemmo-space-600, 24px) var(--lemmo-space-1600, 64px);
          box-sizing: border-box;
        }

        .settings-toast {
          position: fixed;
          bottom: var(--lemmo-space-600, 24px);
          inset-inline-end: var(--lemmo-space-600, 24px);
          padding: var(--lemmo-space-250, 10px) var(--lemmo-space-400, 16px);
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-surface-brand-foreground, #131517);
          font-family: inherit;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          z-index: 200;
          opacity: 0;
          transform: translateY(10px) scale(0.95);
          pointer-events: none;
          transition: opacity var(--lemmo-duration-normal, 180ms) ease,
            transform var(--lemmo-duration-normal, 180ms) var(--lemmo-ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
        }

        .settings-toast.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        @media (max-width: 768px) {
          .settings-page-wrapper {
            flex-direction: column;
          }

          .settings-content-shell {
            padding: var(--lemmo-space-500, 20px) var(--lemmo-space-300, 12px) var(--lemmo-space-1000, 40px);
          }
        }
      `}</style>
    </div>
  );
}
