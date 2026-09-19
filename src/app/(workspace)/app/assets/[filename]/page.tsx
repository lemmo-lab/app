/**
 * Single Asset Details Page — Production Implementation
 * Route: /app/assets/[filename]
 *
 * Implements:
 * - app/.wireframe/Assets/assets-single-page.html
 * - Visual hierarchy aligned with Single Feed:
 *   1. First (Start Side): Main media canvas (content-area) with docked Back button (top-start).
 *   2. Second (End Side): Details panel (details-content) with title, actions, prompt card, metadata rows, and remix CTA.
 * - 100% token-driven from @lemmo-lab/tokens
 * - Full responsive design (Desktop, Tablet, Mobile)
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Copy01,
  Share01,
  Heart,
  Trash01,
  Maximize01,
  Download01,
  Calendar01,
  Scale01,
  AiCpu,
  File01,
  Sparks,
  Check01,
  X01,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { MOCK_ASSETS } from '@/modules/assets/data/mockAssets';
import { AssetItem } from '@/modules/assets/types';

export default function SingleAssetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, dir } = useUiStore();
  const isRtl = dir === 'rtl';

  const assetId = (params?.['file-name'] || params?.filename || 'asset-1') as string;

  // Lookup matching asset or fallback to first item
  const initialAsset = useMemo(() => {
    return MOCK_ASSETS.find((a) => a.id === assetId) || MOCK_ASSETS[0];
  }, [assetId]);

  const [asset] = useState<AssetItem>(initialAsset);
  const [isFavorite, setIsFavorite] = useState(initialAsset.isFavorite);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Copy prompt handler
  const handleCopyPrompt = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(asset.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  // Share handler
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Download asset helper
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.image;
    link.download = `${asset.id}-${asset.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete handler
  const handleDelete = () => {
    if (window.confirm(locale === 'fa' ? 'آیا از حذف این اثر اطمینان دارید؟' : 'Are you sure you want to delete this asset?')) {
      router.push('/app/assets');
    }
  };

  return (
    <div className="single-asset-root" dir={dir}>
      {/* ===== MAIN BODY ===== */}
      <div className="main-body">
        <div className="content">
          {/* 1. CONTENT CANVAS (First in order at start side) */}
          <div className="content-area">
            {/* Back to Assets Button (Docked prominently at top-start) */}
            <Link
              href="/app/assets"
              className="back-button"
              title={locale === 'fa' ? 'بازگشت به دارایی‌ها' : 'Back to Assets'}
              aria-label="Back to assets"
            >
              <div className="back-button-inner">
                {isRtl ? (
                  <ArrowRight size={16} strokeWidth={2.4} color="currentColor" />
                ) : (
                  <ArrowLeft size={16} strokeWidth={2.4} color="currentColor" />
                )}
                <span className="back-button-label">
                  {locale === 'fa' ? 'بازگشت به فایل‌ها' : 'Back to Assets'}
                </span>
              </div>
            </Link>

            {/* Hero Main Media Frame */}
            <div className="hero-media-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={asset.id}
                src={asset.image}
                alt={locale === 'fa' ? asset.titleFa : asset.title}
                className="hero-main-img"
                onClick={() => setIsFullscreen(true)}
              />

              {/* Floating Quick Media Toolbar */}
              <div className="floating-media-toolbar">
                <button
                  type="button"
                  className="tool-action-pill"
                  onClick={handleDownload}
                  title={locale === 'fa' ? 'دانلود تصویر با کیفیت کامل' : 'Download Full Resolution'}
                >
                  <Download01 size={14} strokeWidth={2.2} color="currentColor" />
                  <span>{locale === 'fa' ? 'دانلود' : 'Download'}</span>
                </button>

                <button
                  type="button"
                  className="tool-action-pill"
                  onClick={() => setIsFullscreen(true)}
                  title={locale === 'fa' ? 'مشاهده در ابعاد کامل' : 'Expand Fullscreen'}
                >
                  <Maximize01 size={14} strokeWidth={2.2} color="currentColor" />
                  <span>{locale === 'fa' ? 'بزرگ‌نمایی' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. DETAILS & METADATA COLUMN (Second in order at end side) */}
          <aside className="details-content">
            <div className="promp">
              {/* Top Section: Clean Title + Essential Actions */}
              <div className="top_section">
                <div className="asset-meta-title">
                  <h1 className="asset-title-text" title={locale === 'fa' ? asset.titleFa : asset.title}>
                    {locale === 'fa' ? asset.titleFa : asset.title}
                  </h1>
                </div>

                <div className="quick-action">
                  <button
                    type="button"
                    className={`icon-action-btn like-btn ${isFavorite ? 'liked' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                    title={locale === 'fa' ? 'افزودن به علاقه‌مندی‌ها' : 'Add to Favorites'}
                    aria-label="Favorite creation"
                  >
                    <Heart
                      size={15}
                      strokeWidth={2}
                      color={isFavorite ? '#ff3b5c' : 'currentColor'}
                      fill={isFavorite ? '#ff3b5c' : 'none'}
                    />
                  </button>

                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={handleShare}
                    title={copiedShare ? (locale === 'fa' ? 'پیوند کپی شد!' : 'Link copied!') : (locale === 'fa' ? 'اشتراک‌گذاری' : 'Share')}
                    aria-label="Share creation"
                  >
                    {copiedShare ? (
                      <Check01 size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    ) : (
                      <Share01 size={15} strokeWidth={2} color="currentColor" />
                    )}
                  </button>

                  <button
                    type="button"
                    className="icon-action-btn delete-btn"
                    onClick={handleDelete}
                    title={locale === 'fa' ? 'حذف فایل' : 'Delete asset'}
                    aria-label="Delete asset"
                  >
                    <Trash01 size={15} strokeWidth={2} color="currentColor" />
                  </button>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="promp_card">
                <div className="promp_card_header">
                  <div className="card-model-badge">
                    <AiCpu size={13} strokeWidth={2} color="currentColor" />
                    <span>{asset.model}</span>
                  </div>

                  <div className="card-aspect-badge">
                    <span>{asset.aspectRatio}</span>
                  </div>
                </div>

                <div className="promp_text_wrap">
                  <p className="promp-text-body">{asset.prompt}</p>
                </div>

                <div className="promp_card_footer">
                  <span className="timestamp-note">{locale === 'fa' ? asset.createdAtFa : asset.createdAt}</span>
                  <button
                    type="button"
                    className="copy-prompt-pill"
                    onClick={handleCopyPrompt}
                  >
                    {copiedPrompt ? (
                      <>
                        <Check01 size={12} strokeWidth={2.4} color="currentColor" />
                        <span>{locale === 'fa' ? 'کپی شد' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy01 size={12} strokeWidth={2} color="currentColor" />
                        <span>{locale === 'fa' ? 'کپی پرامپت' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata Rows (from wireframe .result_section) */}
              <div className="metadata-container">
                {/* Row 1: Created Date */}
                <div className="result_section">
                  <div className="meta-sub-label">
                    <Calendar01 size={16} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    <span className="meta-label-text">
                      {locale === 'fa' ? 'تاریخ ایجاد' : 'Created Date'}
                    </span>
                  </div>
                  <span className="meta-value">
                    {locale === 'fa' ? asset.createdAtFa : asset.createdAt}
                  </span>
                </div>

                {/* Row 2: Dimensions & Ratio */}
                <div className="result_section">
                  <div className="meta-sub-label">
                    <Scale01 size={16} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    <span className="meta-label-text">
                      {locale === 'fa' ? 'ابعاد و نسبت' : 'Dimensions'}
                    </span>
                  </div>
                  <span className="meta-value">
                    {asset.dimensions} ({asset.aspectRatio})
                  </span>
                </div>

                {/* Row 3: Model / Tool Engine */}
                <div className="result_section">
                  <div className="meta-sub-label">
                    <AiCpu size={16} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    <span className="meta-label-text">
                      {locale === 'fa' ? 'موتور مدل' : 'AI Engine'}
                    </span>
                  </div>
                  <span className="tag-model-pill">{asset.model}</span>
                </div>

                {/* Row 4: File Size & Format */}
                <div className="result_section">
                  <div className="meta-sub-label">
                    <File01 size={16} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    <span className="meta-label-text">
                      {locale === 'fa' ? 'حجم و فرمت' : 'File Size'}
                    </span>
                  </div>
                  <span className="meta-value">{asset.fileSize} • WEBP</span>
                </div>
              </div>

              {/* Tag Container */}
              <div className="tag-container" aria-label="Tags">
                {asset.tags.map((tag) => (
                  <span key={tag} className="tag-pill">#{tag}</span>
                ))}
                <span className="tag-pill">#{asset.category}</span>
                <span className="tag-pill">#LemmoAsset</span>
              </div>
            </div>

            {/* Bottom Action Base (Flagship Primary Remix Button) */}
            <div className="action_base">
              <Link
                href={`/app/agent?remix=${encodeURIComponent(asset.prompt)}`}
                className="btn-remix-flagship"
                title={locale === 'fa' ? 'بازآفرینی و ریمیکس در استودیو' : 'Remix in Studio'}
                data-action="remix-asset-item"
              >
                <span className="remix-spark-icon">
                  <Sparks size={18} strokeWidth={2.2} color="currentColor" />
                </span>
                <span className="remix-label-text">
                  {locale === 'fa' ? 'ریمیکس و تولید مجدد در استودیو' : 'Regenerate / Remix in Studio'}
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fullscreen-lightbox"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="close-lightbox-btn"
            onClick={() => setIsFullscreen(false)}
            title={locale === 'fa' ? 'بستن' : 'Close'}
            aria-label="Close lightbox"
          >
            <X01 size={22} strokeWidth={2} color="currentColor" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.image}
            alt={locale === 'fa' ? asset.titleFa : asset.title}
            className="lightbox-full-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Scoped CSS faithful to Single Feed standard and DOC-DS-001 */}
      <style jsx>{`
        .single-asset-root {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 100%;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-text-primary, #ffffff);
          box-sizing: border-box;
        }

        /* ===== MAIN BODY CONTAINER ===== */
        .main-body {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          padding: var(--lemmo-space-700, 28px);
          flex: 1 1 0;
          min-width: 0;
          box-sizing: border-box;
        }

        .content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: stretch;
          gap: var(--lemmo-space-700, 28px);
          width: 100%;
          min-height: calc(100dvh - 56px);
          box-sizing: border-box;
        }

        /* ================= 1. CENTRAL CONTENT CANVAS (Start Side) ================= */
        .content-area {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          flex: 1 1 0;
          min-width: 0;
          height: calc(100dvh - 56px);
          box-sizing: border-box;
          overflow: visible;
        }

        :global(.back-button) {
          position: absolute !important;
          top: 10px;
          inset-inline-start: 4px;
          z-index: 20;
          display: inline-flex;
          text-decoration: none;
        }

        :global(.back-button-inner) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 14px;
          background: rgba(20, 22, 24, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-primary, #ffffff);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease, color 0.15s ease;
        }

        :global(.back-button-label) {
          line-height: 1;
        }

        :global(.back-button:hover .back-button-inner) {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          transform: translateY(-1px);
        }

        /* Hero Main Media Frame */
        .hero-media-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 90%;
          max-height: 82vh;
          border-radius: var(--lemmo-radius-xl, 16px);
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-main-img {
          max-width: 100%;
          max-height: 82vh;
          object-fit: contain;
          display: block;
          cursor: zoom-in;
          transition: filter 0.2s ease;
        }

        /* Floating Quick Media Toolbar */
        .floating-media-toolbar {
          position: absolute;
          bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          background: rgba(14, 16, 18, 0.75);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--lemmo-radius-pill, 9999px);
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        .hero-media-wrapper:hover .floating-media-toolbar {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .tool-action-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 12px;
          background: transparent;
          border: none;
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-primary, #ffffff);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .tool-action-pill:hover {
          background: rgba(255, 255, 255, 0.18);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* ================= 2. DETAILS & METADATA COLUMN (End Side) ================= */
        .details-content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
          width: 440px;
          max-width: 100%;
          flex-shrink: 0;
          height: calc(100dvh - 56px);
          box-sizing: border-box;
          background: #0d0f11;
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-2xl, 24px);
          padding: 24px;
        }

        .promp {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
          flex: 1 1 0;
          overflow-y: auto;
          scrollbar-width: none;
          padding-inline-end: 2px;
        }

        .promp::-webkit-scrollbar {
          display: none;
        }

        /* Top Section: Clean Title + Quick Actions */
        .top_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          min-height: 40px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          gap: 16px;
        }

        .asset-meta-title {
          display: flex;
          align-items: center;
          min-width: 0;
          flex: 1 1 0;
        }

        .asset-title-text {
          margin: 0;
          font-family: var(--lemmo-font-heading, inherit);
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--lemmo-text-primary, #ffffff);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quick-action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .icon-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: 50%;
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .icon-action-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        .icon-action-btn.like-btn.liked {
          color: #ff3b5c;
          border-color: rgba(255, 59, 92, 0.35);
          background: rgba(255, 59, 92, 0.08);
        }

        .icon-action-btn.delete-btn:hover {
          background: rgba(255, 59, 92, 0.18);
          border-color: rgba(255, 59, 92, 0.4);
          color: #ff3b5c;
        }

        /* Prompt Card */
        .promp_card {
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 12px;
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-xl, 16px);
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .promp_card_header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .card-model-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .card-aspect-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 3px 7px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: var(--lemmo-radius-sm, 6px);
          color: var(--lemmo-text-secondary, #b5b6b8);
        }

        .promp_text_wrap {
          width: 100%;
        }

        .promp-text-body {
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--lemmo-text-primary, #e6e6e8);
          margin: 0;
          word-break: break-word;
          user-select: text;
        }

        .promp_card_footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .timestamp-note {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .copy-prompt-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .copy-prompt-pill:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
        }

        /* Metadata Container (.result_section items from wireframe) */
        .metadata-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--lemmo-radius-lg, 12px);
        }

        .result_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .result_section:last-child {
          border-bottom: none;
        }

        .meta-sub-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .meta-label-text {
          font-size: 0.78125rem;
          font-weight: 600;
          color: var(--lemmo-text-secondary, #b5b6b8);
        }

        .meta-value {
          font-size: 0.78125rem;
          font-weight: 600;
          color: var(--lemmo-text-primary, #ffffff);
          font-variant-numeric: tabular-nums;
        }

        .tag-model-pill {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* Tag Container */
        .tag-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: var(--lemmo-surface-secondary-background, #1f2226);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-secondary, #b5b6b8);
        }

        /* Action Base (Flagship Primary Remix Button) */
        .action_base {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          min-height: 48px;
          margin-top: 16px;
        }

        :global(.btn-remix-flagship) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          height: 48px;
          padding: 0 20px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.9375rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(209, 254, 23, 0.38);
          transition: filter 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }

        :global(.btn-remix-flagship:hover) {
          filter: brightness(1.08);
          box-shadow: 0 0 22px rgba(209, 254, 23, 0.6);
          transform: translateY(-1px);
        }

        .remix-spark-icon {
          display: flex;
          align-items: center;
          line-height: 1;
        }

        /* Fullscreen Lightbox Modal */
        .fullscreen-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.94);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          cursor: zoom-out;
        }

        .close-lightbox-btn {
          position: absolute;
          top: 24px;
          inset-inline-end: 24px;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 1.75rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .close-lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .lightbox-full-img {
          max-width: 95vw;
          max-height: 95vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
          cursor: default;
        }

        /* ================= RESPONSIVE (MOBILE & TABLET) ================= */
        @media (max-width: 1080px) {
          .details-content {
            width: 360px;
          }
        }

        @media (max-width: 860px) {
          .main-body {
            padding: 16px;
          }

          .content {
            flex-direction: column;
            gap: 16px;
            min-height: auto;
          }

          .content-area {
            order: 1;
            width: 100%;
            height: auto;
            min-height: 380px;
            padding: 0;
            background: transparent;
            border: none;
          }

          .hero-media-wrapper {
            max-width: 100%;
            max-height: 55vh;
          }

          .hero-main-img {
            max-height: 55vh;
          }

          .details-content {
            order: 2;
            width: 100%;
            height: auto;
            gap: 16px;
            padding: 20px;
          }

          .promp {
            overflow-y: visible;
          }

          .action_base {
            position: sticky;
            bottom: 16px;
            z-index: 20;
            background: rgba(19, 21, 23, 0.88);
            backdrop-filter: blur(12px);
            padding: 8px 0;
            border-radius: var(--lemmo-radius-pill, 9999px);
          }
        }
      `}</style>
    </div>
  );
}
