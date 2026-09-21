/**
 * Canvas Starter Templates Component — /app/canvas
 * Mature, compact quick-start templates section.
 *
 * Core Principles:
 * - Clear, recognizable thumbnail images (64x52px) to introduce each template visually.
 * - Standard 4/8px spacing ladder and concentric border radius.
 * - Zero hover scale/zoom: mature subtle highlight and border transition.
 * - 1-click execution to initialize the workspace.
 */

'use client';

import React from 'react';
import { Sparks, ArrowUpRight, X01 } from 'synthline/react';
import { CanvasStarterTemplate } from '../types';

interface CanvasStarterTemplatesProps {
  templates: CanvasStarterTemplate[];
  onSelectTemplate: (template: CanvasStarterTemplate) => void;
  onDismiss?: () => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasStarterTemplates({
  templates,
  onSelectTemplate,
  onDismiss,
  locale,
  isRtl,
}: CanvasStarterTemplatesProps) {
  const isFa = locale === 'fa';

  return (
    <section
      className="canvas-starters-section"
      aria-label={isFa ? 'الگوهای پیشنهادی شروع سریع' : 'Quick Start Templates'}
    >
      {/* Section Header */}
      <div className="canvas-starters-header">
        <div className="starters-header-left">
          <div className="starters-header-icon-badge" aria-hidden="true">
            <Sparks size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
          </div>
          <div className="starters-header-text">
            <h2 className="starters-section-title">
              {isFa ? 'قالب‌های پیشنهادی شروع سریع' : 'Quick Start Templates'}
            </h2>
            <span className="starters-section-sub">
              {isFa ? 'برای آشنایی سریع با اتصال نودها و جریان‌های کاری' : 'Pre-configured workflows to get started'}
            </span>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            className="starters-header-dismiss-btn"
            onClick={onDismiss}
            title={isFa ? 'پنهان‌سازی الگوهای پیشنهادی' : 'Hide starter templates'}
            aria-label="Hide starter templates"
          >
            <X01 size={15} strokeWidth={2} color="currentColor" />
          </button>
        )}
      </div>

      {/* Responsive Grid of Compact Starter Cards */}
      <div className="canvas-starters-grid">
        {templates.map((tpl) => {
          const title = isFa ? tpl.titleFa : tpl.title;
          const tag = isFa ? tpl.tagFa : tpl.tag;

          return (
            <div
              key={tpl.id}
              className="starter-card-tile"
              onClick={() => onSelectTemplate(tpl)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTemplate(tpl);
                }
              }}
              title={isFa ? `شروع کار با قالب «${title}»` : `Start with ${title}`}
            >
              {/* Clear, Recognizable Artwork Thumbnail */}
              <div className="starter-tile-thumb-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.thumbnail}
                  alt=""
                  className="starter-tile-thumb"
                  loading="lazy"
                />
              </div>

              {/* Template Information */}
              <div className="starter-tile-info">
                <span className="starter-tile-title">{title}</span>
                <span className="starter-tile-tag">{tag}</span>
              </div>

              {/* 1-Click Launch Action Icon */}
              <div className="starter-tile-action" aria-hidden="true">
                <ArrowUpRight size={14} strokeWidth={2.4} color="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
