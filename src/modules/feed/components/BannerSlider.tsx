/**
 * BannerSlider Component — Minimalist Feature & Announcement Hero
 *
 * Designed per user specifications:
 * - Dynamic platform announcements (new models, infinite canvas, AI copilot).
 * - Ultra-minimal, modern & sleek aesthetic with focus on copy/message.
 * - Ambient cinematic visual background without distraction.
 * - Chic segmented slider indicator at the end side showing slide progress.
 * - Icon emblem representing feature type/premium status (Crown/Award, CPU, Stars).
 * - Headline, concise description, primary action CTA, and tutorial/details button-link.
 * - Mobile experience: Action buttons completely removed for total cleanliness;
 *   smooth touch swipe gesture navigation to switch slides.
 *
 * 100% token-driven with @lemmo-lab/tokens.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Award01,
  AiCpu,
  Stars01,
  ArrowRight,
  ArrowLeft,
  Play,
  Book02,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { FEATURE_ANNOUNCEMENTS, FeatureAnnouncement } from '@/shared/data/feedData';
import DialPagination from './DialPagination';

export default function BannerSlider() {
  const { locale, dir } = useUiStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const isRtl = dir === 'rtl';

  const slidesCount = FEATURE_ANNOUNCEMENTS.length;
  const currentSlide: FeatureAnnouncement = FEATURE_ANNOUNCEMENTS[currentIndex];

  // Auto-play timer (paused on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesCount);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, slidesCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesCount);
  };

  // Touch swipe navigation for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        isRtl ? handlePrev() : handleNext();
      } else {
        // Swiped right
        isRtl ? handleNext() : handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Icon selector based on announcement type
  const renderTypeIcon = (type: FeatureAnnouncement['type']) => {
    switch (type) {
      case 'premium':
        return <Award01 size={14} strokeWidth={2} color="currentColor" />;
      case 'model':
        return <AiCpu size={14} strokeWidth={2} color="currentColor" />;
      case 'workspace':
        return <Stars01 size={14} strokeWidth={2} color="currentColor" />;
      default:
        return <Stars01 size={14} strokeWidth={2} color="currentColor" />;
    }
  };

  return (
    <section
      className="feature-hero-wrapper"
      aria-roledescription="carousel"
      aria-label={locale === 'fa' ? 'اطلاعیه‌ها و ویژگی‌های جدید' : 'New Platform Features'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-banner-card">
        {/* Ambient Subtle Background Artwork (Focused on End Side with Smooth Fade) */}
        <div className="ambient-backdrop" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt=""
            className="ambient-img"
            loading="eager"
          />
          <div className="ambient-gradient-fade" />
        </div>

        {/* Banner Inner Content */}
        <div className="banner-inner-content">
          {/* Top Bar: Feature Type Badge on Start */}
          <div className="banner-top-bar">
            <div className="feature-badge">
              <span className="badge-icon">{renderTypeIcon(currentSlide.type)}</span>
              <span className="badge-tag">
                {locale === 'fa' ? currentSlide.tagFa : currentSlide.tag}
              </span>
            </div>
          </div>

          {/* Dial Pagination: Positioned at End Side, Vertically Centered */}
          <div className="banner-dial-container" aria-label="Slide Pagination">
            <DialPagination
              total={slidesCount}
              current={currentIndex}
              onChange={(idx) => setCurrentIndex(idx)}
              dir={dir as 'ltr' | 'rtl'}
            />
          </div>

          {/* Bottom Content Area: Title, Description & Action that emerges from bottom pushing content up */}
          <div className="banner-bottom-wrap">
            <div className="banner-body">
              <h2 className="feature-title">
                {locale === 'fa' ? currentSlide.titleFa : currentSlide.title}
              </h2>
              <p className="feature-desc">
                {locale === 'fa' ? currentSlide.descriptionFa : currentSlide.description}
              </p>
            </div>

            {/* Action Row: Emerges from bottom on card hover, pushing title/desc up */}
            <div className="banner-actions-row">
              <Link
                href={currentSlide.primaryActionHref}
                className="btn-primary-action"
                title={locale === 'fa' ? currentSlide.primaryActionLabelFa : currentSlide.primaryActionLabel}
                data-action={`launch-feature-${currentSlide.id}`}
              >
                <span>{locale === 'fa' ? currentSlide.primaryActionLabelFa : currentSlide.primaryActionLabel}</span>
                <span className="action-arrow">
                  {isRtl ? (
                    <ArrowLeft size={14} strokeWidth={2.5} color="currentColor" />
                  ) : (
                    <ArrowRight size={14} strokeWidth={2.5} color="currentColor" />
                  )}
                </span>
              </Link>

              <Link
                href={currentSlide.secondaryActionHref}
                className="btn-tutorial-link"
                title={locale === 'fa' ? currentSlide.secondaryActionLabelFa : currentSlide.secondaryActionLabel}
                data-action="view-tutorial"
              >
                <span className="tutorial-icon">
                  {currentSlide.type === 'model' ? (
                    <Play size={12} strokeWidth={2.5} color="currentColor" />
                  ) : (
                    <Book02 size={13} strokeWidth={2} color="currentColor" />
                  )}
                </span>
                <span>{locale === 'fa' ? currentSlide.secondaryActionLabelFa : currentSlide.secondaryActionLabel}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .feature-hero-wrapper {
          width: 100%;
          margin-bottom: var(--lemmo-space-800, 32px);
          box-sizing: border-box;
          user-select: none;
        }

        .hero-banner-card {
          position: relative;
          min-height: 260px;
          border-radius: var(--lemmo-radius-2xl, 24px);
          background: var(--lemmo-surface-primary-background, #17191b);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .hero-banner-card:hover {
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.18));
        }

        /* Ambient Visual Backdrop (Clean & Undistracting) */
        .ambient-backdrop {
          position: absolute;
          inset-block: 0;
          inset-inline-end: 0;
          width: 52%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .ambient-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.44;
          filter: saturate(1.15) brightness(0.85);
          display: block;
        }

        .ambient-gradient-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            var(--lemmo-surface-primary-background, #17191b) 0%,
            rgba(23, 25, 27, 0.85) 30%,
            rgba(23, 25, 27, 0.25) 70%,
            transparent 100%
          );
        }

        :global([dir='rtl']) .ambient-gradient-fade {
          background: linear-gradient(
            to left,
            var(--lemmo-surface-primary-background, #17191b) 0%,
            rgba(23, 25, 27, 0.85) 30%,
            rgba(23, 25, 27, 0.25) 70%,
            transparent 100%
          );
        }

        /* Banner Inner Content */
        .banner-inner-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--lemmo-space-700, 28px) var(--lemmo-space-800, 32px);
          min-height: 260px;
          box-sizing: border-box;
        }

        /* Top Bar: Start & End */
        .banner-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--lemmo-space-400, 16px);
          gap: 12px;
        }

        .feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .badge-icon {
          display: flex;
          align-items: center;
          line-height: 1;
        }

        .badge-tag {
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Dial Pagination Container: Positioned at End Side, Vertically Centered (Transparent & Pure) */
        .banner-dial-container {
          position: absolute;
          inset-inline-end: var(--lemmo-space-700, 28px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          display: flex;
          align-items: center;
          background: transparent;
          border: none;
          padding: 0;
          box-shadow: none;
        }

        /* Bottom Content Area: Pinned at bottom, expands upward on hover */
        .banner-bottom-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          margin-top: auto;
          box-sizing: border-box;
          width: 100%;
        }

        /* Body Typography */
        .banner-body {
          max-width: min(640px, calc(100% - 200px));
          margin: 0;
        }

        .feature-title {
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-size: clamp(1.375rem, 2.4vw, 1.75rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .feature-desc {
          font-family: var(--lemmo-font-body, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          line-height: 1.55;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }

        /* Action Buttons Row: Emerges from below on card hover, pushing title/desc up */
        .banner-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          max-height: 0;
          opacity: 0;
          margin-top: 0;
          overflow: hidden;
          pointer-events: none;
          transform: translateY(12px);
          transition: max-height 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.24s ease,
                      margin-top 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-banner-card:hover .banner-actions-row,
        .hero-banner-card:focus-within .banner-actions-row {
          max-height: 48px;
          opacity: 1;
          margin-top: 18px;
          transform: translateY(0);
          pointer-events: auto;
        }

        :global(.btn-primary-action) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 18px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(209, 254, 23, 0.35);
          transition: filter 0.15s ease, box-shadow 0.15s ease;
        }

        :global(.btn-primary-action:hover) {
          filter: brightness(1.08);
          box-shadow: 0 0 16px rgba(209, 254, 23, 0.55);
        }

        .action-arrow {
          display: flex;
          align-items: center;
          line-height: 1;
        }

        :global(.btn-tutorial-link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }

        :global(.btn-tutorial-link:hover) {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        .tutorial-icon {
          display: flex;
          align-items: center;
          line-height: 1;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* ================= MOBILE EXPERIENCE ================= */
        @media (max-width: 640px) {
          /* Ultra-clean on mobile: actions removed per user instruction */
          .banner-actions-row {
            display: none !important;
          }

          .hero-banner-card {
            min-height: 155px;
          }

          .banner-inner-content {
            padding: var(--lemmo-space-400, 16px);
            min-height: 155px;
          }

          .ambient-backdrop {
            width: 70%;
            opacity: 0.32;
          }

          .banner-dial-container {
            inset-inline-end: 12px;
            padding: 0;
            background: transparent;
            border: none;
            box-shadow: none;
            transform: translateY(-50%);
          }

          .banner-body {
            max-width: calc(100% - 100px);
          }

          .feature-desc {
            margin-bottom: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </section>
  );
}
