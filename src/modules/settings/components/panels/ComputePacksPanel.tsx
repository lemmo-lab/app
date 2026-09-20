'use client';

import React from 'react';
import { Server01, Flash, Image03, Film01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import LemmoButton from '../LemmoButton';

export interface ComputePacksPanelProps {
  onShowToast: (msg: string) => void;
}

export default function ComputePacksPanel({
  onShowToast,
}: ComputePacksPanelProps) {
  const { locale } = useUiStore();

  const packs = [
    {
      id: 'fast-infer',
      titleFa: 'بسته سرعت بالا (Turbo Inference)',
      titleEn: 'Turbo Inference Pack',
      descFa: 'اولویت صف پردازش روی پردازنده‌های H100 بدون وقفه.',
      descEn: 'Zero-wait priority queue on NVIDIA H100 clusters.',
      quota: '1,000 credits',
      price: '$12',
      icon: <Flash size={18} strokeWidth={1.5} />,
    },
    {
      id: 'upscale-4k',
      titleFa: 'بسته افزایش وضوح 4K Ultra',
      titleEn: 'Batch 4K Upscaler Pack',
      descFa: 'تبدیل تصاویر به رزولوشن 4K با حفظ کامل تکسچر و جزئیات.',
      descEn: 'Neural texture preservation upscaling up to 3840x2160.',
      quota: '250 upscales',
      price: '$18',
      icon: <Image03 size={18} strokeWidth={1.5} />,
    },
    {
      id: 'motion-video',
      titleFa: 'بسته تولید ویدیو کوتاه (Video Motion)',
      titleEn: 'Video Generation Pack',
      descFa: 'متحرک‌سازی فریم‌های ایستا با مدل‌های SVD و انیمیشن پیوسته.',
      descEn: 'Cinematic video synthesis from canvas prompts.',
      quota: '60 video clips',
      price: '$25',
      icon: <Film01 size={18} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'بسته‌های پردازشی' : 'Compute Packs'}
        description={
          locale === 'fa'
            ? 'خرید اعتبارهای مازاد پردازش هوش مصنوعی و شتاب‌دهنده‌های GPU برای پروژه‌های سنگین.'
            : 'Add-on GPU compute credits and high-throughput AI inference packs.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'بسته‌های در دسترس' : 'Available Add-ons'}>
        <div className="packs-grid">
          {packs.map((pack) => (
            <div key={pack.id} className="pack-card">
              <div className="pack-header">
                <div className="pack-icon-wrapper">{pack.icon}</div>
                <div className="pack-price-box">
                  <span className="pack-price">{pack.price}</span>
                </div>
              </div>

              <h3 className="pack-title">
                {locale === 'fa' ? pack.titleFa : pack.titleEn}
              </h3>
              <p className="pack-desc">
                {locale === 'fa' ? pack.descFa : pack.descEn}
              </p>

              <div className="pack-footer">
                <span className="pack-quota-tag">{pack.quota}</span>
                <LemmoButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    onShowToast(
                      locale === 'fa' ? 'بسته به سبد خرید اضافه شد' : 'Pack added to order'
                    )
                  }
                >
                  {locale === 'fa' ? 'خرید بسته' : 'Buy Pack'}
                </LemmoButton>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .packs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--lemmo-gap-3, 12px);
          margin-top: var(--lemmo-space-200, 8px);
        }

        .pack-card {
          padding: var(--lemmo-space-400, 16px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-card, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-gap-2, 8px);
        }

        .pack-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pack-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-200, 8px);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 10%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border: var(--lemmo-stroke-thin, 1px) solid color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 25%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pack-price {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-400, 1.125rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .pack-title {
          margin: var(--lemmo-space-100, 4px) 0 0;
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .pack-desc {
          margin: 0;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
          line-height: var(--lemmo-type-leading-600, 1.5);
          flex: 1;
        }

        .pack-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--lemmo-space-300, 12px);
          padding-top: var(--lemmo-space-200, 8px);
          border-top: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
        }

        .pack-quota-tag {
          font-family: var(--lemmo-font-mono, monospace);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }
      `}</style>
    </div>
  );
}
