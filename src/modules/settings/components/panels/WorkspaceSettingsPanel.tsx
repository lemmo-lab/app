'use client';

import React, { useState } from 'react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoSelect from '../LemmoSelect';
import LemmoToggle from '../LemmoToggle';

export interface WorkspaceSettingsPanelProps {
  onShowToast: (msg: string) => void;
}

export default function WorkspaceSettingsPanel({
  onShowToast,
}: WorkspaceSettingsPanelProps) {
  const { locale } = useUiStore();

  const [defaultView, setDefaultView] = useState('agent');
  const [autoSave, setAutoSave] = useState('15s');
  const [retention, setRetention] = useState('30d');
  const [publicLinks, setPublicLinks] = useState('team-only');
  const [modelOptOut, setModelOptOut] = useState(true);

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'پیکربندی فضای کاری' : 'Workspace Configuration'}
        description={
          locale === 'fa'
            ? 'پیکربندی جریان کاری، رفتار ذخیره‌سازی، سیاست‌های نگهداری و حریم خصوصی داده‌ها.'
            : 'Configure workflow behaviors, auto-save cadences, and privacy policies.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'جریان کاری و پیش‌فرض‌ها' : 'Workflow & Defaults'}>
        <SettingsRow label={locale === 'fa' ? 'نمای پیش‌فرض استودیو' : 'Default studio view'}>
          <LemmoSelect
            id="ws-view-select"
            value={defaultView}
            onChange={(val) => {
              setDefaultView(val);
              onShowToast(locale === 'fa' ? 'نمای پیش‌فرض ذخیره شد' : 'Default view updated');
            }}
            options={[
              { value: 'agent', label: locale === 'fa' ? 'ایجنت استودیو (Agent Studio)' : 'Agent Studio' },
              { value: 'canvas', label: locale === 'fa' ? 'بوم نامحدود (Infinite Canvas)' : 'Infinite Canvas' },
            ]}
          />
        </SettingsRow>

        <SettingsRow label={locale === 'fa' ? 'بازه ذخیره‌سازی خودکار' : 'Auto-save interval'}>
          <LemmoSelect
            id="autosave-select"
            value={autoSave}
            onChange={(val) => {
              setAutoSave(val);
              onShowToast(locale === 'fa' ? 'بازه ذخیره خودکار به‌روزرسانی شد' : 'Auto-save updated');
            }}
            options={[
              { value: '15s', label: locale === 'fa' ? 'هر ۱۵ ثانیه' : 'Every 15 seconds' },
              { value: '30s', label: locale === 'fa' ? 'هر ۳۰ ثانیه' : 'Every 30 seconds' },
              { value: '60s', label: locale === 'fa' ? 'هر ۱ دقیقه' : 'Every 1 minute' },
            ]}
          />
        </SettingsRow>

        <SettingsRow label={locale === 'fa' ? 'نگهداری تاریخچه تولیدات' : 'History retention'}>
          <LemmoSelect
            id="retention-select"
            value={retention}
            onChange={(val) => {
              setRetention(val);
              onShowToast(locale === 'fa' ? 'خط‌مشی نگهداری ذخیره شد' : 'Retention policy updated');
            }}
            options={[
              { value: '30d', label: locale === 'fa' ? '۳۰ روز' : '30 days' },
              { value: '90d', label: locale === 'fa' ? '۹۰ روز' : '90 days' },
              { value: 'forever', label: locale === 'fa' ? 'دائمی' : 'Forever' },
            ]}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'امنیت و حریم خصوصی' : 'Security & Privacy'}>
        <SettingsRow label={locale === 'fa' ? 'اشتراک پیوند عمومی آثار' : 'Public link sharing'}>
          <LemmoSelect
            id="share-links-select"
            value={publicLinks}
            onChange={(val) => {
              setPublicLinks(val);
              onShowToast(locale === 'fa' ? 'سطح اشتراک‌گذاری ذخیره شد' : 'Sharing updated');
            }}
            options={[
              { value: 'team-only', label: locale === 'fa' ? 'فقط اعضای تیم' : 'Team members only' },
              { value: 'anyone', label: locale === 'fa' ? 'مجاز با داشتن پیوند' : 'Anyone with link' },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label={locale === 'fa' ? 'حفظ حریم خصوصی مدل‌ها' : 'Model Training Opt-out'}
          hint={
            locale === 'fa'
              ? 'آثار و پرامپت‌های فضای کاری شما هرگز برای آموزش مدل‌های عمومی هوش مصنوعی استفاده نمی‌شوند.'
              : 'Your prompts and outputs will never be used for foundational AI model training.'
          }
          controlEnd
        >
          <LemmoToggle
            checked={modelOptOut}
            onChange={(val) => {
              setModelOptOut(val);
              onShowToast(locale === 'fa' ? 'تنظیمات حریم خصوصی ذخیره شد' : 'Privacy settings updated');
            }}
            ariaLabel="Model training opt-out toggle"
          />
        </SettingsRow>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
