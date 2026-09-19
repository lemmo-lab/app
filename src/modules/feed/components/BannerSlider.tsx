/**
 * BannerSlider Component — Featured Generative AI Showcase
 *
 * Implements an accessible, high-performance carousel showcasing flagship
 * AI-generated creations with prompt previews, model badges, and remix actions.
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Design System) & @lemmo-lab/tokens
 * - Concentric radii (outer 24px, inner 8px)
 * - WCAG 2.1 AA (4.5:1 contrast, keyboard navigable, aria-live)
 * - RTL/LTR logical positioning
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, AiMagicWand01, Sparks } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { BannerSlide, FEATURED_SLIDES } from '@/shared/data/feedData';

export default function BannerSlider() {
  const { locale, dir } = useUiStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isRtl = dir === 'rtl';

  const slidesCount = FEATURED_SLIDES.length;
  const currentSlide: BannerSlide = FEATURED_SLIDES[currentIndex];

  // Auto-play timer (paused on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesCount);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, slidesCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesCount);
  };

  return (
    <section
      className="banner-slider-wrapper"
      aria-roledescription="carousel"
      aria-label={locale === 'fa' ? 'آثار برگزیده هوش مصنوعی' : 'Featured AI Creations'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-card">
        {/* Background Image with Gradient Overlay */}
        <div className="image-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.image}
            alt={locale === 'fa' ? currentSlide.titleFa : currentSlide.title}
            className="slide-image"
          />
          <div className="gradient-overlay" />
        </div>

        {/* Slide Content Meta */}
        <div className="slide-content">
          {/* Top Badge & Model Pill */}
          <div className="badge-row">
            <div className="featured-pill">
              <Sparks size={14} strokeWidth={2} color="currentColor" />
              <span>{locale === 'fa' ? 'اثر برگزیده هفته' : 'FEATURED SHOWCASE'}</span>
            </div>
            <div className="model-chip">
              <span className="model-dot" />
              <span>{currentSlide.model}</span>
            </div>
          </div>

          {/* Title & Author */}
          <h2 className="slide-title">
            {locale === 'fa' ? currentSlide.titleFa : currentSlide.title}
          </h2>

          {/* Prompt Snippet Box */}
          <p className="slide-prompt" title={locale === 'fa' ? currentSlide.promptFa : currentSlide.prompt}>
            &ldquo;{locale === 'fa' ? currentSlide.promptFa : currentSlide.prompt}&rdquo;
          </p>

          {/* Actions & Slide Navigation Bar */}
          <div className="slide-footer">
            <div className="cta-actions">
              <Link
                href="/app/agent"
                className="btn-remix"
                title={locale === 'fa' ? 'ریمیکس و پرامپت در استودیو' : 'Remix in Studio'}
                data-action="remix-featured"
              >
                <AiMagicWand01 size={18} strokeWidth={2} color="currentColor" />
                <span>{locale === 'fa' ? 'ریمیکس و ساخت' : 'Remix Prompt'}</span>
              </Link>

              <Link
                href={`/app/feed/${currentSlide.id}`}
                className="btn-inspect"
                title={locale === 'fa' ? 'مشاهده جزییات رندر' : 'View Generation Details'}
                data-action="view-details"
              >
                <span>{locale === 'fa' ? 'مشاهده جزییات' : 'View Details'}</span>
              </Link>
            </div>

            {/* Slider Controls: Dots + Prev/Next Arrow Buttons */}
            <div className="slider-controls">
              {/* Slide Counter */}
              <div className="slide-counter" data-numeric>
                <span className="current-num">0{currentIndex + 1}</span>
                <span className="divider">/</span>
                <span className="total-num">0{slidesCount}</span>
              </div>

              {/* Dots */}
              <div className="dots-track" role="tablist" aria-label="Slide Dots">
                {FEATURED_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={currentIndex === idx}
                    aria-label={`Slide ${idx + 1}`}
                    className={`dot-pill ${currentIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="nav-arrows">
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={isRtl ? handleNext : handlePrev}
                  aria-label={locale === 'fa' ? 'اسلاید قبلی' : 'Previous slide'}
                  data-action="slider-prev"
                >
                  {isRtl ? (
                    <ChevronRight size={18} strokeWidth={2} color="currentColor" />
                  ) : (
                    <ChevronLeft size={18} strokeWidth={2} color="currentColor" />
                  )}
                </button>
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={isRtl ? handlePrev : handleNext}
                  aria-label={locale === 'fa' ? 'اسلاید بعدی' : 'Next slide'}
                  data-action="slider-next"
                >
                  {isRtl ? (
                    <ChevronLeft size={18} strokeWidth={2} color="currentColor" />
                  ) : (
                    <ChevronRight size={18} strokeWidth={2} color="currentColor" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .banner-slider-wrapper {
          width: 100%;
          position: relative;
          box-sizing: border-box;
          margin-bottom: var(--lemmo-space-800, 32px);
        }

        .slider-card {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: var(--lemmo-radius-featured-card, 20px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
        }

        .image-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slider-card:hover .slide-image {
          transform: scale(1.025);
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 12, 14, 0.96) 0%,
            rgba(10, 12, 14, 0.72) 42%,
            rgba(10, 12, 14, 0.2) 80%,
            rgba(10, 12, 14, 0.05) 100%
          );
        }

        /* Slide Content Meta Overlay */
        .slide-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: var(--lemmo-space-600, 24px) var(--lemmo-space-800, 32px);
          box-sizing: border-box;
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .badge-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-200, 8px);
          margin-bottom: var(--lemmo-space-250, 10px);
          flex-wrap: wrap;
        }

        .featured-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.6875rem;
          font-weight: var(--lemmo-font-weight-bold, 700);
          letter-spacing: 0.04em;
          box-shadow: 0 0 12px rgba(209, 254, 23, 0.4);
        }

        .model-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #a1a1a5);
        }

        .model-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .slide-title {
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-size: clamp(1.25rem, 2.5vw, 1.875rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 var(--lemmo-space-150, 6px) 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
          line-height: 1.25;
        }

        .slide-prompt {
          font-family: var(--lemmo-font-body, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.78);
          max-width: 780px;
          margin: 0 0 var(--lemmo-space-400, 16px) 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }

        /* Slide Footer: Action Buttons + Slider Navigation */
        .slide-footer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: var(--lemmo-space-400, 16px);
          flex-wrap: wrap;
        }

        .cta-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-250, 10px);
        }

        :global(.btn-remix) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 16px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-base, 8px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(209, 254, 23, 0.35);
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        :global(.btn-remix:hover) {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        :global(.btn-inspect) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 14px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          color: var(--lemmo-text-primary, #e1e1e3);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-base, 8px);
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        :global(.btn-inspect:hover) {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Controls */
        .slider-controls {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-300, 12px);
        }

        .slide-counter {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--lemmo-text-muted, #898a8b);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .current-num {
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .dots-track {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }

        .dot-pill {
          width: 8px;
          height: 8px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.25);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dot-pill.active {
          width: 22px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 8px rgba(209, 254, 23, 0.6);
        }

        .nav-arrows {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }

        .arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--lemmo-radius-base, 8px);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.1));
          color: var(--lemmo-text-primary, #e1e1e3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .arrow-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--lemmo-border-default, rgba(255, 255, 255, 0.25));
        }

        .arrow-btn:focus-visible {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* ================= RESPONSIVE SCALING ================= */
        @media (max-width: 900px) {
          .slider-card {
            height: 320px;
            border-radius: var(--lemmo-radius-media, 16px);
          }

          .slide-content {
            padding: var(--lemmo-space-400, 16px);
          }

          .slide-title {
            font-size: 1.1875rem;
          }

          .slide-prompt {
            font-size: 0.8125rem;
            -webkit-line-clamp: 2;
            margin-bottom: var(--lemmo-space-300, 12px);
          }

          .dots-track {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .slider-card {
            height: 270px;
          }

          .slide-prompt {
            display: none;
          }

          .slide-footer {
            gap: 8px;
          }

          :global(.btn-remix) {
            height: 34px;
            padding: 0 12px;
            font-size: 0.75rem;
          }

          :global(.btn-inspect) {
            height: 34px;
            padding: 0 10px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
