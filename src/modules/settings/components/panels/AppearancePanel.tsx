'use client';

import React, { useState } from 'react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoSelect from '../LemmoSelect';
import LemmoButton from '../LemmoButton';

export interface AppearancePanelProps {
  onShowToast: (msg: string) => void;
}

export default function AppearancePanel({ onShowToast }: AppearancePanelProps) {
  const { locale } = useUiStore();

  const [activeTheme, setActiveTheme] = useState('obsidian');
  const [canvasGrid, setCanvasGrid] = useState('dots');
  const [accentGlow, setAccentGlow] = useState('high');
  const [interfaceDensity, setInterfaceDensity] = useState('comfortable');

  const themes = [
    {
      id: 'obsidian',
      titleFa: 'نئون ابسیدین (پیش‌فرض)',
      titleEn: 'Neon Obsidian (Default)',
      descFa: 'امضای رسمی لیمو؛ زغالی عمیق با اکسنت‌های فسفری فوق مدرن.',
      descEn: 'Default Lemmo signature. Deep charcoal with electric lime accents.',
      dots: ['#d1fe17', '#1c1e20', '#131517'],
      active: true,
    },
    {
      id: 'cyber',
      titleFa: 'سایبر ماتریکس',
      titleEn: 'Cyber Matrix',
      descFa: 'پالت فیروزه‌ای نئونی و مشکی سایبری برای طراحان سه‌بعدی.',
      descEn: 'Cyberpunk teal and jet black for 3D & concept artists.',
      dots: ['#00f0ff', '#121a24', '#080d12'],
      active: false,
    },
    {
      id: 'solar',
      titleFa: 'سولار امبر',
      titleEn: 'Solar Amber',
      descFa: 'طیف‌های کهربایی، نور شامگاهی و طلایی سینمایی.',
      descEn: 'Warm sunset tones, cinematic gold, and deep bronze.',
      dots: ['#ff9900', '#251a14', '#150f0c'],
      active: false,
    },
    {
      id: 'nordic',
      titleFa: 'نوردیک استیل',
      titleEn: 'Nordic Steel',
      descFa: 'مینیمال با سایه‌های خاکستری سربی و آبی یخی.',
      descEn: 'Ultra-clean slate gray and glacial ice blue.',
      dots: ['#88b0d8', '#20242c', '#13161c'],
      active: false,
    },
  ];

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'ظاهر و تم‌ها' : 'Appearance'}
        description={
          locale === 'fa'
            ? 'سفارشی‌سازی ظاهر محیط کاربری و پالت‌های نوین استودیو لیمو.'
            : 'Customize studio color palettes, canvas aesthetics, and density.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'تم‌های استودیو لیمو' : 'Studio Color Themes'}>
        {themes.map((theme) => {
          const isSelected = activeTheme === theme.id;
          return (
            <div key={theme.id} className="theme-selection-card">
              <div className="theme-meta">
                <div className="theme-title-row">
                  <span className="theme-title">
                    {locale === 'fa' ? theme.titleFa : theme.titleEn}
                  </span>
                  <div className="theme-dots-row">
                    {theme.dots.map((color, i) => (
                      <span
                        key={i}
                        className="theme-dot"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="theme-description">
                  {locale === 'fa' ? theme.descFa : theme.descEn}
                </p>
              </div>

              <div className="theme-action">
                {theme.active ? (
                  <LemmoButton
                    type="button"
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setActiveTheme(theme.id);
                      onShowToast(locale === 'fa' ? 'تم با موفقیت انتخاب شد' : 'Theme activated');
                    }}
                  >
                    {isSelected
                      ? locale === 'fa'
                        ? 'فعال'
                        : 'Active'
                      : locale === 'fa'
                      ? 'انتخاب'
                      : 'Select'}
                  </LemmoButton>
                ) : (
                  <span className="badge-coming-soon">
                    {locale === 'fa' ? 'به‌زودی' : 'Coming soon'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'ترجیحات بصری بوم و درخشش' : 'Canvas & Visual Effects'}>
        <SettingsRow label={locale === 'fa' ? 'شبکه پس‌زمینه بوم' : 'Canvas background grid'}>
          <LemmoSelect
            id="canvas-grid-select"
            value={canvasGrid}
            onChange={(val) => {
              setCanvasGrid(val);
              onShowToast(locale === 'fa' ? 'تنظیم بوم ذخیره شد' : 'Canvas grid updated');
            }}
            options={[
              { value: 'dots', label: locale === 'fa' ? 'نقطه‌ای (Dots)' : 'Dotted grid' },
              { value: 'lines', label: locale === 'fa' ? 'شبکه‌ای (Lines)' : 'Square lines' },
              { value: 'clean', label: locale === 'fa' ? 'ساده و یکدست' : 'Clean solid' },
            ]}
          />
        </SettingsRow>

        <SettingsRow label={locale === 'fa' ? 'شدت درخشش نئونی' : 'Neon accent glow'}>
          <LemmoSelect
            id="accent-glow-select"
            value={accentGlow}
            onChange={(val) => {
              setAccentGlow(val);
              onShowToast(locale === 'fa' ? 'شدت درخشش ذخیره شد' : 'Glow intensity updated');
            }}
            options={[
              { value: 'high', label: locale === 'fa' ? 'حداکثر (High)' : 'Vibrant / High' },
              { value: 'medium', label: locale === 'fa' ? 'متعادل (Medium)' : 'Balanced / Medium' },
              { value: 'subtle', label: locale === 'fa' ? 'ظریف (Subtle)' : 'Minimal / Subtle' },
            ]}
          />
        </SettingsRow>

        <SettingsRow label={locale === 'fa' ? 'تراکم رابط کاربری' : 'Interface density'}>
          <LemmoSelect
            id="density-select"
            value={interfaceDensity}
            onChange={(val) => {
              setInterfaceDensity(val);
              onShowToast(locale === 'fa' ? 'تراکم رابط کاربری ذخیره شد' : 'Density updated');
            }}
            options={[
              { value: 'comfortable', label: locale === 'fa' ? 'راحت و استاندارد' : 'Comfortable' },
              { value: 'compact', label: locale === 'fa' ? 'فشرده (Compact)' : 'Compact' },
            ]}
          />
        </SettingsRow>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .theme-selection-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-400, 16px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          gap: var(--lemmo-gap-4, 16px);
        }

        .theme-meta {
          flex: 1;
        }

        .theme-title-row {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2-5, 10px);
        }

        .theme-title {
          font-weight: var(--lemmo-font-weight-medium, 500);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .theme-dots-row {
          display: inline-flex;
          align-items: center;
          gap: var(--lemmo-space-100, 4px);
        }

        .theme-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--lemmo-radius-full, 9999px);
          display: inline-block;
        }

        .theme-description {
          margin: var(--lemmo-space-050, 2px) 0 0;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: var(--lemmo-type-size-050, 0.75rem);
        }

        .theme-action {
          flex-shrink: 0;
        }

        .badge-coming-soon {
          display: inline-block;
          padding: 3px 8px;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
          background: var(--lemmo-surface-secondary-background, #23262a);
          border-radius: var(--lemmo-radius-full, 9999px);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
        }
      `}</style>
    </div>
  );
}
