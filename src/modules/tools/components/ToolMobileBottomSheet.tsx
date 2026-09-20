import React from 'react';
import Link from 'next/link';
import { X01, Maximize01, Sparks } from 'synthline/react';
import { ToolItem } from '../types';

interface ToolMobileBottomSheetProps {
  tool: ToolItem;
  onClose: () => void;
  locale: string;
}

export function ToolMobileBottomSheet({
  tool,
  onClose,
  locale,
}: ToolMobileBottomSheetProps) {
  return (
    <div
      className="mobile-sheet-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mobile-bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Drag Handle */}
        <div className="sheet-drag-handle-bar" />

        {/* Close Button */}
        <button
          type="button"
          className="sheet-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          <X01 size={18} strokeWidth={2.2} color="currentColor" />
        </button>

        {/* Sheet Cover */}
        <div className="sheet-cover-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.coverImage}
            alt={locale === 'fa' ? tool.nameFa : tool.name}
            className="sheet-cover-img"
          />
          <div className="sheet-cover-badges">
            <span className="cover-badge-category">
              {locale === 'fa' ? tool.categoryLabelFa : tool.categoryLabel}
            </span>
            <span className="cover-badge-version">{tool.version}</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="sheet-title-group">
          <h2 className="sheet-tool-title">
            {locale === 'fa' ? tool.nameFa : tool.name}
          </h2>
          <p className="sheet-tool-tagline">
            {locale === 'fa' ? tool.taglineFa : tool.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="sheet-desc-text">
          {locale === 'fa' ? tool.descriptionFa : tool.description}
        </p>

        {/* Specs */}
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
        <div className="sheet-actions-stack">
          <Link
            href={`/app/canvas?tool=${encodeURIComponent(tool.id)}`}
            className="btn-add-to-canvas full-width"
          >
            <Maximize01 size={16} strokeWidth={2.2} color="currentColor" />
            <span>{locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}</span>
          </Link>
          <Link
            href={`/app/agent?tool=${encodeURIComponent(tool.id)}`}
            className="btn-quick-run-studio full-width"
          >
            <Sparks size={15} strokeWidth={2.2} color="currentColor" />
            <span>{locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
