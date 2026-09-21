/**
 * Canvas Hero Banner Component — /app/canvas
 * Redesigned with atmospheric background image, rich gradient overlays,
 * concise title & copy, primary "Add Project" CTA, and intro video trigger.
 */

'use client';

import React from 'react';
import { Plus01, Play } from 'synthline/react';

interface CanvasHeroBannerProps {
  locale: string;
  isRtl: boolean;
  onAddProject: () => void;
  onWatchVideo?: () => void;
}

export function CanvasHeroBanner({
  locale,
  isRtl,
  onAddProject,
  onWatchVideo,
}: CanvasHeroBannerProps) {
  const isFa = locale === 'fa';

  return (
    <section className="canvas-hero-banner" aria-label={isFa ? 'معرفی بوم کار' : 'Canvas Overview'}>
      {/* Background Cinematic Image */}
      <div className="canvas-hero-bg-container" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/feed/an-ultra-wide-heavily-flared-cinematic-rendering-depicts-a.webp"
          alt=""
          className="canvas-hero-bg-image"
        />
        {/* Cinematic Gradient Overlays for High Contrast & Text Legibility */}
        <div className="canvas-hero-gradient-overlay" />
        <div className="canvas-hero-ambient-glow" />
      </div>

      {/* Hero Content Layer */}
      <div className="canvas-hero-content">
        {/* Subtle Status Pill Tag */}
        <div className="canvas-hero-tag">
          <span className="hero-tag-dot" aria-hidden="true" />
          <span className="hero-tag-text">
            {isFa ? 'محیط کار نامحدود و خلاق' : 'Infinite Creative Workspace'}
          </span>
        </div>

        {/* Title & Concise Description */}
        <div className="canvas-hero-headings">
          <h1 className="canvas-hero-title">
            {isFa ? 'بوم تعاملی هوش مصنوعی' : 'Interactive AI Canvas'}
          </h1>
          <p className="canvas-hero-description">
            {isFa
              ? 'فضای نامحدود برای اتصال بصری نودها، ترکیب لایه‌ها و اجرای زنجیره‌ای پایپ‌لاین‌های هوش مصنوعی.'
              : 'Unbounded workspace for visually connecting nodes, compositing layers, and running multi-stage AI workflows.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="canvas-hero-actions">
          {/* Flagship CTA Button */}
          <button
            type="button"
            className="canvas-hero-btn-primary"
            onClick={onAddProject}
            title={isFa ? 'افزودن پروژه بوم جدید' : 'Add New Canvas Project'}
          >
            <Plus01 size={18} strokeWidth={2.4} color="currentColor" />
            <span>{isFa ? 'افزودن پروژه' : 'Add Project'}</span>
          </button>

          {/* Intro Media Video Preview Button */}
          {onWatchVideo && (
            <button
              type="button"
              className="canvas-hero-btn-video"
              onClick={onWatchVideo}
              title={isFa ? 'مشاهده ویدیوی معرفی محیط بوم' : 'Watch Canvas Overview Video'}
            >
              <div className="video-btn-icon-wrap" aria-hidden="true">
                <Play size={13} strokeWidth={2.6} color="currentColor" />
              </div>
              <span>{isFa ? 'ویدیوی معرفی بوم' : 'Overview Video'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
