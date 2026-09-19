/**
 * QuickToolsSection Component — Quick Tools & Features Carousel
 *
 * Provides instant access to flagship Lemmo AI tools (Background Remover,
 * Super Upscaler, SAM-2 Segmenter, Lighting Synthesizer).
 *
 * Responsive layout:
 * - Desktop: 4-column grid with smooth hover cards
 * - Mobile: Horizontal touch scroll-snap carousel with zero layout overflow
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { QUICK_TOOLS, QuickTool } from '@/shared/data/feedData';

export default function QuickToolsSection() {
  const { locale, dir } = useUiStore();
  const isRtl = dir === 'rtl';

  return (
    <section
      className="tools-section-wrapper"
      aria-label={locale === 'fa' ? 'ابزارها و قابلیت‌های سریع' : 'Quick Tools & AI Generators'}
    >
      {/* Section Header */}
      <div className="section-header">
        <div className="header-title-group">
          <h3 className="section-title">
            {locale === 'fa' ? 'ابزارها و قابلیت‌های سریع' : 'Quick Tools & Generators'}
          </h3>
          <span className="section-subtitle">
            {locale === 'fa' ? 'دسترسی فوری به ماژول‌های پردازش هوشمند' : 'Instant access to specialized AI creation engines'}
          </span>
        </div>

        <Link
          href="/app/tools"
          className="view-all-link"
          title={locale === 'fa' ? 'مشاهده همه ابزارها' : 'View all 24 AI tools'}
          data-action="view-all-tools"
        >
          <span>{locale === 'fa' ? 'همه ابزارها (۲۴)' : 'View all tools'}</span>
          {isRtl ? (
            <ChevronLeft size={16} strokeWidth={2} color="currentColor" />
          ) : (
            <ChevronRight size={16} strokeWidth={2} color="currentColor" />
          )}
        </Link>
      </div>

      {/* Tools Cards Grid / Mobile Scroll Track */}
      <div className="tools-grid">
        {QUICK_TOOLS.map((tool: QuickTool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="tool-card"
            title={locale === 'fa' ? tool.nameFa : tool.name}
            data-action={`launch-${tool.id}`}
          >
            {/* Full-bleed Card Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.image}
              alt={locale === 'fa' ? tool.nameFa : tool.name}
              className="tool-card-bg"
              loading="lazy"
            />

            {/* Gradient Scrim for Contrast & Legibility */}
            <div className="tool-card-scrim" />

            {/* Top Bar: Distinctive NEW Badge at End */}
            <div className="tool-top-bar">
              {tool.isNew && (
                <div className="tool-new-badge">
                  <span className="badge-pulse-dot" aria-hidden="true" />
                  <span className="badge-text">{locale === 'fa' ? 'جدید' : 'NEW'}</span>
                </div>
              )}
            </div>

            {/* Bottom Minimal Content & Hover Action Underneath */}
            <div className="tool-bottom-wrap">
              <div className="tool-text-group">
                <h4 className="tool-name">
                  {locale === 'fa' ? tool.nameFa : tool.name}
                </h4>
                <p className="tool-desc">
                  {locale === 'fa' ? tool.descriptionFa : tool.description}
                </p>
              </div>

              {/* Action Button without background, appears under text and lifts text */}
              <div className="tool-action-reveal" aria-hidden="true">
                <span className="cta-link-text">
                  {locale === 'fa' ? 'اجرای ابزار' : 'Launch Tool'}
                </span>
                <span className="cta-arrow">
                  {isRtl ? (
                    <ArrowLeft size={14} strokeWidth={2.5} color="currentColor" />
                  ) : (
                    <ArrowRight size={14} strokeWidth={2.5} color="currentColor" />
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .tools-section-wrapper {
          width: 100%;
          margin-bottom: var(--lemmo-space-800, 32px);
          box-sizing: border-box;
        }

        /* Section Header */
        .section-header {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: var(--lemmo-space-400, 16px);
          gap: var(--lemmo-space-300, 12px);
          flex-wrap: wrap;
        }

        .header-title-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .section-title {
          font-family: var(--lemmo-font-heading, 'Oddval', 'Morabba', sans-serif);
          font-size: var(--lemmo-type-size-400, 1.125rem);
          font-weight: 700;
          color: var(--lemmo-text-primary, #e1e1e3);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .section-subtitle {
          font-size: 0.8125rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        :global(.view-all-link) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          text-decoration: none;
          transition: opacity 0.15s ease;
        }

        :global(.view-all-link:hover) {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Tools Grid */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--lemmo-space-400, 16px);
          width: 100%;
          box-sizing: border-box;
        }

        :global(.tool-card) {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 200px;
          border-radius: var(--lemmo-radius-media, 16px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          padding: var(--lemmo-space-300, 12px);
          transition: border-color 0.2s ease,
                      box-shadow 0.24s ease;
        }

        :global(.tool-card:hover) {
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.28));
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.55);
        }

        :global(.tool-card:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        /* Full Card Background Image */
        .tool-card-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        /* Gradient Scrim: ensures minimal text contrast while preserving artwork presentation */
        .tool-card-scrim {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(10, 12, 14, 0.48) 0%,
            rgba(10, 12, 14, 0.05) 30%,
            rgba(10, 12, 14, 0.4) 60%,
            rgba(10, 12, 14, 0.94) 100%
          );
          opacity: 0.88;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        :global(.tool-card:hover) .tool-card-scrim {
          opacity: 0.96;
        }

        /* Top Bar: Distinctive NEW Badge at End */
        .tool-top-bar {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          min-height: 24px;
          pointer-events: none;
        }

        .tool-new-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          background: rgba(10, 12, 14, 0.72);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(209, 254, 23, 0.45);
          border-radius: var(--lemmo-radius-pill, 9999px);
          box-shadow: 0 0 10px rgba(209, 254, 23, 0.25);
        }

        .badge-pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 6px var(--lemmo-surface-brand-background, #d1fe17);
        }

        .badge-text {
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          line-height: 1;
        }

        /* Bottom Minimal Content & Action */
        .tool-bottom-wrap {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          width: 100%;
          box-sizing: border-box;
        }

        .tool-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }

        .tool-name {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-300, 0.9375rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);
          transition: color 0.15s ease;
        }

        :global(.tool-card:hover) .tool-name {
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .tool-desc {
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.35;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
          transition: color 0.18s ease;
        }

        :global(.tool-card:hover) .tool-desc {
          color: #ffffff;
        }

        /* Action without background, emerges below text in hover */
        .tool-action-reveal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 0;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.75rem;
          font-weight: 700;
          max-height: 0;
          opacity: 0;
          margin-top: 0;
          overflow: hidden;
          pointer-events: none;
          transition: max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.22s ease,
                      margin-top 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        :global(.tool-card:hover) .tool-action-reveal {
          max-height: 26px;
          opacity: 1;
          margin-top: 8px;
          pointer-events: auto;
        }

        .cta-link-text {
          line-height: 1;
          text-shadow: 0 0 10px rgba(209, 254, 23, 0.45);
        }

        .cta-arrow {
          display: flex;
          align-items: center;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        :global(.tool-card:hover) .cta-arrow {
          transform: translateX(isRtl ? -3px : 3px);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1024px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          :global(.tool-card) {
            height: 190px;
          }
        }

        @media (max-width: 640px) {
          /* Mobile horizontal scroll-snap carousel */
          .tools-grid {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            margin-inline: -12px;
            padding-inline: 12px;
            scrollbar-width: none;
            gap: 12px;
          }

          .tools-grid::-webkit-scrollbar {
            display: none;
          }

          :global(.tool-card) {
            flex: 0 0 220px;
            width: 220px;
            height: 180px;
            scroll-snap-align: start;
          }

          /* On touch mobile, always show action under text */
          .tool-action-reveal {
            max-height: 26px;
            opacity: 1;
            margin-top: 6px;
            pointer-events: auto;
          }
        }
      `}</style>
    </section>
  );
}
