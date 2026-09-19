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
            {/* Image Preview Container */}
            <div className="tool-thumb-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.image}
                alt={locale === 'fa' ? tool.nameFa : tool.name}
                className="tool-thumb-img"
              />
              <div className="tool-thumb-overlay" />
              <span className="tool-badge">{tool.badge}</span>
            </div>

            {/* Tool Meta Details */}
            <div className="tool-meta">
              <div className="tool-meta-header">
                <span className="tool-category">
                  {locale === 'fa' ? tool.categoryFa : tool.category}
                </span>
                <span className="tool-launch-arrow" aria-hidden="true">
                  {isRtl ? (
                    <ArrowLeft size={14} strokeWidth={2} color="currentColor" />
                  ) : (
                    <ArrowRight size={14} strokeWidth={2} color="currentColor" />
                  )}
                </span>
              </div>

              <h4 className="tool-name">
                {locale === 'fa' ? tool.nameFa : tool.name}
              </h4>

              <p className="tool-desc">
                {locale === 'fa' ? tool.descriptionFa : tool.description}
              </p>
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
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        :global(.view-all-link:hover) {
          opacity: 0.85;
          transform: translateX(isRtl ? -2px : 2px);
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
          display: flex;
          flex-direction: column;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-media, 16px);
          padding: var(--lemmo-space-200, 8px);
          text-decoration: none;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.2s ease,
                      box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        :global(.tool-card:hover) {
          transform: translateY(-3px);
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.22));
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
        }

        :global(.tool-card:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        .tool-thumb-wrap {
          position: relative;
          width: 100%;
          height: 140px;
          border-radius: var(--lemmo-radius-card, 12px);
          overflow: hidden;
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
        }

        .tool-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        :global(.tool-card:hover) .tool-thumb-img {
          transform: scale(1.06);
        }

        .tool-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(20, 22, 24, 0.8) 0%,
            transparent 60%
          );
        }

        .tool-badge {
          position: absolute;
          top: 8px;
          inset-inline-start: 8px;
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          letter-spacing: 0.03em;
        }

        /* Meta Details */
        .tool-meta {
          display: flex;
          flex-direction: column;
          padding: var(--lemmo-space-200, 8px) 4px 4px 4px;
          gap: 4px;
        }

        .tool-meta-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .tool-category {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-muted, #898a8b);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tool-launch-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: rgba(255, 255, 255, 0.05);
          color: var(--lemmo-text-secondary, #a1a1a5);
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }

        :global(.tool-card:hover) .tool-launch-arrow {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          transform: translateX(isRtl ? -2px : 2px);
        }

        .tool-name {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: 600;
          color: var(--lemmo-text-primary, #e1e1e3);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tool-desc {
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #a1a1a5);
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1024px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
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
            flex: 0 0 200px;
            width: 200px;
            scroll-snap-align: start;
          }

          .tool-thumb-wrap {
            height: 110px;
          }
        }
      `}</style>
    </section>
  );
}
