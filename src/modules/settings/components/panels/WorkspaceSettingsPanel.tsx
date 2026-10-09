'use client';

import React, { useState, useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { useStudioContext } from '@/shared/providers/StudioContextProvider';
import { sdk } from '@/sdk';
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
  const { activeWorkspace } = useStudioContext();

  const isOwnerOrAdmin =
    activeWorkspace?.role === 'OWNER' || activeWorkspace?.role === 'ADMIN';

  const [defaultView, setDefaultView] = useState('agent');
  const [autoSave, setAutoSave] = useState('15s');
  const [retention, setRetention] = useState('30d');
  const [publicLinks, setPublicLinks] = useState('team-only');
  const [modelOptOut, setModelOptOut] = useState(true);

  useEffect(() => {
    const wsId = activeWorkspace?.id;
    if (!wsId) return;

    let isCancelled = false;

    sdk.workspaces.getSettings?.(wsId)
      .then((settings) => {
        if (isCancelled || !settings) return;
        if (settings.defaultView) setDefaultView(settings.defaultView);
        if (settings.autoSave) setAutoSave(settings.autoSave);
        if (settings.retention) setRetention(settings.retention);
        if (settings.publicLinks) setPublicLinks(settings.publicLinks);
        if (settings.modelOptOut !== undefined) setModelOptOut(settings.modelOptOut);
      })
      .catch((err) => {
        console.error('Failed to load workspace settings:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeWorkspace?.id]);

  const updateSettingField = async (
    patch: Partial<import('@/sdk').WorkspaceSettingsData>,
    successMsg: string
  ) => {
    if (!activeWorkspace?.id) return;
    if (!isOwnerOrAdmin) {
      onShowToast(
        locale === 'fa'
          ? 'شما دسترسی مجاز برای تغییر تنظیمات این فضای کاری را ندارید.'
          : 'You do not have permission to modify workspace settings.'
      );
      return;
    }

    try {
      const currentPayload: import('@/sdk').WorkspaceSettingsData = {
        defaultView,
        autoSave,
        retention,
        publicLinks,
        modelOptOut,
        ...patch,
      };
      await sdk.workspaces.updateSettings?.(activeWorkspace.id, currentPayload);
      onShowToast(successMsg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      onShowToast(locale === 'fa' ? `خطا در ذخیره تنظیمات: ${msg}` : `Update failed: ${msg}`);
    }
  };

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

      {!isOwnerOrAdmin && (
        <div className="rbac-warning-banner">
          {locale === 'fa'
            ? 'توجه: شما تنها دسترسی مشاهده پیکربندی را دارید (نقش دسترسی: ' +
              (activeWorkspace?.role || 'VIEWER') +
              '). ویرایش این بخش مخصوص مدیران و مالک فضای کاری است.'
            : 'Notice: You have read-only access to this workspace configuration (Role: ' +
              (activeWorkspace?.role || 'VIEWER') +
              '). Only Owners and Admins may modify settings.'}
        </div>
      )}

      <SettingsSection title={locale === 'fa' ? 'جریان کاری و پیش‌فرض‌ها' : 'Workflow & Defaults'}>
        <SettingsRow label={locale === 'fa' ? 'نمای پیش‌فرض استودیو' : 'Default studio view'}>
          <LemmoSelect
            id="ws-view-select"
            value={defaultView}
            onChange={(val) => {
              setDefaultView(val);
              void updateSettingField(
                { defaultView: val },
                locale === 'fa' ? 'نمای پیش‌فرض ذخیره شد' : 'Default view updated'
              );
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
              void updateSettingField(
                { autoSave: val },
                locale === 'fa' ? 'بازه ذخیره خودکار به‌روزرسانی شد' : 'Auto-save updated'
              );
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
              void updateSettingField(
                { retention: val },
                locale === 'fa' ? 'خط‌مشی نگهداری ذخیره شد' : 'Retention policy updated'
              );
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
              void updateSettingField(
                { publicLinks: val },
                locale === 'fa' ? 'سطح اشتراک‌گذاری ذخیره شد' : 'Sharing updated'
              );
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
              void updateSettingField(
                { modelOptOut: val },
                locale === 'fa' ? 'تنظیمات حریم خصوصی ذخیره شد' : 'Privacy settings updated'
              );
            }}
            ariaLabel="Model training opt-out toggle"
          />
        </SettingsRow>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .rbac-warning-banner {
          margin-bottom: var(--lemmo-space-400, 16px);
          padding: var(--lemmo-space-300, 12px) var(--lemmo-space-400, 16px);
          background: color-mix(in srgb, var(--lemmo-status-warning, #f59e0b) 12%, transparent);
          border: var(--lemmo-stroke-thin, 1px) solid color-mix(in srgb, var(--lemmo-status-warning, #f59e0b) 30%, transparent);
          border-radius: var(--lemmo-radius-200, 8px);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-status-warning, #f59e0b);
          line-height: var(--lemmo-type-leading-500, 1.4);
        }
      `}</style>
    </div>
  );
}
