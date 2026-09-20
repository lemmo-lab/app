import React from 'react';
import Link from 'next/link';
import { Sparks, ChevronLeft, ChevronRight } from 'synthline/react';

interface ToolTutorialBannerProps {
  locale: string;
  isRtl: boolean;
}

export function ToolTutorialBanner({ locale, isRtl }: ToolTutorialBannerProps) {
  return (
    <div className="tutorial-banner-card">
      <div className="tutorial-badge">
        <Sparks
          size={13}
          strokeWidth={2.2}
          color="var(--lemmo-surface-brand-background, #d1fe17)"
        />
        <span>{locale === 'fa' ? 'پایپ‌لاین ابزارها' : 'Canvas Pipelines'}</span>
      </div>
      <h3 className="tutorial-title">
        {locale === 'fa'
          ? 'زنجیره‌سازی ابزارهای هوش مصنوعی بر بستر بوم'
          : 'Chain and run AI tools live on Canvas'}
      </h3>
      <p className="tutorial-desc">
        {locale === 'fa'
          ? 'ابزارها را روی هر لایه تصویر ترکیب کرده و با یک کلیک خروجی بگیرید.'
          : 'Combine vision, inpainting, and upscaling directly inside your node workspace.'}
      </p>
      <Link href="/app/canvas" className="tutorial-cta-link">
        <span>{locale === 'fa' ? 'ورود به محیط بوم' : 'Launch Canvas'}</span>
        {isRtl ? (
          <ChevronLeft size={13} strokeWidth={2.4} color="currentColor" />
        ) : (
          <ChevronRight size={13} strokeWidth={2.4} color="currentColor" />
        )}
      </Link>
    </div>
  );
}
