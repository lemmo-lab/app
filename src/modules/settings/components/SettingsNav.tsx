'use client';

import React from 'react';
import {
  User02,
  Shield01,
  Sparks,
  Ticket01,
  LayersThree,
  UsersPlus01,
  Settings01,
  CreditCard01,
  Server01,
  Key01,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import type { SettingsTabId } from '../types';

export interface SettingsNavProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
}

interface NavItemConfig {
  id: SettingsTabId;
  labelFa: string;
  labelEn: string;
  icon: React.ReactNode;
}

export default function SettingsNav({
  activeTab,
  onSelectTab,
}: SettingsNavProps) {
  const { locale } = useUiStore();

  const accountItems: NavItemConfig[] = [
    { id: 'profile', labelFa: 'پروفایل', labelEn: 'Profile', icon: <User02 size={16} strokeWidth={1.5} /> },
    { id: 'account', labelFa: 'حساب', labelEn: 'Account', icon: <Shield01 size={16} strokeWidth={1.5} /> },
    { id: 'appearance', labelFa: 'ظاهر و تم‌ها', labelEn: 'Appearance', icon: <Sparks size={16} strokeWidth={1.5} /> },
    { id: 'promo', labelFa: 'کد تخفیف', labelEn: 'Promo Code', icon: <Ticket01 size={16} strokeWidth={1.5} /> },
  ];

  const workspaceItems: NavItemConfig[] = [
    { id: 'overview', labelFa: 'نمای کلی', labelEn: 'Overview', icon: <LayersThree size={16} strokeWidth={1.5} /> },
    { id: 'members', labelFa: 'اعضا و دسترسی‌ها', labelEn: 'Members', icon: <UsersPlus01 size={16} strokeWidth={1.5} /> },
    { id: 'settings', labelFa: 'پیکربندی استودیو', labelEn: 'Configuration', icon: <Settings01 size={16} strokeWidth={1.5} /> },
    { id: 'billing', labelFa: 'صورت‌حساب و پلن', labelEn: 'Billing & Plans', icon: <CreditCard01 size={16} strokeWidth={1.5} /> },
    { id: 'compute-packs', labelFa: 'بسته‌های پردازشی', labelEn: 'Compute Packs', icon: <Server01 size={16} strokeWidth={1.5} /> },
  ];

  const developerItems: NavItemConfig[] = [
    { id: 'api-tokens', labelFa: 'کلیدهای API', labelEn: 'API Tokens', icon: <Key01 size={16} strokeWidth={1.5} /> },
  ];

  const renderGroup = (
    titleFa: string,
    titleEn: string,
    items: NavItemConfig[]
  ) => (
    <div className="nav-group">
      <h2 className="group-heading">
        {locale === 'fa' ? titleFa : titleEn}
      </h2>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`settings-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            data-panel={item.id}
            role="tab"
            aria-selected={isActive}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">
              {locale === 'fa' ? item.labelFa : item.labelEn}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="settings-nav-aside" aria-label="Settings sub-navigation">
      <div className="nav-header-badge">
        <span className="nav-settings-title">
          {locale === 'fa' ? 'تنظیمات استودیو' : 'Studio Settings'}
        </span>
      </div>

      <nav className="settings-nav-body" role="tablist">
        {renderGroup('حساب کاربری', 'Account', accountItems)}
        {renderGroup('فضای کاری', 'Workspace', workspaceItems)}
        {renderGroup('توسعه‌دهندگان', 'Developer', developerItems)}
      </nav>
    </aside>
  );
}
