'use client';

import React, { useState } from 'react';
import { Key01, Plus01, Trash01, Copy01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoInput from '../LemmoInput';
import LemmoSelect from '../LemmoSelect';
import LemmoButton from '../LemmoButton';
import type { ApiTokenItem } from '../../types';

export interface ApiTokensPanelProps {
  onShowToast: (msg: string) => void;
}

export default function ApiTokensPanel({ onShowToast }: ApiTokensPanelProps) {
  const { locale } = useUiStore();

  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScope, setNewTokenScope] = useState('Full Access');

  const [tokensList, setTokensList] = useState<ApiTokenItem[]>([
    {
      id: 'tok-1',
      name: 'Figma Plugin Integration',
      tokenPrefix: 'lm_live_89a2...41f',
      scope: 'Full Access',
      created: '2026-02-10',
      lastUsed: '2 hours ago',
    },
    {
      id: 'tok-2',
      name: 'CI/CD Pipeline Runner',
      tokenPrefix: 'lm_live_33c1...90e',
      scope: 'Inference Only',
      created: '2026-03-01',
      lastUsed: 'Yesterday',
    },
  ]);

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const item: ApiTokenItem = {
      id: `tok-${Date.now()}`,
      name: newTokenName.trim(),
      tokenPrefix: `lm_live_${randomSuffix}...${randomSuffix}`,
      scope: newTokenScope,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Just now',
    };

    setTokensList([item, ...tokensList]);
    setNewTokenName('');
    onShowToast(locale === 'fa' ? 'کلید API جدید با موفقیت ایجاد شد' : 'API token generated');
  };

  const handleRevoke = (id: string) => {
    setTokensList(tokensList.filter((t) => t.id !== id));
    onShowToast(locale === 'fa' ? 'کلید API ابطال شد' : 'Token revoked');
  };

  const handleCopy = (prefix: string) => {
    navigator.clipboard?.writeText(prefix);
    onShowToast(locale === 'fa' ? 'کلید در کلیپ‌بورد کپی شد' : 'Copied to clipboard');
  };

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'توکن‌های API' : 'API Keys'}
        description={
          locale === 'fa'
            ? 'تولید و مدیریت کلیدهای امنیتی برای ادغام ابزارهای استودیو با اسکریپت‌ها و پلاگین‌ها.'
            : 'Generate secret keys to programmatically call Lemmo inference pipelines.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'تولید کلید جدید' : 'Generate Secret Key'}>
        <form onSubmit={handleCreateToken}>
          <SettingsRow
            label={locale === 'fa' ? 'نام کلید' : 'Key description / name'}
            htmlFor="new-tok-name"
            required
          >
            <LemmoInput
              id="new-tok-name"
              placeholder="e.g. Photoshop Plugin or Backend Server"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              required
            />
          </SettingsRow>

          <SettingsRow label={locale === 'fa' ? 'سطح دسترسی (Scope)' : 'Token Scope'}>
            <LemmoSelect
              id="new-tok-scope"
              value={newTokenScope}
              onChange={(val) => setNewTokenScope(val)}
              options={[
                { value: 'Full Access', label: locale === 'fa' ? 'دسترسی کامل (Full Access)' : 'Full Access' },
                { value: 'Inference Only', label: locale === 'fa' ? 'فقط فراخوانی مدل (Inference Only)' : 'Inference Only' },
                { value: 'Read-Only', label: locale === 'fa' ? 'فقط خواندن متادیتا (Read-Only)' : 'Read-Only' },
              ]}
            />
          </SettingsRow>

          <div className="token-submit-row">
            <LemmoButton
              type="submit"
              variant="primary"
              icon={<Plus01 size={14} strokeWidth={2} />}
            >
              {locale === 'fa' ? 'تولید کلید' : 'Generate Key'}
            </LemmoButton>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'کلیدهای فعال' : 'Active Keys'}>
        {tokensList.map((tok) => (
          <div key={tok.id} className="token-row">
            <div className="token-meta">
              <div className="token-icon-disc">
                <Key01 size={16} strokeWidth={1.5} />
              </div>
              <div className="token-details">
                <div className="token-name-row">
                  <span className="token-name">{tok.name}</span>
                  <span className="token-scope-tag">{tok.scope}</span>
                </div>
                <div className="token-sub-row">
                  <code className="token-code">{tok.tokenPrefix}</code>
                  <span className="token-used-time">
                    {locale === 'fa' ? `آخرین استفاده: ${tok.lastUsed}` : `Used: ${tok.lastUsed}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="token-actions">
              <LemmoButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(tok.tokenPrefix)}
                title={locale === 'fa' ? 'کپی کلید' : 'Copy key'}
              >
                <Copy01 size={14} strokeWidth={1.5} />
              </LemmoButton>
              <LemmoButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRevoke(tok.id)}
                title={locale === 'fa' ? 'ابطال کلید' : 'Revoke key'}
              >
                <Trash01 size={14} strokeWidth={1.5} />
              </LemmoButton>
            </div>
          </div>
        ))}
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .token-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--lemmo-space-300, 12px);
        }

        .token-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-300, 12px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          gap: var(--lemmo-gap-3, 12px);
        }

        .token-meta {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
        }

        .token-icon-disc {
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          flex-shrink: 0;
        }

        .token-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .token-name-row {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }

        .token-name {
          font-weight: var(--lemmo-font-weight-medium, 500);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .token-scope-tag {
          font-size: var(--lemmo-type-size-050, 0.6875rem);
          padding: 1px 6px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .token-sub-row {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }

        .token-code {
          font-family: var(--lemmo-font-mono, monospace);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .token-used-time {
          font-size: var(--lemmo-type-size-050, 0.6875rem);
          color: var(--lemmo-text-faint, #737475);
        }

        .token-actions {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-1, 4px);
        }
      `}</style>
    </div>
  );
}
