import React, { forwardRef } from 'react';
import Link from 'next/link';
import { Maximize01, Sparks, AiCpu } from 'synthline/react';
import { ToolItem } from '../types';

interface ToolPreviewCardProps {
  tool: ToolItem;
  previewTop: number;
  arrowTop: number;
  locale: string;
}

export const ToolPreviewCard = forwardRef<HTMLDivElement, ToolPreviewCardProps>(
  function ToolPreviewCard({ tool, previewTop, arrowTop, locale }, ref) {
    return (
      <div
        ref={ref}
        className="tools-floating-preview-card"
        style={{ top: `${previewTop}px` }}
        role="region"
        aria-label="Tool details"
      >
        {/* Popover Pointer Arrow */}
        <div
          className="preview-arrow-indicator"
          style={{ top: `${arrowTop}px` }}
          aria-hidden="true"
        />

        {/* Cover Image & Category Badges */}
        <div className="card-cover-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.coverImage}
            alt={locale === 'fa' ? tool.nameFa : tool.name}
            className="card-cover-img"
          />
          <div className="card-cover-overlay-gradient" />
          <div className="card-cover-badges">
            <span className="cover-badge-category">
              {locale === 'fa' ? tool.categoryLabelFa : tool.categoryLabel}
            </span>
            <span className="cover-badge-version">{tool.version}</span>
          </div>
        </div>

        {/* Title & Rating */}
        <div className="card-header-content">
          <div className="card-title-row">
            <h2 className="card-tool-title">
              {locale === 'fa' ? tool.nameFa : tool.name}
            </h2>
            <div className="card-rating-pill">
              <span>{tool.rating}</span>
              <span className="star-char">★</span>
            </div>
          </div>
          <p className="card-tool-tagline">
            {locale === 'fa' ? tool.taglineFa : tool.tagline}
          </p>
        </div>

        {/* Author / Engine Meta */}
        <div className="card-author-row">
          <div className="card-author-avatar">
            <AiCpu size={14} strokeWidth={2.2} color="currentColor" />
          </div>
          <div className="card-author-meta">
            <span className="card-author-name">
              {locale === 'fa' ? tool.authorFa : tool.author}
            </span>
            <span className="card-author-badge">
              {locale === 'fa' ? 'تأیید شده' : 'Verified Engine'}
            </span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="card-description-section">
          <p className="card-description-text">
            {locale === 'fa' ? tool.descriptionFa : tool.description}
          </p>
        </div>

        {/* Technical Specs Pills */}
        <div className="card-specs-row">
          <div className="spec-pill">
            <span className="spec-pill-label">{locale === 'fa' ? 'ورودی:' : 'Input:'}</span>
            <span className="spec-pill-value">{locale === 'fa' ? tool.inputsFa : tool.inputs}</span>
          </div>
          <div className="spec-pill">
            <span className="spec-pill-label">{locale === 'fa' ? 'سرعت:' : 'Speed:'}</span>
            <span className="spec-pill-value">{locale === 'fa' ? tool.speedFa : tool.speed}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions-footer">
          <Link
            href={`/app/canvas?tool=${encodeURIComponent(tool.id)}`}
            className="btn-add-to-canvas"
            title={locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}
          >
            <Maximize01 size={15} strokeWidth={2.2} color="currentColor" />
            <span>{locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}</span>
          </Link>

          <Link
            href={`/app/agent?tool=${encodeURIComponent(tool.id)}`}
            className="btn-quick-run-studio"
            title={locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}
          >
            <Sparks size={14} strokeWidth={2.2} color="currentColor" />
            <span>{locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}</span>
          </Link>
        </div>
      </div>
    );
  }
);
