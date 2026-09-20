'use client';

import React, { useState } from 'react';
import { Plus01, Trash01, Shield01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoInput from '../LemmoInput';
import LemmoSelect from '../LemmoSelect';
import LemmoButton from '../LemmoButton';
import type { WorkspaceMember } from '../../types';

export interface MembersPanelProps {
  onShowToast: (msg: string) => void;
}

export default function MembersPanel({ onShowToast }: MembersPanelProps) {
  const { locale } = useUiStore();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');

  const [membersList, setMembersList] = useState<WorkspaceMember[]>([
    {
      id: 'm-1',
      name: locale === 'fa' ? 'الکس مورگان (شما)' : 'Alex Morgan (You)',
      email: 'alex@example.com',
      role: 'Owner',
      initials: 'AM',
    },
    {
      id: 'm-2',
      name: locale === 'fa' ? 'سارا چن' : 'Sarah Chen',
      email: 'sarah.chen@studio.co',
      role: 'Admin',
      initials: 'SC',
    },
    {
      id: 'm-3',
      name: locale === 'fa' ? 'مارکوس ونس' : 'Marcus Vance',
      email: 'm.vance@studio.co',
      role: 'Editor',
      initials: 'MV',
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const emailParts = inviteEmail.trim().split('@')[0];
    const newMember: WorkspaceMember = {
      id: `m-${Date.now()}`,
      name: emailParts,
      email: inviteEmail.trim(),
      role: inviteRole,
      initials: emailParts.slice(0, 2).toUpperCase(),
    };

    setMembersList([...membersList, newMember]);
    setInviteEmail('');
    onShowToast(locale === 'fa' ? 'دعوت‌نامه با موفقیت ارسال شد' : 'Invite sent successfully');
  };

  const handleRemove = (id: string) => {
    setMembersList(membersList.filter((m) => m.id !== id));
    onShowToast(locale === 'fa' ? 'عضو از فضای کاری حذف شد' : 'Member removed');
  };

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'اعضا و همکاران' : 'Team Members'}
        description={
          locale === 'fa'
            ? 'مدیریت اعضای تیم، ارسال دعوت‌نامه‌ها و تعیین سطوح دسترسی.'
            : 'Invite team members and manage role-based permissions.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'دعوت از همکار جدید' : 'Invite Member'}>
        <form onSubmit={handleInvite}>
          <SettingsRow
            label={locale === 'fa' ? 'ایمیل همکار' : 'Colleague email'}
            htmlFor="invite-email"
            required
          >
            <LemmoInput
              id="invite-email"
              type="email"
              placeholder="designer@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </SettingsRow>

          <SettingsRow label={locale === 'fa' ? 'نقش دسترسی' : 'Access role'}>
            <LemmoSelect
              id="invite-role-sel"
              value={inviteRole}
              onChange={(val) => setInviteRole(val as any)}
              options={[
                { value: 'Admin', label: locale === 'fa' ? 'مدیر (Admin)' : 'Admin' },
                { value: 'Editor', label: locale === 'fa' ? 'ویرایشگر (Editor)' : 'Editor' },
                { value: 'Viewer', label: locale === 'fa' ? 'مشاهده‌کننده (Viewer)' : 'Viewer' },
              ]}
            />
          </SettingsRow>

          <div className="invite-submit-row">
            <LemmoButton
              type="submit"
              variant="primary"
              icon={<Plus01 size={14} strokeWidth={2} />}
            >
              {locale === 'fa' ? 'ارسال دعوت‌نامه' : 'Send Invite'}
            </LemmoButton>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'اعضای فعال' : 'Active Collaborators'}>
        {membersList.map((m) => (
          <div key={m.id} className="member-row">
            <div className="member-meta">
              <div className="member-avatar-disc">
                <span>{m.initials}</span>
              </div>
              <div className="member-text-info">
                <span className="member-name">{m.name}</span>
                <span className="member-email">{m.email}</span>
              </div>
            </div>

            <div className="member-actions">
              <span className={`role-badge ${m.role.toLowerCase()}`}>
                {m.role === 'Owner' && <Shield01 size={11} strokeWidth={2} />}
                <span>{m.role}</span>
              </span>

              {m.role !== 'Owner' && (
                <LemmoButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(m.id)}
                  title={locale === 'fa' ? 'حذف عضو' : 'Remove member'}
                >
                  <Trash01 size={14} strokeWidth={1.8} />
                </LemmoButton>
              )}
            </div>
          </div>
        ))}
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .invite-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--lemmo-space-300, 12px);
        }

        .member-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-300, 12px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          gap: var(--lemmo-gap-3, 12px);
        }

        .member-meta {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
        }

        .member-avatar-disc {
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          flex-shrink: 0;
        }

        .member-text-info {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-weight: var(--lemmo-font-weight-medium, 500);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .member-email {
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .member-actions {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          font-weight: var(--lemmo-font-weight-medium, 500);
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          color: var(--lemmo-text-secondary, #a1a1a5);
        }

        .role-badge.owner {
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 10%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border-color: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 25%, transparent);
        }

        .role-badge.admin {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
