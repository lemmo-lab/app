'use client';

import React from 'react';
import { LayersThree, Users01, Database01, AiCpu } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';

export interface OverviewPanelProps {
  onShowToast: (msg: string) => void;
}

export default function OverviewPanel({ onShowToast }: OverviewPanelProps) {
  const { locale } = useUiStore();

  const metrics = [
    {
      labelFa: 'اعضای فعال',
      labelEn: 'Active Collaborators',
      val: '3',
      icon: <Users01 size={18} strokeWidth={1.5} />,
    },
    {
      labelFa: 'فضای ذخیره‌سازی ابری',
      labelEn: 'Cloud Storage Used',
      val: '2.4 GB / 10 GB',
      icon: <Database01 size={18} strokeWidth={1.5} />,
    },
    {
      labelFa: 'درخواست‌های هوش مصنوعی ماه',
      labelEn: 'AI Generations (Month)',
      val: '1,420 / 5,000',
      icon: <AiCpu size={18} strokeWidth={1.5} />,
    },
    {
      labelFa: 'لایسنس و سطح دسترسی',
      labelEn: 'Workspace Tier',
      val: 'Studio Pro',
      icon: <LayersThree size={18} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'نمای کلی فضای کاری' : 'Workspace Overview'}
        description={
          locale === 'fa'
            ? 'خلاصه وضعیت، سهمیه‌های مصرفی و اطلاعات کلیدی فضای کاری لیمو.'
            : 'Summary of workspace health, storage usage, and active quota.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'آمار و سهمیه‌ها' : 'Usage & Quotas'}>
        <div className="metrics-grid">
          {metrics.map((m, idx) => (
            <div key={idx} className="metric-card">
              <div className="metric-icon-box">{m.icon}</div>
              <div className="metric-info">
                <span className="metric-val">{m.val}</span>
                <span className="metric-label">
                  {locale === 'fa' ? m.labelFa : m.labelEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'اطلاعات هویتی فضای کاری' : 'Workspace Identity'}>
        <div className="info-list-card">
          <div className="info-item-row">
            <span className="info-item-label">
              {locale === 'fa' ? 'نام فضای کاری' : 'Workspace Name'}
            </span>
            <span className="info-item-val">Lemmo Design Studio</span>
          </div>
          <div className="info-item-row">
            <span className="info-item-label">
              {locale === 'fa' ? 'شناسه یکتا (ID)' : 'Workspace ID'}
            </span>
            <code className="info-item-code">ws_lemmo_92140a</code>
          </div>
          <div className="info-item-row">
            <span className="info-item-label">
              {locale === 'fa' ? 'تاریخ تأسیس' : 'Created Date'}
            </span>
            <span className="info-item-val">2026-01-14</span>
          </div>
        </div>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--lemmo-gap-3, 12px);
          margin-top: var(--lemmo-space-200, 8px);
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
          padding: var(--lemmo-space-400, 16px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-card, 12px);
        }

        .metric-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--lemmo-radius-200, 8px);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 8%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border: var(--lemmo-stroke-thin, 1px) solid color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-family: var(--lemmo-font-heading, inherit);
          font-weight: var(--lemmo-font-weight-bold, 700);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .metric-label {
          margin-top: 2px;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .info-list-card {
          display: flex;
          flex-direction: column;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-card, 12px);
          overflow: hidden;
        }

        .info-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-300, 12px) var(--lemmo-space-400, 16px);
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
        }

        .info-item-row:last-child {
          border-bottom: none;
        }

        .info-item-label {
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .info-item-val {
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
          font-weight: var(--lemmo-font-weight-medium, 500);
        }

        .info-item-code {
          font-family: var(--lemmo-font-mono, monospace);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 8%, transparent);
          padding: 2px 6px;
          border-radius: var(--lemmo-radius-100, 4px);
        }
      `}</style>
    </div>
  );
}
