'use client';

import React, { useState, useRef } from 'react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoInput from '../LemmoInput';
import LemmoButton from '../LemmoButton';

export interface ProfilePanelProps {
  onShowToast: (msg: string) => void;
}

export default function ProfilePanel({ onShowToast }: ProfilePanelProps) {
  const { locale } = useUiStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(
    locale === 'fa' ? 'بهروز احمدی' : 'Alex Morgan'
  );
  const [username, setUsername] = useState('alexmorgan');
  const [bio, setBio] = useState(
    locale === 'fa'
      ? 'طراح محصول و ابزارهای خلاقانه هوش مصنوعی در استودیو لیمو.'
      : 'Product designer building calm, considered tools. Currently exploring generative imagery.'
  );
  const [xHandle, setXHandle] = useState('alexmorgan');
  const [githubHandle, setGithubHandle] = useState('alex-designer');
  const [instagramHandle, setInstagramHandle] = useState('alex.design');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const initials = (() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    const s = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
    return s.toUpperCase() || 'LM';
  })();

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!/^image\//.test(file.type)) {
      onShowToast(locale === 'fa' ? 'لطفاً یک فایل تصویری انتخاب کنید.' : 'Choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onShowToast(locale === 'fa' ? 'حجم تصویر باید کمتر از ۲ مگابایت باشد.' : 'Image size under 2MB.');
      return;
    }
    setAvatarUrl(URL.createObjectURL(file));
    onShowToast(locale === 'fa' ? 'تصویر نمایه انتخاب شد' : 'Avatar selected');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(locale === 'fa' ? 'پروفایل با موفقیت ذخیره شد' : 'Profile updated successfully');
  };

  return (
    <form className="panel-container" onSubmit={handleSave}>
      <SettingsHeader
        title={locale === 'fa' ? 'پروفایل' : 'Profile'}
        description={
          locale === 'fa'
            ? 'مدیریت نحوه نمایش مشخصات عمومی و هویت شما در استودیو لیمو.'
            : 'Manage your public persona and appearance in Lemmo Studio.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'نمایه عمومی' : 'Public Persona'}>
        {/* Avatar Row */}
        <SettingsRow
          label={locale === 'fa' ? 'تصویر نمایه' : 'Avatar picture'}
          hint={locale === 'fa' ? 'فرمت‌های JPG یا PNG تا حداکثر ۲ مگابایت.' : 'JPG or PNG up to 2MB.'}
          controlEnd
        >
          <div className="avatar-control-group">
            <div className="avatar-preview-disc">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="avatar-initials">{initials}</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarFile}
            />

            <LemmoButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {locale === 'fa' ? 'تغییر تصویر' : 'Change Avatar'}
            </LemmoButton>
          </div>
        </SettingsRow>

        {/* Display Name */}
        <SettingsRow
          label={locale === 'fa' ? 'نام نمایشی' : 'Display name'}
          htmlFor="profile-name"
          required
        >
          <LemmoInput
            id="profile-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </SettingsRow>

        {/* Username */}
        <SettingsRow
          label={locale === 'fa' ? 'نام کاربری' : 'Username'}
          htmlFor="profile-username"
          required
        >
          <LemmoInput
            id="profile-username"
            prefixAffix="@"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </SettingsRow>

        {/* Bio */}
        <SettingsRow
          label={
            <div className="bio-label-row">
              <span>{locale === 'fa' ? 'بیوگرافی' : 'Bio'}</span>
              <span className="bio-counter">{160 - bio.length}</span>
            </div>
          }
          htmlFor="profile-bio"
          stacked
        >
          <textarea
            id="profile-bio"
            className="lemmo-textarea"
            rows={3}
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'حساب‌های شبکه‌های اجتماعی' : 'Social Profiles'}>
        <SettingsRow label="X / Twitter" htmlFor="profile-x">
          <LemmoInput
            id="profile-x"
            prefixAffix="x.com/"
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value)}
            placeholder="username"
          />
        </SettingsRow>

        <SettingsRow label="GitHub" htmlFor="profile-github">
          <LemmoInput
            id="profile-github"
            prefixAffix="github.com/"
            value={githubHandle}
            onChange={(e) => setGithubHandle(e.target.value)}
            placeholder="username"
          />
        </SettingsRow>

        <SettingsRow label="Instagram" htmlFor="profile-instagram">
          <LemmoInput
            id="profile-instagram"
            prefixAffix="instagram.com/"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="username"
          />
        </SettingsRow>
      </SettingsSection>

      <div className="panel-actions-footer">
        <LemmoButton type="submit" variant="primary">
          {locale === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
        </LemmoButton>
      </div>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .avatar-control-group {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
        }

        .avatar-preview-disc {
          width: 44px;
          height: 44px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .bio-label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
        }

        .bio-counter {
          color: var(--lemmo-text-faint, #737475);
          font-size: var(--lemmo-type-size-050, 0.75rem);
        }

        .lemmo-textarea {
          width: 100%;
          padding: var(--lemmo-space-250, 10px) var(--lemmo-space-300, 12px);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: var(--lemmo-text-primary, #ffffff);
          font-family: inherit;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          line-height: var(--lemmo-type-leading-600, 1.5);
          resize: vertical;
          box-sizing: border-box;
          transition: border-color var(--lemmo-duration-fast, 150ms) ease;
        }

        .lemmo-textarea:focus {
          outline: none;
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
        }

        .panel-actions-footer {
          margin-top: var(--lemmo-space-800, 32px);
          display: flex;
          justify-content: flex-end;
          gap: var(--lemmo-gap-2, 8px);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      `}</style>
    </form>
  );
}
