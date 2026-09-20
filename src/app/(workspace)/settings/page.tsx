/**
 * Settings Page — Lemmo Design System Implementation
 *
 * Implements the minimal, delicate wireframe aesthetic (.page / .section / .row)
 * from app/.wireframe/layout/setting.html, fully integrated with:
 * - @lemmo-lab/tokens (colors, radii, surfaces, typography, semantic contracts)
 * - synthline/react icon system
 * - Bilingual support (Persian RTL / English LTR)
 * - Full implementations for all 10 settings panels:
 *   Account: Profile, Account, Appearance, Promo
 *   Workspace: Overview, Members, Settings, Billing, Compute Packs
 *   Developer: API Tokens
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Check01,
  Copy01,
  Trash01,
  Camera01,
  Plus01,
  Link01,
  Download01,
  Lock01,
  Globe01,
  X01,
  Send01,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';

interface SelectOption {
  value: string;
  label: string;
}

interface LemmoSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  ariaLabel?: string;
}

function LemmoSelect({
  id,
  value,
  onChange,
  options,
  className = '',
  ariaLabel,
}: LemmoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 220 && rect.top > 200);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className={`lemmo-select-container ${className}`}>
      <button
        id={id}
        type="button"
        className={`lemmo-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="selected-label-text">{selectedOption ? selectedOption.label : value}</span>
        <span className={`select-chevron ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={`lemmo-select-menu ${openUpwards ? 'open-upwards' : ''}`} role="listbox" aria-label={ariaLabel}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`lemmo-select-option ${isSelected ? 'selected' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check01 size={13} strokeWidth={2.4} className="option-check-icon" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="settings-loading-skeleton" />}>
      <SettingsContent />
    </React.Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, dir, setLocale } = useUiStore();
  const isRtl = dir === 'rtl';

  // Active panel state
  const initialPanel = searchParams.get('tab') || searchParams.get('panel') || 'profile';
  const [activePanel, setActivePanel] = useState<string>(initialPanel);

  useEffect(() => {
    const tabParam = searchParams.get('tab') || searchParams.get('panel');
    if (tabParam) {
      setActivePanel(tabParam);
    }
  }, [searchParams]);

  // Toast system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  }, []);

  // =========================================================================
  // 1. PROFILE STATE
  // =========================================================================
  const [displayName, setDisplayName] = useState(locale === 'fa' ? 'بهروز احمدی' : 'Alex Morgan');
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
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);

  const [profileBaseline, setProfileBaseline] = useState(() =>
    JSON.stringify({
      name: locale === 'fa' ? 'بهروز احمدی' : 'Alex Morgan',
      username: 'alexmorgan',
      bio:
        locale === 'fa'
          ? 'طراح محصول و ابزارهای خلاقانه هوش مصنوعی در استودیو لیمو.'
          : 'Product designer building calm, considered tools. Currently exploring generative imagery.',
      x: 'alexmorgan',
      github: 'alex-designer',
      instagram: 'alex.design',
      avatar: '',
    })
  );

  const currentProfileString = JSON.stringify({
    name: displayName,
    username,
    bio,
    x: xHandle,
    github: githubHandle,
    instagram: instagramHandle,
    avatar: avatarUrl || '',
  });

  const isProfileDirty = currentProfileString !== profileBaseline;

  const initials = (() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    const s = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
    return s.toUpperCase() || 'LM';
  })();

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!/^image\//.test(file.type)) {
      showToast(locale === 'fa' ? 'لطفاً یک فایل تصویری انتخاب کنید.' : 'Choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast(locale === 'fa' ? 'حجم تصویر باید کمتر از ۲ مگابایت باشد.' : 'Choose an image under 2 MB.');
      return;
    }

    if (avatarUrl && avatarUrl !== savedAvatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileBaseline(currentProfileString);
    setSavedAvatarUrl(avatarUrl);
    showToast(locale === 'fa' ? 'پروفایل ذخیره شد' : 'Profile saved');
  };

  const handleCancelProfile = () => {
    try {
      const b = JSON.parse(profileBaseline);
      setDisplayName(b.name);
      setUsername(b.username);
      setBio(b.bio);
      setXHandle(b.x);
      setGithubHandle(b.github);
      setInstagramHandle(b.instagram);
      setAvatarUrl(savedAvatarUrl);
    } catch {
      // ignore
    }
  };

  // =========================================================================
  // 2. ACCOUNT STATE
  // =========================================================================
  const [email, setEmail] = useState('alex@example.com');
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(true);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [accountLanguage, setAccountLanguage] = useState<'en' | 'fa' | 'de'>(
    locale === 'fa' ? 'fa' : 'en'
  );
  const [accountTimezone, setAccountTimezone] = useState('Asia/Tehran');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isDeleteArmed, setIsDeleteArmed] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isEmailVerified = Boolean(verifiedEmail && email.trim() === verifiedEmail);

  const startCooldown = (sec = 30) => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    setCooldown(sec);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpDigit = (idx: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      const updated = [...otpDigits];
      updated[idx] = '';
      setOtpDigits(updated);
      return;
    }
    const lastChar = digitsOnly.slice(-1);
    const updated = [...otpDigits];
    updated[idx] = lastChar;
    setOtpDigits(updated);
    setIsOtpInvalid(false);
    setVerifyError(null);
    if (lastChar && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[idx] && idx > 0) {
        // Clear previous box and move focus back
        const updated = [...otpDigits];
        updated[idx - 1] = '';
        setOtpDigits(updated);
        otpInputRefs.current[idx - 1]?.focus();
        e.preventDefault();
      } else if (otpDigits[idx]) {
        // Clear current box and stay
        const updated = [...otpDigits];
        updated[idx] = '';
        setOtpDigits(updated);
        e.preventDefault();
      }
    } else if (e.key === 'Delete') {
      if (otpDigits[idx]) {
        const updated = [...otpDigits];
        updated[idx] = '';
        setOtpDigits(updated);
        e.preventDefault();
      }
    } else if (e.key === 'ArrowLeft') {
      if (idx > 0) {
        otpInputRefs.current[idx - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight') {
      if (idx < 5) {
        otpInputRefs.current[idx + 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === 'Enter') {
      if (otpDigits.join('').length === 6) {
        handleVerifyEmail();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text') || '';
    const digits = text.replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    const updated = [...otpDigits];
    for (let k = 0; k < digits.length; k++) {
      updated[k] = digits[k];
    }
    setOtpDigits(updated);
    setIsOtpInvalid(false);
    setVerifyError(null);
    const targetIdx = Math.min(digits.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleVerifyEmail = () => {
    const code = otpDigits.join('');
    if (code.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (code === '123456' || code !== '000000') {
        setVerifiedEmail(email.trim());
        setIsVerifyOpen(false);
        setOtpDigits(['', '', '', '', '', '']);
        showToast(locale === 'fa' ? 'ایمیل تأیید شد' : 'Email verified');
      } else {
        setVerifyError(
          locale === 'fa'
            ? 'کد وارد شده صحیح نیست. مجدداً بررسی کنید (کد دمو: ۱۲۳۴۵۶).'
            : "That code isn't right. Check it and try again (Demo: 123456)."
        );
        setIsOtpInvalid(true);
        setOtpDigits(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
        setTimeout(() => setIsOtpInvalid(false), 400);
      }
    }, 600);
  };

  const handleDeleteAccount = () => {
    if (!isDeleteArmed) {
      setIsDeleteArmed(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => setIsDeleteArmed(false), 4000);
    } else {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      setIsDeleteArmed(false);
      showToast(
        locale === 'fa' ? 'درخواست حذف حساب ثبت شد' : 'Account deletion requested'
      );
    }
  };

  // =========================================================================
  // 3. APPEARANCE STATE
  // =========================================================================
  const [selectedTheme, setSelectedTheme] = useState('neon-obsidian');
  const [canvasGrid, setCanvasGrid] = useState('dots');
  const [accentGlow, setAccentGlow] = useState('high');
  const [interfaceDensity, setInterfaceDensity] = useState('comfortable');

  const THEMES_LIST = [
    {
      id: 'neon-obsidian',
      nameFa: 'نئون ابسیدین (پیش‌فرض)',
      nameEn: 'Neon Obsidian (Default)',
      descFa: 'امضای رسمی لیمو؛ زغالی عمیق با اکسنت‌های فسفری فوق مدرن.',
      descEn: 'Official Lemmo signature; deep obsidian charcoal with electric lime.',
      colors: ['#131517', '#1c1e20', '#d1fe17'],
      isReady: true,
    },
    {
      id: 'cyber-matrix',
      nameFa: 'سایبر ماتریکس',
      nameEn: 'Cyber Matrix',
      descFa: 'پالت فیروزه‌ای نئونی و مشکی سایبری برای طراحان سه‌بعدی.',
      descEn: 'Futuristic atmosphere with neon cyan and cyber black.',
      colors: ['#091114', '#0d1e24', '#00ffd5'],
      isReady: false,
    },
    {
      id: 'solar-amber',
      nameFa: 'سولار امبر',
      nameEn: 'Solar Amber',
      descFa: 'طیف‌های کهربایی، نور شامگاهی و طلایی سینمایی.',
      descEn: 'Dusk twilight palette with rich warm amber and cinematic sunset gold.',
      colors: ['#160f0c', '#241712', '#ff7a29'],
      isReady: false,
    },
    {
      id: 'nordic-slate',
      nameFa: 'نوردیک استیل',
      nameEn: 'Nordic Slate',
      descFa: 'مینیمال با سایه‌های خاکستری سربی و آبی یخی.',
      descEn: 'Minimalist metallic aesthetic with slate grey and ice blue.',
      colors: ['#0d1117', '#161d27', '#8ec5fc'],
      isReady: false,
    },
  ];

  // =========================================================================
  // 4. PROMO STATE
  // =========================================================================
  const [promoCode, setPromoCode] = useState('');
  const [isClaimingPromo, setIsClaimingPromo] = useState(false);
  const [promoStatus, setPromoStatus] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  const [isPromoNudging, setIsPromoNudging] = useState(false);
  const promoInputRef = useRef<HTMLInputElement>(null);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code || isClaimingPromo) return;
    setIsClaimingPromo(true);
    setPromoStatus(null);
    setTimeout(() => {
      setIsClaimingPromo(false);
      if (['WELCOME', 'LEMMO', 'LEMMO25', 'STUDIO'].includes(code)) {
        setPromoCode('');
        setPromoStatus({
          text:
            locale === 'fa'
              ? 'کد تخفیف با موفقیت به فضای کاری شما اعمال شد.'
              : 'Code applied to your workspace.',
          tone: 'success',
        });
      } else {
        setPromoStatus({
          text:
            locale === 'fa'
              ? 'این کد معتبر نیست یا قبلاً استفاده شده است.'
              : "This code isn't valid or has already been used.",
          tone: 'error',
        });
        setIsPromoNudging(true);
        setTimeout(() => setIsPromoNudging(false), 350);
      }
    }, 650);
  };

  // =========================================================================
  // 5. OVERVIEW STATE
  // =========================================================================
  const [workspaceName, setWorkspaceName] = useState('Lemmo Pro Studio');
  const workspaceSlug = 'lemmo.space/w/behroz-studio';

  // =========================================================================
  // 6. MEMBERS STATE
  // =========================================================================
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [membersList, setMembersList] = useState([
    {
      id: 'm-1',
      name: 'بهروز احمدی',
      email: 'behroz@lemmo.space',
      role: 'Owner',
      initials: 'BA',
    },
    {
      id: 'm-2',
      name: 'سارا تهرانی',
      email: 'sara.t@studio.design',
      role: 'Editor',
      initials: 'ST',
    },
    {
      id: 'm-3',
      name: 'کیان راد',
      email: 'kian@lemmo.space',
      role: 'Admin',
      initials: 'KR',
    },
    {
      id: 'm-4',
      name: 'مهدی شمس',
      email: 'mehdi.shams@partner.ai',
      role: 'Viewer',
      initials: 'MS',
    },
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;
    setMembersList((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        initials: inviteEmail.slice(0, 2).toUpperCase(),
      },
    ]);
    setInviteEmail('');
    showToast(
      locale === 'fa'
        ? `دعوت‌نامه برای ${inviteEmail} ارسال شد.`
        : `Invitation sent to ${inviteEmail}.`
    );
  };

  const handleRemoveMember = (id: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== id));
    showToast(locale === 'fa' ? 'عضو حذف شد.' : 'Member removed.');
  };

  // =========================================================================
  // 7. WORKSPACE SETTINGS STATE
  // =========================================================================
  const [defaultWorkspaceView, setDefaultWorkspaceView] = useState('agent');
  const [autoSaveInterval, setAutoSaveInterval] = useState('30s');
  const [historyRetention, setHistoryRetention] = useState('90d');
  const [allowPublicLinks, setAllowPublicLinks] = useState('team-only');

  // =========================================================================
  // 8. BILLING STATE
  // =========================================================================
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // =========================================================================
  // 9. COMPUTE PACKS STATE
  // =========================================================================
  const [gpuTurboMode, setGpuTurboMode] = useState(true);
  const [autoRecharge, setAutoRecharge] = useState(false);

  // =========================================================================
  // 10. API TOKENS STATE
  // =========================================================================
  const [tokensList, setTokensList] = useState([
    {
      id: 'tok-1',
      name: 'Studio Production Server',
      prefix: 'lemmo_live_9f88***c304',
      scope: 'Full Access',
      date: '۲۸ شهریور ۱۴۰۵',
    },
    {
      id: 'tok-2',
      name: 'Automated Bot Integration',
      prefix: 'lemmo_live_4b12***e892',
      scope: 'Inference Only',
      date: '۱۵ شهریور ۱۴۰۵',
    },
  ]);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScope, setNewTokenScope] = useState('Full Access');

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;
    const randomHex = Math.random().toString(16).slice(2, 6);
    setTokensList((prev) => [
      {
        id: `tok-${Date.now()}`,
        name: newTokenName,
        prefix: `lemmo_live_${randomHex}***${Date.now().toString().slice(-4)}`,
        scope: newTokenScope,
        date: locale === 'fa' ? 'هم‌اکنون' : 'Just now',
      },
      ...prev,
    ]);
    setNewTokenName('');
    showToast(locale === 'fa' ? 'توکن جدید ایجاد شد.' : 'New token generated.');
  };

  const handleRevokeToken = (id: string) => {
    setTokensList((prev) => prev.filter((t) => t.id !== id));
    showToast(locale === 'fa' ? 'توکن ابطال شد.' : 'Token revoked.');
  };

  // Close Settings Navigation
  const handleClose = () => {
    try {
      if (window.history.length > 1) router.back();
      else router.push('/app');
    } catch {
      router.push('/app');
    }
  };

  // Nav Item Renderer
  const renderNavItem = (
    panelId: string,
    labelFa: string,
    labelEn: string,
    icon: React.ReactNode
  ) => {
    const isCurrent = activePanel === panelId;
    return (
      <button
        key={panelId}
        className={`nav-item ${isCurrent ? 'active' : ''}`}
        type="button"
        data-panel={panelId}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={() => {
          setActivePanel(panelId);
          if (panelId === 'promo') {
            setTimeout(() => promoInputRef.current?.focus(), 50);
          }
        }}
      >
        <span className="nav-item-icon">{icon}</span>
        <span className="nav-item-label">{locale === 'fa' ? labelFa : labelEn}</span>
      </button>
    );
  };

  return (
    <div className="lemmo-settings-shell-container" dir={dir}>
      <div className="lemmo-settings-shell">
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION                                        */}
        {/* ========================================================= */}
        <aside className="settings-sidebar">
          <button
            className="sidebar-close-btn"
            type="button"
            aria-label="Close settings"
            onClick={handleClose}
          >
            <X01 size={15} strokeWidth={2} />
          </button>

          <nav aria-label="Settings">
            {/* Group 1: Account */}
            <div className="nav-group">
              <h2 className="group-heading">{locale === 'fa' ? 'حساب کاربری' : 'Account'}</h2>
              {renderNavItem('profile', 'پروفایل', 'Profile', <User02 size={16} strokeWidth={1.7} />)}
              {renderNavItem('account', 'حساب', 'Account', <Shield01 size={16} strokeWidth={1.7} />)}
              {renderNavItem('appearance', 'ظاهر', 'Appearance', <Sparks size={16} strokeWidth={1.7} />)}
              {renderNavItem('promo', 'کد تخفیف', 'Promo', <Ticket01 size={16} strokeWidth={1.7} />)}
            </div>

            {/* Group 2: Workspace */}
            <div className="nav-group">
              <h2 className="group-heading">{locale === 'fa' ? 'فضای کاری' : 'Workspace'}</h2>
              {renderNavItem('overview', 'نمای کلی', 'Overview', <LayersThree size={16} strokeWidth={1.7} />)}
              {renderNavItem('members', 'اعضا', 'Members', <UsersPlus01 size={16} strokeWidth={1.7} />)}
              {renderNavItem('settings', 'تنظیمات', 'Settings', <Settings01 size={16} strokeWidth={1.7} />)}
              {renderNavItem('billing', 'صورت‌حساب', 'Billing', <CreditCard01 size={16} strokeWidth={1.7} />)}
              {renderNavItem('compute-packs', 'بسته‌های پردازشی', 'Compute Packs', <Server01 size={16} strokeWidth={1.7} />)}
            </div>

            {/* Group 3: Developer */}
            <div className="nav-group">
              <h2 className="group-heading">{locale === 'fa' ? 'توسعه‌دهندگان' : 'Developer'}</h2>
              {renderNavItem('api-tokens', 'توکن‌های API', 'API Tokens', <Key01 size={16} strokeWidth={1.7} />)}
            </div>
          </nav>
        </aside>

        {/* ========================================================= */}
        {/* MAIN PANELS VIEWPORT                                      */}
        {/* ========================================================= */}
        <main className="settings-main-viewport">
          {/* ========================================================= */}
          {/* 1. PROFILE PANEL                                          */}
          {/* ========================================================= */}
          {activePanel === 'profile' && (
            <section className="settings-page-content" aria-labelledby="profile-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="profile-heading">{locale === 'fa' ? 'پروفایل' : 'Profile'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'مدیریت نحوه نمایش مشخصات عمومی و هویت شما در استودیو لیمو.'
                      : 'Manage how you appear across the workspace.'}
                  </p>
                </header>

                <form onSubmit={handleSaveProfile} autoComplete="off">
                  {/* Public Profile Section */}
                  <section className="settings-section">
                    <h2 className="section-title">
                      {locale === 'fa' ? 'نمایه عمومی' : 'Public profile'}
                    </h2>

                    {/* Photo Row */}
                    <div className="settings-row">
                      <span className="row-label">{locale === 'fa' ? 'تصویر نمایه' : 'Photo'}</span>
                      <div className="row-control avatar-control-line">
                        <div className="avatar-frame" aria-hidden="true">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>
                        <div className="btn-actions-inline">
                          <input
                            type="file"
                            accept="image/*"
                            ref={profileFileRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarFileChange}
                          />
                          <button
                            className="btn-wireframe"
                            type="button"
                            onClick={() => profileFileRef.current?.click()}
                          >
                            <Camera01 size={14} strokeWidth={1.8} />
                            <span>{locale === 'fa' ? 'آپلود' : 'Upload'}</span>
                          </button>
                          {avatarUrl && (
                            <button
                              className="btn-wireframe btn-ghost"
                              type="button"
                              onClick={() => setAvatarUrl(null)}
                            >
                              <span>{locale === 'fa' ? 'حذف' : 'Remove'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Display Name Row */}
                    <div className="settings-row">
                      <label className="row-label" htmlFor="p-name">
                        {locale === 'fa' ? 'نام نمایشی' : 'Display name'}
                        <span className="required-star">*</span>
                      </label>
                      <div className="row-control">
                        <input
                          className="field-input"
                          id="p-name"
                          type="text"
                          maxLength={50}
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Username Row */}
                    <div className="settings-row">
                      <label className="row-label" htmlFor="p-username">
                        {locale === 'fa' ? 'نام کاربری' : 'Username'}
                        <span className="required-star">*</span>
                      </label>
                      <div className="row-control input-affix-wrapper">
                        <span className="input-affix">@</span>
                        <input
                          className="field-input"
                          id="p-username"
                          type="text"
                          minLength={3}
                          maxLength={24}
                          required
                          value={username}
                          onChange={(e) =>
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))
                          }
                        />
                      </div>
                    </div>

                    {/* Bio Row */}
                    <div className="settings-row row-stack">
                      <div className="label-counter-line">
                        <label className="row-label" htmlFor="p-bio">
                          {locale === 'fa' ? 'بیوگرافی' : 'Bio'}
                        </label>
                        <span className="char-counter">
                          {200 - bio.length}{' '}
                          {locale === 'fa' ? 'کاراکتر باقی‌مانده' : 'characters left'}
                        </span>
                      </div>
                      <textarea
                        className="field-input field-textarea"
                        id="p-bio"
                        rows={5}
                        maxLength={200}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                  </section>

                  {/* Social Profiles Section */}
                  <section className="settings-section">
                    <h2 className="section-title">
                      {locale === 'fa' ? 'حساب‌های شبکه‌های اجتماعی' : 'Social profiles'}
                    </h2>

                    <div className="settings-row">
                      <label className="row-label" htmlFor="p-x">
                        x.com/
                      </label>
                      <div className="row-control">
                        <input
                          className="field-input"
                          id="p-x"
                          type="text"
                          placeholder="username"
                          value={xHandle}
                          onChange={(e) => setXHandle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="settings-row">
                      <label className="row-label" htmlFor="p-github">
                        github.com/
                      </label>
                      <div className="row-control">
                        <input
                          className="field-input"
                          id="p-github"
                          type="text"
                          placeholder="username"
                          value={githubHandle}
                          onChange={(e) => setGithubHandle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="settings-row">
                      <label className="row-label" htmlFor="p-instagram">
                        instagram.com/
                      </label>
                      <div className="row-control">
                        <input
                          className="field-input"
                          id="p-instagram"
                          type="text"
                          placeholder="username"
                          value={instagramHandle}
                          onChange={(e) => setInstagramHandle(e.target.value)}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="page-actions-bar">
                    <button
                      className="btn-wireframe"
                      type="button"
                      disabled={!isProfileDirty}
                      onClick={handleCancelProfile}
                    >
                      <span>{locale === 'fa' ? 'انصراف' : 'Cancel'}</span>
                    </button>
                    <button
                      className="btn-wireframe btn-primary"
                      type="submit"
                      disabled={!isProfileDirty}
                    >
                      <span>{locale === 'fa' ? 'ذخیره تغییرات' : 'Save changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 2. ACCOUNT PANEL                                          */}
          {/* ========================================================= */}
          {activePanel === 'account' && (
            <section className="settings-page-content" aria-labelledby="account-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="account-heading">{locale === 'fa' ? 'حساب کاربری' : 'Account'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'مدیریت اطلاعات ورود به سیستم، رمز عبور و ترجیحات حساب شما.'
                      : 'Manage your sign-in details and preferences.'}
                  </p>
                </header>

                {/* Sign-in Section */}
                <section className="settings-section">
                  <h2 className="section-title">{locale === 'fa' ? 'اطلاعات ورود' : 'Sign-in'}</h2>

                  <div className="settings-row row-verify-container">
                    <label className="row-label" htmlFor="acc-email">
                      {locale === 'fa' ? 'آدرس ایمیل' : 'Email address'}
                      <span className="required-star">*</span>
                    </label>
                    <div className={`row-control input-affix-wrapper ${isEmailVerified ? 'is-verified' : ''}`}>
                      <input
                        className="field-input"
                        id="acc-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (verifiedEmail && e.target.value.trim() !== verifiedEmail) {
                            setVerifiedEmail(null);
                            setIsVerifyOpen(true);
                          }
                        }}
                        onFocus={() => {
                          if (!isEmailVerified) setIsVerifyOpen(true);
                        }}
                      />
                      {isEmailVerified && (
                        <span
                          className="verified-check-circle"
                          title={locale === 'fa' ? 'ایمیل تأیید شده است' : 'Email is verified'}
                          aria-label={locale === 'fa' ? 'ایمیل تأیید شده' : 'Email verified'}
                        >
                          <Check01 size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    {/* Verification Box & 6-Digit OTP */}
                    {isVerifyOpen && !isEmailVerified && (
                      <div className="email-verify-collapse">
                        <div className="verify-card-box">
                          <Send01 size={16} className="verify-icon" aria-hidden="true" />
                          <div className="verify-text">
                            <p className="verify-card-title">
                              {locale === 'fa' ? 'لطفاً ایمیل خود را تأیید کنید' : 'Please verify your email'}
                            </p>
                            <p className={`verify-card-desc ${verifyError ? 'verify-err-msg' : ''}`}>
                              {verifyError ? (
                                verifyError
                              ) : (
                                <>
                                  {locale === 'fa' ? 'یک کد ۶ رقمی ارسال شد به ' : 'We sent a 6-digit code to '}
                                  <strong>{email}</strong>
                                </>
                              )}
                            </p>
                          </div>

                          <div
                            className={`otp-boxes-group ${isOtpInvalid ? 'invalid' : ''}`}
                            dir="ltr"
                            role="group"
                            aria-label="6-digit verification code"
                            onPaste={handleOtpPaste}
                          >
                            {otpDigits.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => {
                                  otpInputRefs.current[i] = el;
                                }}
                                className="otp-digit-box"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder={focusedOtpIndex === i || digit ? '' : '0'}
                                value={digit}
                                onChange={(e) => handleOtpDigit(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                onFocus={(e) => {
                                  setFocusedOtpIndex(i);
                                  e.target.select();
                                }}
                                onBlur={() => setFocusedOtpIndex(null)}
                                onPaste={handleOtpPaste}
                                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                aria-label={`Digit ${i + 1}`}
                              />
                            ))}
                          </div>

                          <button
                            className="btn-link-action verify-link"
                            type="button"
                            disabled={cooldown > 0}
                            onClick={() => {
                              startCooldown(30);
                              showToast(locale === 'fa' ? 'کد جدید ارسال شد' : 'New code sent');
                            }}
                          >
                            {cooldown > 0
                              ? locale === 'fa'
                                ? `ارسال مجدد در ${cooldown} ثانیه`
                                : `Resend in ${cooldown}s`
                              : locale === 'fa'
                              ? 'ایمیل را دریافت نکردید؟'
                              : 'Didn’t get the email?'}
                          </button>

                          <button
                            className="btn-wireframe verify-action"
                            type="button"
                            disabled={otpDigits.join('').length !== 6 || isVerifying}
                            onClick={handleVerifyEmail}
                          >
                            {isVerifying
                              ? locale === 'fa'
                                ? 'در حال بررسی…'
                                : 'Verifying…'
                              : locale === 'fa'
                              ? 'تأیید ایمیل'
                              : 'Verify email'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Password Row */}
                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'رمز عبور' : 'Password'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? 'تنظیم یک رمز عبور جدید برای ورود به حساب.'
                          : 'Set a new password for signing in.'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe"
                        type="button"
                        onClick={() =>
                          showToast(
                            locale === 'fa'
                              ? 'پیوند تنظیم رمز عبور به ایمیل شما ارسال شد.'
                              : 'We emailed you a link to set a new password.'
                          )
                        }
                      >
                        <span>{locale === 'fa' ? 'تغییر رمز عبور' : 'Change password'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2FA Row */}
                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'احراز هویت دومرحله‌ای (2FA)' : 'Two-factor Authentication'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? 'افزایش امنیت ورود به حساب با کد یکبارمصرف اپلیکیشن‌های احراز هویت.'
                          : 'Secure your sign-in with an authenticator app (TOTP).'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe"
                        type="button"
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          showToast(
                            locale === 'fa'
                              ? twoFactorEnabled
                                ? 'احراز هویت دومرحله‌ای غیرفعال شد.'
                                : 'احراز هویت دومرحله‌ای فعال شد.'
                              : twoFactorEnabled
                              ? '2FA disabled.'
                              : '2FA enabled.'
                          );
                        }}
                      >
                        <span>
                          {twoFactorEnabled
                            ? locale === 'fa'
                              ? 'غیرفعال‌سازی'
                              : 'Disable 2FA'
                            : locale === 'fa'
                            ? 'فعال‌سازی'
                            : 'Enable 2FA'}
                        </span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Preferences Section */}
                <section className="settings-section">
                  <h2 className="section-title">{locale === 'fa' ? 'ترجیحات' : 'Preferences'}</h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="acc-lang">
                      {locale === 'fa' ? 'زبان' : 'Language'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="acc-lang"
                        value={accountLanguage}
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'fa', label: 'فارسی' },
                          { value: 'de', label: 'Deutsch' },
                        ]}
                        onChange={(val) => {
                          const lang = val as 'en' | 'fa' | 'de';
                          setAccountLanguage(lang);
                          if (lang === 'fa' || lang === 'en') setLocale(lang);
                          showToast(locale === 'fa' ? 'ترجیحات ذخیره شد' : 'Preferences saved');
                        }}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="acc-tz">
                      {locale === 'fa' ? 'منطقه زمانی' : 'Time zone'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="acc-tz"
                        value={accountTimezone}
                        options={[
                          { value: 'UTC', label: '(UTC+00:00) UTC' },
                          { value: 'Europe/London', label: '(UTC+00:00) London' },
                          { value: 'Europe/Berlin', label: '(UTC+01:00) Berlin' },
                          { value: 'Asia/Tehran', label: '(UTC+03:30) Tehran' },
                          { value: 'Asia/Dubai', label: '(UTC+04:00) Dubai' },
                          { value: 'America/New_York', label: '(UTC−05:00) New York' },
                          { value: 'America/Los_Angeles', label: '(UTC−08:00) Los Angeles' },
                        ]}
                        onChange={(val) => {
                          setAccountTimezone(val);
                          showToast(locale === 'fa' ? 'ترجیحات ذخیره شد' : 'Preferences saved');
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* Danger Zone Section */}
                <section className="settings-section">
                  <h2 className="section-title">{locale === 'fa' ? 'ناحیه خطر' : 'Danger zone'}</h2>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'حذف حساب کاربری' : 'Delete account'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? 'حذف دائمی حساب کاربری و تمامی داده‌های مربوط به آن.'
                          : 'Permanently remove your account and all its data.'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className={`btn-wireframe btn-danger ${isDeleteArmed ? 'armed' : ''}`}
                        type="button"
                        onClick={handleDeleteAccount}
                      >
                        <span>
                          {isDeleteArmed
                            ? locale === 'fa'
                              ? 'برای تأیید دوباره کلیک کنید'
                              : 'Click again to confirm'
                            : locale === 'fa'
                            ? 'حذف حساب کاربری'
                            : 'Delete account'}
                        </span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 3. APPEARANCE PANEL                                       */}
          {/* ========================================================= */}
          {activePanel === 'appearance' && (
            <section className="settings-page-content" aria-labelledby="appearance-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="appearance-heading">{locale === 'fa' ? 'ظاهر و تم‌ها' : 'Appearance'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'سفارشی‌سازی ظاهر محیط کاربری و پالت‌های نوین استودیو لیمو.'
                      : 'Customize interface aesthetics and specialized studio palettes.'}
                  </p>
                </header>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'تم‌های استودیو لیمو' : 'Studio Palettes'}
                  </h2>

                  {THEMES_LIST.map((th) => {
                    const isSelected = selectedTheme === th.id;
                    return (
                      <div key={th.id} className="settings-row">
                        <div className="row-label">
                          <div className="theme-name-headline">
                            <span>{locale === 'fa' ? th.nameFa : th.nameEn}</span>
                            <div className="theme-color-swatches" aria-hidden="true">
                              {th.colors.map((c, i) => (
                                <span key={i} className="swatch-circle" style={{ background: c }} />
                              ))}
                            </div>
                          </div>
                          <span className="row-hint">
                            {locale === 'fa' ? th.descFa : th.descEn}
                          </span>
                        </div>
                        <div className="row-control control-end">
                          <button
                            className={`btn-wireframe ${isSelected ? 'btn-primary' : ''}`}
                            type="button"
                            onClick={() => {
                              setSelectedTheme(th.id);
                              showToast(
                                locale === 'fa'
                                  ? `تم «${th.nameFa}» اعمال گردید.`
                                  : `Theme "${th.nameEn}" activated.`
                              );
                            }}
                          >
                            <span>
                              {isSelected
                                ? locale === 'fa'
                                  ? 'فعال'
                                  : 'Active'
                                : th.isReady
                                ? locale === 'fa'
                                  ? 'انتخاب'
                                  : 'Select'
                                : locale === 'fa'
                                ? 'به‌زودی'
                                : 'Coming Soon'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </section>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'ترجیحات بصری بوم و درخشش' : 'Canvas & Visual Effects'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="canvas-grid-select">
                      {locale === 'fa' ? 'شبکه پس‌زمینه بوم' : 'Canvas background grid'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="canvas-grid-select"
                        value={canvasGrid}
                        onChange={(val) => {
                          setCanvasGrid(val);
                          showToast(locale === 'fa' ? 'تنظیم بوم ذخیره شد' : 'Canvas grid updated');
                        }}
                        options={[
                          { value: 'dots', label: locale === 'fa' ? 'نقطه‌ای (Dots)' : 'Dotted grid' },
                          { value: 'lines', label: locale === 'fa' ? 'شبکه‌ای (Lines)' : 'Square lines' },
                          { value: 'clean', label: locale === 'fa' ? 'ساده و یکدست' : 'Clean solid' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="accent-glow-select">
                      {locale === 'fa' ? 'شدت درخشش نئونی' : 'Neon accent glow'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="accent-glow-select"
                        value={accentGlow}
                        onChange={(val) => {
                          setAccentGlow(val);
                          showToast(locale === 'fa' ? 'شدت درخشش ذخیره شد' : 'Glow intensity updated');
                        }}
                        options={[
                          { value: 'high', label: locale === 'fa' ? 'حداکثر (High)' : 'Vibrant / High' },
                          { value: 'medium', label: locale === 'fa' ? 'متعادل (Medium)' : 'Balanced / Medium' },
                          { value: 'subtle', label: locale === 'fa' ? 'ظریف (Subtle)' : 'Minimal / Subtle' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="density-select">
                      {locale === 'fa' ? 'تراکم رابط کاربری' : 'Interface density'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="density-select"
                        value={interfaceDensity}
                        onChange={(val) => {
                          setInterfaceDensity(val);
                          showToast(locale === 'fa' ? 'تراکم رابط کاربری ذخیره شد' : 'Density updated');
                        }}
                        options={[
                          { value: 'comfortable', label: locale === 'fa' ? 'راحت و استاندارد' : 'Comfortable' },
                          { value: 'compact', label: locale === 'fa' ? 'فشرده (Compact)' : 'Compact' },
                        ]}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 4. PROMO PANEL                                            */}
          {/* ========================================================= */}
          {activePanel === 'promo' && (
            <section className="promo-panel-centered" aria-label="Promo">
              <form
                className={`promo-container ${promoCode.trim().length > 0 ? 'has-value' : ''}`}
                noValidate
                onSubmit={handlePromoSubmit}
              >
                <label className="sr-only" htmlFor="promo-code">
                  {locale === 'fa' ? 'کد تخفیف' : 'Promo code'}
                </label>
                <input
                  ref={promoInputRef}
                  className={`promo-code-input ${isPromoNudging ? 'nudge-anim' : ''}`}
                  id="promo-code"
                  type="text"
                  placeholder={locale === 'fa' ? 'کد تخفیف را وارد کنید' : 'Enter promo code'}
                  maxLength={32}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    if (promoStatus) setPromoStatus(null);
                  }}
                />

                <button
                  className="btn-claim-voucher"
                  id="claim"
                  type="submit"
                  disabled={isClaimingPromo || !promoCode.trim()}
                >
                  {isClaimingPromo
                    ? locale === 'fa'
                      ? 'در حال بررسی…'
                      : 'Claiming…'
                    : locale === 'fa'
                    ? 'اعمال کد'
                    : 'Claim'}
                </button>

                <p
                  className="promo-feedback-status"
                  role="status"
                  aria-live="polite"
                  data-tone={promoStatus ? promoStatus.tone : undefined}
                >
                  {promoStatus ? promoStatus.text : ''}
                </p>
              </form>
            </section>
          )}

          {/* ========================================================= */}
          {/* 5. OVERVIEW PANEL                                         */}
          {/* ========================================================= */}
          {activePanel === 'overview' && (
            <section className="settings-page-content" aria-labelledby="overview-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="overview-heading">{locale === 'fa' ? 'نمای کلی فضای کاری' : 'Overview'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'اطلاعات پایه، هویت و وضعیت سهمیه‌ها و منابع مصرفی این فضای کاری.'
                      : 'Basic information, identity, and consumption metrics for this workspace.'}
                  </p>
                </header>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'مشخصات عمومی' : 'General Information'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="workspace-name">
                      {locale === 'fa' ? 'نام فضای کاری' : 'Workspace Name'}
                    </label>
                    <div className="row-control">
                      <input
                        className="field-input"
                        id="workspace-name"
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'شناسه و آدرس اختصاصی' : 'Workspace Slug'}
                      <span className="row-hint">{workspaceSlug}</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe"
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://${workspaceSlug}`);
                          showToast(locale === 'fa' ? 'آدرس کپی شد.' : 'Workspace link copied.');
                        }}
                      >
                        <Copy01 size={14} strokeWidth={1.8} />
                        <span>{locale === 'fa' ? 'کپی پیوند' : 'Copy link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'مالک اصلی' : 'Primary Owner'}
                    </div>
                    <div className="row-control control-end">
                      <span className="static-data-badge">
                        بهروز احمدی (behroz@lemmo.space)
                      </span>
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'سهمیه‌ها و منابع مصرفی' : 'Resource Quotas & Storage'}
                  </h2>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'فضای ذخیره‌سازی ابری' : 'Cloud Storage'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? '۲۴.۵ گیگابایت از ۱۰۰ گیگابایت مصرف شده است.'
                          : '24.5 GB of 100 GB used.'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <div className="quota-meter-pill">
                        <div className="quota-meter-fill" style={{ width: '24.5%' }} />
                        <span className="quota-meter-txt">24.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'اعتبار پردازش هوش مصنوعی' : 'Monthly Inference Units'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? '۸,۴۵۰ از ۱۰,۰۰۰ توکن ماه جاری مصرف شده است.'
                          : '8,450 of 10,000 monthly credits used.'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <div className="quota-meter-pill">
                        <div className="quota-meter-fill" style={{ width: '84.5%' }} />
                        <span className="quota-meter-txt">84.5%</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 6. MEMBERS PANEL                                          */}
          {/* ========================================================= */}
          {activePanel === 'members' && (
            <section className="settings-page-content" aria-labelledby="members-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="members-heading">{locale === 'fa' ? 'اعضای تیم و همکاران' : 'Members'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'مدیریت طراحان، همکاران و سطوح دسترسی به بوم و پروژه‌ها.'
                      : 'Manage team collaborators and project permissions.'}
                  </p>
                </header>

                {/* Invite Collaborator Section */}
                <form onSubmit={handleAddMember} className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'دعوت همکار جدید' : 'Invite Collaborator'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="invite-email">
                      {locale === 'fa' ? 'آدرس ایمیل همکار' : 'Email address'}
                    </label>
                    <div className="row-control">
                      <input
                        className="field-input"
                        id="invite-email"
                        type="email"
                        placeholder="designer@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="invite-role-sel">
                      {locale === 'fa' ? 'نقش دسترسی' : 'Role & Access'}
                    </label>
                    <div className="row-control">
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
                    </div>
                  </div>

                  <div className="page-actions-bar">
                    <button className="btn-wireframe btn-primary" type="submit">
                      <Plus01 size={14} strokeWidth={2} />
                      <span>{locale === 'fa' ? 'ارسال دعوت‌نامه' : 'Send Invite'}</span>
                    </button>
                  </div>
                </form>

                {/* Active Members List */}
                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'اعضای فعال فضای کاری' : 'Active Collaborators'}
                  </h2>

                  {membersList.map((m) => (
                    <div key={m.id} className="settings-row">
                      <div className="row-label member-row-meta">
                        <div className="member-avatar-disc">
                          <span>{m.initials}</span>
                        </div>
                        <div>
                          <span className="member-full-name">{m.name}</span>
                          <span className="row-hint">{m.email}</span>
                        </div>
                      </div>

                      <div className="row-control control-end member-action-cells">
                        <span className={`role-badge-tag ${m.role.toLowerCase()}`}>
                          {m.role === 'Owner' && <Shield01 size={11} strokeWidth={2} />}
                          <span>{m.role}</span>
                        </span>

                        {m.role !== 'Owner' && (
                          <button
                            className="btn-wireframe btn-ghost"
                            type="button"
                            onClick={() => handleRemoveMember(m.id)}
                            title="Remove"
                          >
                            <Trash01 size={14} strokeWidth={1.8} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 7. WORKSPACE SETTINGS PANEL                               */}
          {/* ========================================================= */}
          {activePanel === 'settings' && (
            <section className="settings-page-content" aria-labelledby="ws-settings-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="ws-settings-heading">
                    {locale === 'fa' ? 'تنظیمات فضای کاری' : 'Workspace Settings'}
                  </h1>
                  <p>
                    {locale === 'fa'
                      ? 'پیکربندی جریان کاری، رفتار ذخیره‌سازی و خط‌مشی‌های داده‌ها.'
                      : 'Configure workflow behaviors, auto-save, and privacy policies.'}
                  </p>
                </header>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'جریان کاری و رفتار استودیو' : 'Workflow & Defaults'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="ws-view-select">
                      {locale === 'fa' ? 'نمای پیشفرض استودیو' : 'Default studio view'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="ws-view-select"
                        value={defaultWorkspaceView}
                        onChange={(val) => {
                          setDefaultWorkspaceView(val);
                          showToast(locale === 'fa' ? 'تنظیمات ذخیره شد' : 'Preferences saved');
                        }}
                        options={[
                          { value: 'agent', label: locale === 'fa' ? 'ایجنت استودیو (Agent Studio)' : 'Agent Studio' },
                          { value: 'canvas', label: locale === 'fa' ? 'بوم نامحدود (Infinite Canvas)' : 'Infinite Canvas' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="autosave-select">
                      {locale === 'fa' ? 'بازه ذخیره‌سازی خودکار' : 'Auto-save interval'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="autosave-select"
                        value={autoSaveInterval}
                        onChange={(val) => {
                          setAutoSaveInterval(val);
                          showToast(locale === 'fa' ? 'تنظیمات ذخیره شد' : 'Auto-save updated');
                        }}
                        options={[
                          { value: '15s', label: locale === 'fa' ? 'هر ۱۵ ثانیه' : 'Every 15 seconds' },
                          { value: '30s', label: locale === 'fa' ? 'هر ۳۰ ثانیه' : 'Every 30 seconds' },
                          { value: '60s', label: locale === 'fa' ? 'هر ۱ دقیقه' : 'Every 1 minute' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="retention-select">
                      {locale === 'fa' ? 'نگهداری تاریخچه تولیدات' : 'History retention'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="retention-select"
                        value={historyRetention}
                        onChange={(val) => {
                          setHistoryRetention(val);
                          showToast(locale === 'fa' ? 'تنظیمات ذخیره شد' : 'Retention updated');
                        }}
                        options={[
                          { value: '30d', label: locale === 'fa' ? '۳۰ روز' : '30 days' },
                          { value: '90d', label: locale === 'fa' ? '۹۰ روز' : '90 days' },
                          { value: 'forever', label: locale === 'fa' ? 'دائمی' : 'Forever' },
                        ]}
                      />
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'امنیت و اشتراک‌گذاری' : 'Security & Privacy'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="share-links-select">
                      {locale === 'fa' ? 'اشتراک پیوند عمومی آثار' : 'Public link sharing'}
                    </label>
                    <div className="row-control">
                      <LemmoSelect
                        id="share-links-select"
                        value={allowPublicLinks}
                        onChange={(val) => {
                          setAllowPublicLinks(val);
                          showToast(locale === 'fa' ? 'تنظیمات ذخیره شد' : 'Sharing updated');
                        }}
                        options={[
                          { value: 'team-only', label: locale === 'fa' ? 'فقط اعضای تیم' : 'Team members only' },
                          { value: 'anyone', label: locale === 'fa' ? 'مجاز با داشتن پیوند' : 'Anyone with link' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'حفظ حریم خصوصی مدل‌ها' : 'Model Training Opt-out'}
                      <span className="row-hint">
                        {locale === 'fa'
                          ? 'آثار و پرامپت‌های فضای کاری شما هرگز برای آموزش مدل‌های عمومی استفاده نمی‌شوند.'
                          : 'Your creations and prompts are never used to train foundational AI models.'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <span className="status-badge-verified">
                        <Lock01 size={12} strokeWidth={2} />
                        <span>{locale === 'fa' ? 'محرمانه مطلق' : 'Strictly Private'}</span>
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 8. BILLING PANEL                                          */}
          {/* ========================================================= */}
          {activePanel === 'billing' && (
            <section className="settings-page-content" aria-labelledby="billing-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="billing-heading">{locale === 'fa' ? 'صورت‌حساب و اشتراک' : 'Billing'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'مدیریت پلن اشتراک فعال، روش‌های پرداخت و دانلود فاکتورها.'
                      : 'Manage active subscription tier, payment methods, and invoices.'}
                  </p>
                </header>

                <section className="settings-section">
                  <h2 className="section-title">{locale === 'fa' ? 'پلن اشتراک فعال' : 'Current Plan'}</h2>

                  <div className="settings-row">
                    <div className="row-label">
                      Studio Pro
                      <span className="row-hint">
                        {locale === 'fa'
                          ? '$۲۹ در ماه — تمدید بعدی در ۲۸ مهر ۱۴۰۵'
                          : '$29 / month — Renews on Oct 19, 2026'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe btn-primary"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? 'فرم ارتقای پلن باز شد.' : 'Plan upgrade opened.')}
                      >
                        <span>{locale === 'fa' ? 'ارتقای پلن' : 'Upgrade Plan'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'کارت بانکی پیشفرض' : 'Payment Method'}
                      <span className="row-hint">Visa ending in 4242 (Exp 12/28)</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? 'پنجره ویرایش کارت باز شد.' : 'Payment update opened.')}
                      >
                        <span>{locale === 'fa' ? 'ویرایش کارت' : 'Update Card'}</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'فاکتورهای اخیر' : 'Recent Invoices'}
                  </h2>

                  <div className="settings-row">
                    <div className="row-label">
                      Invoice #INV-2026-09 ($29.00)
                      <span className="row-hint">Sep 19, 2026 — Paid</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe btn-ghost"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? 'فاکتور دانلود شد.' : 'Invoice downloaded.')}
                      >
                        <Download01 size={14} strokeWidth={1.8} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      Invoice #INV-2026-08 ($29.00)
                      <span className="row-hint">Aug 19, 2026 — Paid</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe btn-ghost"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? 'فاکتور دانلود شد.' : 'Invoice downloaded.')}
                      >
                        <Download01 size={14} strokeWidth={1.8} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 9. COMPUTE PACKS PANEL                                    */}
          {/* ========================================================= */}
          {activePanel === 'compute-packs' && (
            <section className="settings-page-content" aria-labelledby="compute-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="compute-heading">
                    {locale === 'fa' ? 'بسته‌های پردازشی و شتاب‌دهنده' : 'Compute Packs'}
                  </h1>
                  <p>
                    {locale === 'fa'
                      ? 'تخصیص خوشه‌های GPU اختصاصی، سرعت رندر و بسته‌های اعتباری.'
                      : 'GPU acceleration clusters, fast rendering pipelines, and credit packs.'}
                  </p>
                </header>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'خوشه پردازشی GPU' : 'Active GPU Cluster'}
                  </h2>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'سطح شتاب‌دهنده سخت‌افزاری' : 'Inference Tier'}
                      <span className="row-hint">NVIDIA H100 Tensor Core Cluster</span>
                    </div>
                    <div className="row-control control-end">
                      <span className="status-badge-verified">
                        <span>Ultra Turbo</span>
                      </span>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      {locale === 'fa' ? 'رندرینگ آنی ۲.۵ ثانیه‌ای' : 'Turbo Low-Latency Rendering'}
                      <span className="row-hint">
                        {locale === 'fa' ? 'کاهش زمان انتظار برای تولیدات پشت‌سرهم' : 'Optimized pipeline for instant iterations'}
                      </span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe"
                        type="button"
                        onClick={() => {
                          setGpuTurboMode(!gpuTurboMode);
                          showToast(locale === 'fa' ? 'وضعیت توربو تغییر یافت.' : 'Turbo mode toggled.');
                        }}
                      >
                        <span>{gpuTurboMode ? (locale === 'fa' ? 'روشن' : 'Enabled') : (locale === 'fa' ? 'خاموش' : 'Disabled')}</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'خرید بسته‌های اعتباری اضافه' : 'Add-on Credit Packs'}
                  </h2>

                  <div className="settings-row">
                    <div className="row-label">
                      Fast Render Pack (+5,000 Credits)
                      <span className="row-hint">$15.00 — One-time purchase</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe btn-primary"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? '۵,۰۰۰ اعتبار افزوده شد.' : '5,000 credits added.')}
                      >
                        <span>{locale === 'fa' ? 'خرید بسته' : 'Purchase'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="row-label">
                      Studio Pro Pack (+20,000 Credits)
                      <span className="row-hint">$50.00 (15% Savings)</span>
                    </div>
                    <div className="row-control control-end">
                      <button
                        className="btn-wireframe btn-primary"
                        type="button"
                        onClick={() => showToast(locale === 'fa' ? '۲۰,۰۰۰ اعتبار افزوده شد.' : '20,000 credits added.')}
                      >
                        <span>{locale === 'fa' ? 'خرید بسته' : 'Purchase'}</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 10. API TOKENS PANEL                                      */}
          {/* ========================================================= */}
          {activePanel === 'api-tokens' && (
            <section className="settings-page-content" aria-labelledby="api-heading">
              <div className="page-shell">
                <header className="page-head">
                  <h1 id="api-heading">{locale === 'fa' ? 'توکن‌های API و وب‌هوک‌ها' : 'API Tokens'}</h1>
                  <p>
                    {locale === 'fa'
                      ? 'ساخت کلیدهای امن ارتباطی برای اسکریپت‌ها، بات‌ها و وب‌هوک‌ها.'
                      : 'Generate secure API keys for programmatic access, Python SDKs, and webhooks.'}
                  </p>
                </header>

                {/* Generate Key Section */}
                <form onSubmit={handleGenerateToken} className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'ساخت کلید ارتباطی جدید' : 'Generate New Token'}
                  </h2>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="new-tok-name">
                      {locale === 'fa' ? 'نام یا شناسه کلید' : 'Token name'}
                    </label>
                    <div className="row-control">
                      <input
                        className="field-input"
                        id="new-tok-name"
                        type="text"
                        placeholder="e.g. Production Pipeline"
                        value={newTokenName}
                        onChange={(e) => setNewTokenName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="settings-row">
                    <label className="row-label" htmlFor="new-tok-scope">
                      {locale === 'fa' ? 'سطح دسترسی (Scope)' : 'Token Scope'}
                    </label>
                    <div className="row-control">
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
                    </div>
                  </div>

                  <div className="page-actions-bar">
                    <button className="btn-wireframe btn-primary" type="submit">
                      <Plus01 size={14} strokeWidth={2} />
                      <span>{locale === 'fa' ? 'تولید کلید' : 'Generate Key'}</span>
                    </button>
                  </div>
                </form>

                {/* Active Tokens List */}
                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'کلیدهای فعال' : 'Active API Keys'}
                  </h2>

                  {tokensList.map((tok) => (
                    <div key={tok.id} className="settings-row">
                      <div className="row-label">
                        <span className="token-headline-name">{tok.name}</span>
                        <code className="token-code-tag">{tok.prefix}</code>
                      </div>

                      <div className="row-control control-end member-action-cells">
                        <span className="role-badge-tag editor">
                          <span>{tok.scope}</span>
                        </span>

                        <button
                          className="btn-wireframe btn-ghost"
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tok.prefix);
                            showToast(locale === 'fa' ? 'شناسه کلید کپی شد.' : 'Key copied.');
                          }}
                        >
                          <Copy01 size={14} strokeWidth={1.8} />
                        </button>

                        <button
                          className="btn-wireframe btn-ghost"
                          type="button"
                          onClick={() => handleRevokeToken(tok.id)}
                        >
                          <Trash01 size={14} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Quick cURL Integration Snippet */}
                <section className="settings-section">
                  <h2 className="section-title">
                    {locale === 'fa' ? 'نمونه فراخوانی سریع با cURL' : 'cURL Quick Integration'}
                  </h2>

                  <div className="settings-row row-stack">
                    <div className="label-counter-line">
                      <span className="row-label">POST /v1/models/generate</span>
                      <button
                        className="btn-link-action"
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            'curl -X POST https://api.lemmo.space/v1/models/generate \\\n  -H "Authorization: Bearer YOUR_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"prompt": "A cyber futuristic scene", "steps": 30}\''
                          );
                          showToast(locale === 'fa' ? 'نمونه کد کپی شد.' : 'cURL copied.');
                        }}
                      >
                        <Copy01 size={12} strokeWidth={2} />
                        <span>{locale === 'fa' ? 'کپی نمونه' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="curl-code-snippet" dir="ltr">
                      <code>{`curl -X POST https://api.lemmo.space/v1/models/generate \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A cyber futuristic scene", "steps": 30}'`}</code>
                    </pre>
                  </div>
                </section>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Floating Minimal Toast */}
      <div
        className={`floating-toast ${toastMessage ? 'visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>

      {/* ========================================================= */}
      {/* LEMMO DESIGN SYSTEM CSS RULES                             */}
      {/* ========================================================= */}
      <style jsx global>{`
        /* Outer Shell Container */
        .lemmo-settings-shell-container {
          width: 100%;
          height: 100dvh;
          padding: 16px;
          box-sizing: border-box;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: var(--lemmo-font-sans, ui-sans-serif, system-ui, sans-serif);
          font-size: 0.875rem;
          line-height: 1.4;
          -webkit-font-smoothing: antialiased;
        }

        .settings-loading-skeleton {
          width: 100%;
          height: 100dvh;
          background: var(--lemmo-page-background, #131517);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        /* 2-Column Shell */
        .lemmo-settings-shell {
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          height: 100%;
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-card, 14px);
          overflow: hidden;
          background: var(--lemmo-page-background, #131517);
        }

        /* Sidebar Navigation */
        .settings-sidebar {
          padding: 14px 10px 24px;
          overflow-y: auto;
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          border-inline-end: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.06));
        }

        .sidebar-close-btn {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          margin: 2px 0 20px;
          margin-inline-start: 6px;
          padding: 0;
          border: 0;
          border-radius: var(--lemmo-radius-200, 8px);
          background: transparent;
          color: var(--lemmo-text-secondary, #a1a1a5);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .sidebar-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .nav-group + .nav-group {
          margin-top: 24px;
        }

        .group-heading {
          margin: 0;
          padding: 0 10px 8px;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 32px;
          margin: 0 0 2px;
          padding: 0 10px;
          border: 0;
          border-radius: var(--lemmo-radius-200, 8px);
          background: transparent;
          color: var(--lemmo-text-secondary, #a1a1a5);
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          text-align: start;
          cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .nav-item.active {
          background: rgba(209, 254, 23, 0.1);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: 600;
        }

        .nav-item-icon {
          flex: none;
          display: grid;
          place-items: center;
          opacity: 0.85;
        }

        .nav-item.active .nav-item-icon {
          opacity: 1;
        }

        /* Main Viewport */
        .settings-main-viewport {
          min-width: 0;
          overflow-y: auto;
          background: var(--lemmo-page-background, #131517);
        }

        /* Page Layout (.page from wireframe) */
        .settings-page-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .page-shell {
          width: min(700px, 100%);
          margin-inline: auto;
          padding: 48px 32px 88px;
          box-sizing: border-box;
        }

        .page-head h1 {
          margin: 0;
          font-family: var(--lemmo-font-heading, inherit);
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #ffffff;
        }

        .page-head p {
          margin: 6px 0 0;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        /* Section Layout */
        .settings-section {
          margin-top: 40px;
        }

        .section-title {
          margin: 0;
          padding-bottom: 12px;
          border-block-end: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.12));
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Row Layout (.row from wireframe) */
        .settings-row {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          align-items: center;
          gap: 8px 24px;
          padding: 18px 0;
          border-block-end: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
        }

        .settings-row.row-stack {
          grid-template-columns: minmax(0, 1fr);
          gap: 8px;
        }

        .settings-row.row-verify-container {
          row-gap: 0;
        }

        .row-label {
          font-weight: 500;
          font-size: 0.8125rem;
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .required-star {
          margin-inline-start: 2px;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .row-hint {
          display: block;
          margin-top: 2px;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.45;
        }

        .label-counter-line {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        .char-counter {
          color: var(--lemmo-text-muted, #7c7e80);
          font-size: 0.75rem;
        }

        .row-control {
          justify-self: end;
          width: 100%;
          max-width: 340px;
          min-width: 0;
        }

        .row-control.control-end {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        /* Form Input Fields (.field) */
        .field-input {
          display: block;
          width: 100%;
          height: 38px;
          padding: 0 12px;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.8125rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .field-input::placeholder {
          color: var(--lemmo-text-faint, #606266);
        }

        .field-input:focus {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px rgba(209, 254, 23, 0.15);
        }

        .field-textarea {
          height: auto;
          min-height: 110px;
          padding: 10px 12px;
          line-height: 1.5;
          resize: vertical;
        }

        /* Lemmo Custom Design System Select */
        .lemmo-select-container {
          position: relative;
          width: 100%;
          font-family: inherit;
        }

        .lemmo-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 38px;
          padding: 0 12px;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.8125rem;
          box-sizing: border-box;
          cursor: pointer;
          text-align: start;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .lemmo-select-trigger:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .lemmo-select-trigger:focus,
        .lemmo-select-trigger.open {
          outline: none;
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px rgba(209, 254, 23, 0.15);
        }

        .selected-label-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .select-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-text-muted, #7c7e80);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          margin-inline-start: 8px;
        }

        .select-chevron.rotated {
          transform: rotate(180deg);
        }

        .lemmo-select-menu {
          position: absolute;
          top: calc(100% + 4px);
          inset-inline-start: 0;
          width: 100%;
          min-width: 180px;
          background: var(--lemmo-surface-primary-background, #111315);
          border: 1px solid var(--lemmo-border-subtle, #282b30);
          border-radius: 10px;
          padding: 4px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.4);
          z-index: 60;
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: selectMenuIn 0.12s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes selectMenuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lemmo-select-menu.open-upwards {
          top: auto;
          bottom: calc(100% + 4px);
          animation: selectMenuInUp 0.12s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes selectMenuInUp {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lemmo-select-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 10px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
          text-align: start;
          transition: background 0.12s ease, color 0.12s ease;
        }

        .lemmo-select-option:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .lemmo-select-option.selected {
          background: rgba(209, 254, 23, 0.08);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: 500;
        }

        .option-check-icon {
          color: var(--lemmo-surface-brand-background, #d1fe17);
          flex-shrink: 0;
          margin-inline-start: 8px;
        }

        .input-affix-wrapper {
          position: relative;
        }

        .input-affix {
          position: absolute;
          inset-inline-start: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--lemmo-text-muted, #898a8b);
          font-weight: 500;
          pointer-events: none;
        }

        .input-affix ~ .field-input {
          padding-inline-start: 30px;
        }

        /* Buttons (.btn from wireframe) */
        .btn-wireframe {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          padding: 0 13px;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-200, 8px);
          background: rgba(255, 255, 255, 0.04);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
        }

        .btn-wireframe:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .btn-wireframe:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .btn-wireframe.btn-ghost {
          border-color: transparent;
          background: transparent;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .btn-wireframe.btn-ghost:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .btn-wireframe.btn-primary {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: #131517;
          border-color: transparent;
          font-weight: 700;
        }

        .btn-wireframe.btn-primary:hover:not(:disabled) {
          background: #c4ee0b;
        }

        .btn-wireframe.btn-danger {
          color: var(--lemmo-text-danger, #ff5462);
          border-color: rgba(255, 84, 98, 0.25);
        }

        .btn-wireframe.btn-danger:hover {
          background: rgba(255, 84, 98, 0.1);
        }

        .btn-wireframe.btn-danger.armed {
          background: var(--lemmo-text-danger, #ff5462);
          color: #1a0606;
          border-color: transparent;
        }

        .btn-link-action {
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--lemmo-text-muted, #898a8b);
          font-family: inherit;
          font-size: 0.75rem;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-link-action:hover:not(:disabled) {
          color: #ffffff;
        }

        .page-actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 28px;
        }

        /* Avatar Section */
        .avatar-control-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .btn-actions-inline {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .avatar-frame {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.14));
          background: var(--lemmo-surface-secondary-background, #1e2124);
          display: grid;
          place-items: center;
          overflow: hidden;
          font-weight: 700;
          font-size: 1rem;
          color: #ffffff;
          flex-shrink: 0;
        }

        .avatar-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Verified Badge */
        .status-badge-verified {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-text-success, #4ee466);
          background: rgba(78, 228, 102, 0.1);
          padding: 3px 8px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          white-space: nowrap;
        }

        /* Verified Check Circle inside Email Input */
        .input-affix-wrapper.is-verified .field-input {
          padding-inline-end: 38px;
        }

        .verified-check-circle {
          position: absolute;
          inset-inline-end: 11px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-status-success-foreground, #4ee466);
          color: #061909;
          box-shadow: 0 0 10px rgba(78, 228, 102, 0.4);
          pointer-events: none;
          animation: checkCirclePop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes checkCirclePop {
          0% {
            transform: translateY(-50%) scale(0.4);
            opacity: 0;
          }
          100% {
            transform: translateY(-50%) scale(1);
            opacity: 1;
          }
        }

        /* Email Verification Collapsible (.verify-card) */
        .email-verify-collapse {
          grid-column: 1 / -1;
          margin-top: 14px;
        }

        .verify-card-box {
          display: grid;
          grid-template-columns: 16px minmax(0, 1fr) auto;
          grid-template-areas:
            "icon text otp"
            ".    link action";
          align-items: center;
          gap: 18px 14px;
          padding: 16px;
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-300, 14px);
          background: #070707;
        }

        .verify-icon {
          grid-area: icon;
          align-self: start;
          margin-top: 3px;
          color: var(--lemmo-text-muted, #898a8b);
          flex-shrink: 0;
        }

        .verify-text {
          grid-area: text;
          min-width: 0;
        }

        .verify-card-title {
          margin: 0;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #ffffff;
        }

        .verify-card-desc {
          margin: 3px 0 0;
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .verify-card-desc strong {
          color: #ffffff;
          font-weight: 500;
          overflow-wrap: anywhere;
        }

        .verify-card-desc.verify-err-msg {
          color: var(--lemmo-text-danger, #ff5462);
        }

        .otp-boxes-group {
          grid-area: otp;
          justify-self: end;
          display: flex;
          overflow: hidden;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-200, 10px);
          background: #000000;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .otp-boxes-group:focus-within {
          border-color: #5c5c5c;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.07);
        }

        .otp-boxes-group.invalid {
          border-color: rgba(255, 84, 98, 0.65);
          animation: otpNudge 0.3s ease;
        }

        .otp-digit-box {
          width: 34px;
          height: 40px;
          padding: 0;
          border: 0;
          border-inline-start: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          background: transparent;
          color: #ffffff;
          caret-color: #ffffff;
          text-align: center;
          font-size: 0.9375rem;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          outline: none;
          transition: background 0.15s ease;
        }

        .otp-digit-box:first-child {
          border-inline-start: 0;
        }

        .otp-digit-box::placeholder {
          color: #3a3a3a;
          opacity: 1;
        }

        .otp-digit-box:focus,
        .otp-digit-box:focus-visible {
          outline: 0;
          background: #171717;
        }

        .otp-digit-box:focus::placeholder,
        .otp-digit-box:focus-visible::placeholder {
          color: transparent !important;
          opacity: 0 !important;
        }

        .verify-link {
          grid-area: link;
          justify-self: start;
        }

        .verify-action {
          grid-area: action;
          justify-self: end;
        }

        @keyframes otpNudge {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        /* Promo Code View (.promo-panel) */
        .promo-panel-centered {
          display: grid;
          place-items: center;
          min-height: 100%;
          padding: 40px 32px 80px;
          box-sizing: border-box;
        }

        .promo-container {
          display: grid;
          justify-items: center;
          gap: 20px;
          width: min(640px, 100%);
        }

        .promo-code-input {
          width: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #ffffff;
          caret-color: #ffffff;
          text-align: center;
          text-transform: uppercase;
          font-family: var(--lemmo-font-heading, monospace);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .promo-code-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
          opacity: 1;
        }

        .btn-claim-voucher {
          min-width: 96px;
          height: 40px;
          padding: 0 20px;
          border: 0;
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: #131517;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease;
        }

        .promo-container:not(.has-value) .btn-claim-voucher {
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.94);
          filter: blur(6px);
          pointer-events: none;
        }

        .promo-feedback-status {
          min-height: 20px;
          margin: 0;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.8125rem;
          text-align: center;
        }

        .promo-feedback-status[data-tone='error'] {
          color: var(--lemmo-text-danger, #ff5462);
        }

        .promo-feedback-status[data-tone='success'] {
          color: var(--lemmo-text-success, #4ee466);
        }

        /* Theme Badges & Swatches */
        .theme-name-headline {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-color-swatches {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .swatch-circle {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Quota Meter */
        .quota-meter-pill {
          width: 140px;
          height: 22px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        .quota-meter-fill {
          position: absolute;
          inset-block: 0;
          inset-inline-start: 0;
          background: rgba(209, 254, 23, 0.2);
          border-inline-end: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
        }

        .quota-meter-txt {
          position: relative;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #ffffff;
        }

        .static-data-badge {
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        /* Member Row Specifics */
        .member-row-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .member-avatar-disc {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: grid;
          place-items: center;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #ffffff;
          flex-shrink: 0;
        }

        .member-full-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #ffffff;
        }

        .member-action-cells {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .role-badge-tag {
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.06);
          color: var(--lemmo-text-secondary, #b5b6b8);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .role-badge-tag.owner {
          background: rgba(209, 254, 23, 0.12);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .role-badge-tag.admin {
          background: rgba(90, 160, 255, 0.12);
          color: #7db7ff;
        }

        /* Token Row Specifics */
        .token-headline-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #ffffff;
          display: block;
        }

        .token-code-tag {
          font-family: var(--lemmo-font-mono, monospace);
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
          margin-top: 2px;
          display: inline-block;
        }

        .curl-code-snippet {
          margin: 0;
          padding: 10px 12px;
          background: #070809;
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-200, 8px);
          font-family: var(--lemmo-font-mono, monospace);
          font-size: 0.6875rem;
          color: #cfd3d8;
          line-height: 1.5;
          overflow-x: auto;
          text-align: left;
        }

        /* Floating Toast */
        .floating-toast {
          position: fixed;
          inset-block-end: 24px;
          inset-inline: 0;
          z-index: 1000;
          width: max-content;
          max-width: calc(100% - 32px);
          margin-inline: auto;
          padding: 9px 16px;
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-300, 10px);
          background: #111315;
          color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 500;
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
        }

        .floating-toast.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile Breakpoint */
        @media (max-width: 760px) {
          .lemmo-settings-shell-container {
            padding: 0;
          }

          .lemmo-settings-shell {
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(0, 1fr);
            border: 0;
            border-radius: 0;
          }

          .settings-sidebar {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 10px;
            overflow-x: auto;
            overflow-y: hidden;
            border-block-end: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
            scrollbar-width: none;
          }

          .settings-sidebar::-webkit-scrollbar {
            display: none;
          }

          .sidebar-close-btn {
            flex: none;
            margin: 0;
          }

          .settings-sidebar nav {
            display: flex;
            gap: 6px;
          }

          .nav-group {
            display: flex;
            gap: 2px;
          }

          .nav-group + .nav-group {
            margin-top: 0;
          }

          .group-heading {
            display: none;
          }

          .nav-item {
            flex: none;
            width: auto;
            margin: 0;
            white-space: nowrap;
          }

          .page-shell {
            padding: 28px 18px 72px;
          }

          .settings-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 8px;
          }

          .row-control {
            justify-self: stretch;
            max-width: none;
          }

          .row-control.control-end {
            justify-content: flex-start;
          }

          .verify-card-box {
            grid-template-columns: 16px minmax(0, 1fr);
            grid-template-areas:
              "icon text"
              "otp  otp"
              "link action";
            gap: 14px 10px;
          }

          .otp-boxes-group {
            width: 100%;
            justify-self: stretch;
          }

          .otp-digit-box {
            flex: 1;
            width: auto;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
