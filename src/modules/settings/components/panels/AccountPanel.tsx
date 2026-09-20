'use client';

import React, { useState } from 'react';
import { Check01, AlertTriangle } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoInput from '../LemmoInput';
import LemmoSelect from '../LemmoSelect';
import LemmoButton from '../LemmoButton';
import LemmoToggle from '../LemmoToggle';

export interface AccountPanelProps {
  onShowToast: (msg: string) => void;
}

export default function AccountPanel({ onShowToast }: AccountPanelProps) {
  const { locale, setLocale } = useUiStore();

  const [email] = useState('alex@example.com');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [timezone, setTimezone] = useState('Asia/Tehran');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleVerifyCodeChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const updated = [...verificationCode];
    updated[index] = clean;
    setVerificationCode(updated);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`digit-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.join('').length === 6) {
      setIsEmailVerified(true);
      onShowToast(locale === 'fa' ? 'ایمیل با موفقیت تأیید شد' : 'Email verified successfully');
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    onShowToast(locale === 'fa' ? 'رمز عبور با موفقیت به‌روزرسانی شد' : 'Password updated');
  };

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'حساب کاربری' : 'Account'}
        description={
          locale === 'fa'
            ? 'مدیریت اطلاعات ورود به سیستم، رمز عبور، امنیت و ترجیحات حساب شما.'
            : 'Manage login credentials, password, security, and locale settings.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'اطلاعات ورود' : 'Login Credentials'}>
        {/* Email Address */}
        <SettingsRow
          label={locale === 'fa' ? 'آدرس ایمیل' : 'Email address'}
          htmlFor="acc-email"
          required
        >
          <div className="email-input-container">
            <LemmoInput
              id="acc-email"
              type="email"
              value={email}
              readOnly
            />
            {isEmailVerified ? (
              <span
                className="email-verified-badge"
                title={locale === 'fa' ? 'ایمیل تایید شده است' : 'Email is verified'}
              >
                <Check01 size={14} strokeWidth={2.4} />
              </span>
            ) : null}
          </div>
        </SettingsRow>

        {/* Verification Card if not verified */}
        {!isEmailVerified && (
          <div className="verify-card-box">
            <div className="verify-card-header">
              <AlertTriangle size={16} strokeWidth={1.5} className="verify-warn-icon" />
              <div>
                <h4 className="verify-card-title">
                  {locale === 'fa' ? 'لطفاً ایمیل خود را تأیید کنید' : 'Please verify your email'}
                </h4>
                <p className="verify-card-sub">
                  {locale === 'fa'
                    ? 'یک کد ۶ رقمی به آدرس شما ارسال شد.'
                    : 'A 6-digit confirmation code was sent to your email.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifySubmit} className="verify-card-form">
              <div className="otp-digit-row" dir="ltr">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`digit-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    placeholder="0"
                    className="otp-digit-input"
                    onChange={(e) => handleVerifyCodeChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        const prev = document.getElementById(`digit-box-${idx - 1}`);
                        prev?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="verify-card-actions">
                <LemmoButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={verificationCode.join('').length < 6}
                >
                  {locale === 'fa' ? 'تأیید ایمیل' : 'Verify Email'}
                </LemmoButton>
              </div>
            </form>
          </div>
        )}

        {/* Password Row */}
        <SettingsRow
          label={locale === 'fa' ? 'رمز عبور' : 'Password'}
          hint={locale === 'fa' ? 'تنظیم یک رمز عبور قوی برای ورود به سیستم.' : 'Set a secure password for account login.'}
          controlEnd
        >
          <LemmoButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowPasswordDialog(!showPasswordDialog)}
          >
            {locale === 'fa' ? 'تغییر رمز عبور' : 'Change Password'}
          </LemmoButton>
        </SettingsRow>

        {showPasswordDialog && (
          <form className="password-change-box" onSubmit={handleSavePassword}>
            <SettingsRow label={locale === 'fa' ? 'رمز فعلی' : 'Current password'}>
              <LemmoInput
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </SettingsRow>
            <SettingsRow label={locale === 'fa' ? 'رمز جدید' : 'New password'}>
              <LemmoInput
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </SettingsRow>
            <div className="password-actions">
              <LemmoButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPasswordDialog(false)}
              >
                {locale === 'fa' ? 'انصراف' : 'Cancel'}
              </LemmoButton>
              <LemmoButton type="submit" variant="primary" size="sm">
                {locale === 'fa' ? 'ذخیره رمز' : 'Update'}
              </LemmoButton>
            </div>
          </form>
        )}

        {/* 2FA Row */}
        <SettingsRow
          label={locale === 'fa' ? 'احراز هویت دومرحله‌ای (2FA)' : 'Two-Factor Authentication'}
          hint={
            locale === 'fa'
              ? 'افزایش امنیت ورود به حساب با کد یکبارمصرف اپلیکیشن‌های احراز هویت.'
              : 'Add an extra layer of security using an authenticator app.'
          }
          controlEnd
        >
          <LemmoToggle
            checked={twoFactorEnabled}
            onChange={(val) => {
              setTwoFactorEnabled(val);
              onShowToast(
                val
                  ? locale === 'fa'
                    ? 'احراز هویت دومرحله‌ای فعال شد'
                    : '2FA enabled'
                  : locale === 'fa'
                  ? 'احراز هویت دومرحله‌ای غیرفعال شد'
                  : '2FA disabled'
              );
            }}
            ariaLabel="Toggle Two-Factor Authentication"
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'ترجیحات محلی' : 'Locale & Region'}>
        {/* Language Selection */}
        <SettingsRow label={locale === 'fa' ? 'زبان رابط کاربری' : 'Interface language'}>
          <LemmoSelect
            id="acc-lang"
            value={locale}
            onChange={(val) => {
              setLocale(val as any);
              onShowToast(val === 'fa' ? 'زبان فارسی انتخاب شد' : 'English selected');
            }}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fa', label: 'فارسی' },
              { value: 'de', label: 'Deutsch' },
            ]}
          />
        </SettingsRow>

        {/* Timezone */}
        <SettingsRow label={locale === 'fa' ? 'منطقه زمانی' : 'Timezone'}>
          <LemmoSelect
            id="acc-tz"
            value={timezone}
            onChange={(val) => {
              setTimezone(val);
              onShowToast(locale === 'fa' ? 'منطقه زمانی به‌روزرسانی شد' : 'Timezone updated');
            }}
            options={[
              { value: 'Asia/Tehran', label: '(UTC+03:30) Tehran' },
              { value: 'UTC', label: '(UTC+00:00) UTC' },
              { value: 'Europe/London', label: '(UTC+01:00) London' },
              { value: 'America/New_York', label: '(UTC-05:00) New York' },
              { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo' },
            ]}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'ناحیه خطر' : 'Danger Zone'}>
        <SettingsRow
          label={locale === 'fa' ? 'حذف حساب کاربری' : 'Delete Account'}
          hint={
            locale === 'fa'
              ? 'حذف دائمی حساب کاربری و تمامی پروژه‌ها و توکن‌های مربوط به آن.'
              : 'Permanently remove your account and associated project data.'
          }
          controlEnd
        >
          <LemmoButton
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              const ok = window.confirm(
                locale === 'fa'
                  ? 'آیا از حذف دائمی حساب کاربری خود اطمینان دارید؟ این عملیات غیرقابل بازگشت است.'
                  : 'Are you sure you want to delete your account? This action is irreversible.'
              );
              if (ok) onShowToast(locale === 'fa' ? 'درخواست حذف ثبت شد' : 'Deletion requested');
            }}
          >
            {locale === 'fa' ? 'حذف حساب' : 'Delete Account'}
          </LemmoButton>
        </SettingsRow>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .email-input-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .email-verified-badge {
          position: absolute;
          inset-inline-end: var(--lemmo-space-300, 12px);
          width: 20px;
          height: 20px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-border-success, #2eb844);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .verify-card-box {
          margin: var(--lemmo-space-300, 12px) 0;
          padding: var(--lemmo-space-400, 16px);
          background: color-mix(in srgb, var(--lemmo-text-warning, #dfab01) 6%, var(--lemmo-surface-tertiary-background, #0a0c0e));
          border: var(--lemmo-stroke-thin, 1px) solid color-mix(in srgb, var(--lemmo-text-warning, #dfab01) 25%, transparent);
          border-radius: var(--lemmo-radius-card, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-gap-3, 12px);
        }

        .verify-card-header {
          display: flex;
          align-items: flex-start;
          gap: var(--lemmo-gap-2-5, 10px);
        }

        :global(.verify-warn-icon) {
          color: var(--lemmo-text-warning, #dfab01);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .verify-card-title {
          margin: 0;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .verify-card-sub {
          margin: 2px 0 0;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .verify-card-form {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--lemmo-gap-3, 12px);
        }

        .otp-digit-row {
          display: flex;
          gap: var(--lemmo-space-150, 6px);
        }

        .otp-digit-input {
          width: 34px;
          height: 38px;
          border-radius: var(--lemmo-radius-150, 6px);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          background: var(--lemmo-surface-primary-background, #1c1e20);
          color: #ffffff;
          font-family: inherit;
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          text-align: center;
          outline: none;
          transition: border-color var(--lemmo-duration-fast, 120ms) ease;
        }

        .otp-digit-input:focus {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
        }

        .password-change-box {
          margin: var(--lemmo-space-300, 12px) 0;
          padding: var(--lemmo-space-400, 16px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-card, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-gap-2, 8px);
        }

        .password-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--lemmo-gap-2, 8px);
          margin-top: var(--lemmo-space-200, 8px);
        }
      `}</style>
    </div>
  );
}
