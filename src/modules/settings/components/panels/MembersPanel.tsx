'use client';

import React, { useState, useEffect } from 'react';
import { Plus01, Trash01, Shield01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { useStudioContext } from '@/shared/providers/StudioContextProvider';
import { sdk } from '@/sdk';
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
  const { activeWorkspace, user } = useStudioContext();

  const isOwnerOrAdmin =
    activeWorkspace?.role === 'OWNER' || activeWorkspace?.role === 'ADMIN';

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [membersList, setMembersList] = useState<WorkspaceMember[]>([]);
  const [loading] = useState(false);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const wsId = activeWorkspace?.id;
    if (!wsId) return;

    sdk.workspaces.getMembers?.(wsId)
      .then((members) => {
        if (isCancelled || !members) return;
        setMembersList(
          members.map((m) => {
            const isMe = m.id === user?.id;
            return {
              id: m.id,
              name: isMe
                ? `${m.name} (${locale === 'fa' ? 'شما' : 'You'})`
                : m.name,
              email: m.email,
              role: m.role as 'Owner' | 'Admin' | 'Editor' | 'Viewer',
              initials:
                m.initials ||
                m.name
                  .trim()
                  .split(/\s+/)
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() ||
                'LM',
            };
          })
        );
      })
      .catch((err) => {
        console.error('Failed to load members:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeWorkspace?.id, user?.id, locale]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeWorkspace?.id) return;

    if (!isOwnerOrAdmin) {
      onShowToast(
        locale === 'fa'
          ? 'تنها مالک یا مدیران مجاز به ارسال دعوت‌نامه هستند.'
          : 'Only owners or admins may invite members.'
      );
      return;
    }

    try {
      setInviting(true);
      await sdk.workspaces.inviteMember?.(
        activeWorkspace.id,
        inviteEmail.trim(),
        inviteRole.toUpperCase()
      );
      const emailParts = inviteEmail.trim().split('@')[0];
      const newMember: WorkspaceMember = {
        id: `m-${Date.now()}`,
        name: emailParts,
        email: inviteEmail.trim(),
        role: inviteRole,
        initials: emailParts.slice(0, 2).toUpperCase(),
      };
      setMembersList((prev) => [...prev, newMember]);
      setInviteEmail('');
      onShowToast(locale === 'fa' ? 'دعوت‌نامه با موفقیت ارسال شد' : 'Invite sent successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invite failed';
      onShowToast(locale === 'fa' ? `خطا در ارسال دعوت: ${msg}` : `Invite failed: ${msg}`);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!activeWorkspace?.id) return;

    if (!isOwnerOrAdmin) {
      onShowToast(
        locale === 'fa'
          ? 'تنها مالک یا مدیران مجاز به حذف اعضا هستند.'
          : 'Only owners or admins may remove members.'
      );
      return;
    }

    try {
      await sdk.workspaces.removeMember?.(activeWorkspace.id, memberId);
      setMembersList((prev) => prev.filter((m) => m.id !== memberId));
      onShowToast(locale === 'fa' ? 'عضو از فضای کاری حذف شد' : 'Member removed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Remove failed';
      onShowToast(locale === 'fa' ? `خطا در حذف عضو: ${msg}` : `Remove failed: ${msg}`);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!activeWorkspace?.id) return;
    if (!isOwnerOrAdmin) {
      onShowToast(
        locale === 'fa'
          ? 'تنها مالک یا مدیران مجاز به تغییر نقش هستند.'
          : 'Only owners or admins may change roles.'
      );
      return;
    }

    try {
      await sdk.workspaces.updateMemberRole?.(activeWorkspace.id, memberId, newRole.toUpperCase());
      setMembersList((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, role: newRole as 'Owner' | 'Admin' | 'Editor' | 'Viewer' }
            : m
        )
      );
      onShowToast(locale === 'fa' ? 'نقش عضو به‌روزرسانی شد' : 'Role updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Role update failed';
      onShowToast(locale === 'fa' ? `خطا در تغییر نقش: ${msg}` : `Role update failed: ${msg}`);
    }
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
              onChange={(val) => setInviteRole(val as 'Admin' | 'Editor' | 'Viewer')}
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
              disabled={inviting}
              icon={<Plus01 size={14} strokeWidth={2} />}
            >
              {inviting
                ? locale === 'fa'
                  ? 'در حال ارسال...'
                  : 'Sending...'
                : locale === 'fa'
                ? 'ارسال دعوت‌نامه'
                : 'Send Invite'}
            </LemmoButton>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'اعضای فعال' : 'Active Collaborators'}>
        {loading ? (
          <div className="members-loading-hint">
            {locale === 'fa' ? 'در حال بارگذاری اعضا...' : 'Loading members...'}
          </div>
        ) : membersList.length === 0 ? (
          <div className="members-loading-hint">
            {locale === 'fa' ? 'هیچ عضوی یافت نشد.' : 'No members found.'}
          </div>
        ) : (
          membersList.map((m) => (
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
                {m.role === 'Owner' || !isOwnerOrAdmin ? (
                  <span className={`role-badge ${m.role.toLowerCase()}`}>
                    {m.role === 'Owner' && <Shield01 size={11} strokeWidth={2} />}
                    <span>{m.role}</span>
                  </span>
                ) : (
                  <select
                    className="role-select"
                    value={m.role}
                    onChange={(e) => void handleRoleChange(m.id, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                )}

                {m.role !== 'Owner' && isOwnerOrAdmin && (
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
          ))
        )}
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
