/**
 * Single Image / Feed Detail Page — /app/feed/[filename]
 *
 * Faithfully designed and upgraded from:
 * - app/.wireframe/Single-image-web.html
 * - app/.wireframe/Single-image-mobile.html
 *
 * Features:
 * 1. Little Gallery Strip:
 *    - Vertical 64px thumbnail strip on desktop allowing instant browsing between feed items.
 *    - Active ring in brand lime; hidden on mobile.
 * 2. Details Content Column (450px):
 *    - Quick action bar (Like with live counter, Share, Copy prompt).
 *    - Artist profile badge (avatar, name, handle).
 *    - Prompt card with model tag, aspect ratio pill, and copy button.
 *    - Tag container with category and stylistic tokens.
 *    - Reference images section ("References & Inputs").
 *    - Flagship primary CTA: "Remix in Studio" (ریمیکس در استودیو).
 * 3. Central Content Canvas:
 *    - Glassmorphic Back button to return to feed index.
 *    - High-res media display with natural aspect ratio and subtle studio backdrop.
 *    - Floating hover toolbar (Download, Fullscreen modal preview, Copy).
 * 4. Responsive Experience:
 *    - Stacks on mobile with prominent top hero, scrollable details, and sticky bottom action bar.
 *    - 100% token-driven from @lemmo-lab/tokens with complete RTL/LTR localization.
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Copy01,
  Check01,
  Share01,
  Heart,
  Sparks,
  Download01,
  Maximize01,
  Stars01,
  AiCpu,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { FEED_ITEMS, FeedItem } from '@/shared/data/feedData';

export default function SingleImageFeedPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, dir } = useUiStore();
  const isRtl = dir === 'rtl';

  const rawFilename = (params?.filename as string) || 'feed-1';

  // Find initial item or default to first
  const initialItem = useMemo(() => {
    return (
      FEED_ITEMS.find(
        (item) => item.id === rawFilename || item.image.includes(rawFilename)
      ) || FEED_ITEMS[0]
    );
  }, [rawFilename]);

  const [selectedItem, setSelectedItem] = useState<FeedItem>(initialItem);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialItem.likes);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync state if selected item changes
  const handleSelectItem = (item: FeedItem) => {
    setSelectedItem(item);
    setIsLiked(false);
    setLikesCount(item.likes);
    setCopiedPrompt(false);
    setCopiedShare(false);
  };

  // Like toggle handler
  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  // Copy prompt handler
  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const promptText =
      locale === 'fa' && selectedItem.prompt
        ? selectedItem.prompt
        : selectedItem.prompt;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  // Share link handler
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === 'fa' ? selectedItem.titleFa : selectedItem.title,
          text: selectedItem.prompt,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  // Download image handler
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = selectedItem.image;
    link.download = `${selectedItem.id}-lemmo.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock reference images based on neighboring items
  const referenceImages = useMemo(() => {
    const others = FEED_ITEMS.filter((i) => i.id !== selectedItem.id);
    return [others[0]?.image || selectedItem.image, others[1]?.image || selectedItem.image];
  }, [selectedItem.id]);

  return (
    <div className="single-image-app" dir={dir}>
      {/* ===== MAIN BODY CONTAINER ===== */}
      <div className="main-body">
        <div className="content">
          {/* 1. CENTRAL MEDIA CONTENT CANVAS (First in order at start side) */}
          <div className="content-area">
            {/* Back to Feed Index Button (Docked prominently at top-start) */}
            <Link
              href="/app"
              className="back-button"
              title={locale === 'fa' ? 'بازگشت به گالری' : 'Back to Gallery'}
              aria-label="Back to gallery"
            >
              <div className="back-button-inner">
                {isRtl ? (
                  <ArrowRight size={16} strokeWidth={2.4} color="currentColor" />
                ) : (
                  <ArrowLeft size={16} strokeWidth={2.4} color="currentColor" />
                )}
                <span className="back-button-label">
                  {locale === 'fa' ? 'بازگشت' : 'Back'}
                </span>
              </div>
            </Link>

            {/* Hero Main Media Frame */}
            <div className="hero-media-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selectedItem.id}
                src={selectedItem.image}
                alt={locale === 'fa' ? selectedItem.titleFa : selectedItem.title}
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

          {/* 2. DETAILS CONTENT COLUMN (Second in order in the middle) */}
          <div className="details-content">
            <div className="promp">
              {/* Top Section: Author Badge (First) + Quick Actions (Second) */}
              <div className="top_section">
                {/* Author Badge */}
                <div className="author-badge-card">
                  <div className="author-avatar">{selectedItem.avatar}</div>
                  <div className="author-info">
                    <span className="author-name">{selectedItem.author}</span>
                    <span className="author-handle">{selectedItem.authorHandle}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-action">
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={handleCopyPrompt}
                    title={copiedPrompt ? (locale === 'fa' ? 'پرامپت کپی شد!' : 'Copied!') : (locale === 'fa' ? 'کپی پرامپت' : 'Copy prompt')}
                    aria-label="Copy prompt"
                  >
                    {copiedPrompt ? (
                      <Check01 size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    ) : (
                      <Copy01 size={15} strokeWidth={2} color="currentColor" />
                    )}
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
                    className={`icon-action-btn like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleToggleLike}
                    title={locale === 'fa' ? 'علاقه‌مندی' : 'Like'}
                    aria-label="Like creation"
                  >
                    <Heart
                      size={15}
                      strokeWidth={2}
                      color={isLiked ? '#ff3b5c' : 'currentColor'}
                      fill={isLiked ? '#ff3b5c' : 'none'}
                    />
                    <span className="like-counter-badge">{likesCount}</span>
                  </button>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="promp_card">
                <div className="promp_card_header">
                  <div className="card-model-badge">
                    <AiCpu size={13} strokeWidth={2} color="currentColor" />
                    <span>{selectedItem.model}</span>
                  </div>

                  <div className="card-aspect-badge">
                    <span>{selectedItem.aspectRatio}</span>
                  </div>
                </div>

                <div className="promp_text_wrap">
                  <p className="promp-text-body">{selectedItem.prompt}</p>
                </div>

                <div className="promp_card_footer">
                  <span className="timestamp-note">{selectedItem.createdAt}</span>
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

              {/* Tag Container */}
              <div className="tag-container" aria-label="Tags">
                <span className="tag-pill">
                  #{selectedItem.category}
                </span>
                <span className="tag-pill">
                  #4K_UHD
                </span>
                <span className="tag-pill">
                  #CinematicLighting
                </span>
                <span className="tag-pill">
                  #StudioMaster
                </span>
              </div>

              {/* Reference Images Section */}
              <div className="refrance">
                <div className="refrance-header">
                  <span className="refrance-label">
                    {locale === 'fa' ? 'تصاویر مرجع و ورودی‌ها' : 'References & Inputs'}
                  </span>
                  <span className="refrance-type-tag">
                    {locale === 'fa' ? 'سبک و ترکیب' : 'Style & Pose Ref'}
                  </span>
                </div>

                <div className="refrances">
                  {referenceImages.map((refImg, idx) => (
                    <div key={idx} className="ref-item" title={`Reference #${idx + 1}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={refImg}
                        alt={`Reference input ${idx + 1}`}
                        className="refrance-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Base (Primary Flagship CTA: Remix in Studio) */}
            <div className="action_base">
              <Link
                href={`/app/agent?remix=${encodeURIComponent(selectedItem.prompt)}`}
                className="btn-remix-flagship"
                title={locale === 'fa' ? 'بازآفرینی و ریمیکس در استودیو' : 'Remix in Studio'}
                data-action="remix-feed-item"
              >
                <span className="remix-spark-icon">
                  <Sparks size={18} strokeWidth={2.2} color="currentColor" />
                </span>
                <span className="remix-label-text">
                  {locale === 'fa' ? 'ریمیکس در استودیو' : 'Remix in Studio'}
                </span>
                <span className="remix-arrow-icon">
                  {isRtl ? (
                    <ArrowLeft size={16} strokeWidth={2.4} color="currentColor" />
                  ) : (
                    <ArrowRight size={16} strokeWidth={2.4} color="currentColor" />
                  )}
                </span>
              </Link>
            </div>
          </div>

          {/* 3. LITTLE GALLERY STRIP (Third in order at end side) */}
          <aside
            className="little-gallery"
            aria-label={locale === 'fa' ? 'گالری آثار مرتبط' : 'Gallery Items'}
          >
            {FEED_ITEMS.map((item) => {
              const isActive = item.id === selectedItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`focus-pic-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectItem(item)}
                  title={locale === 'fa' ? item.titleFa : item.title}
                  aria-label={locale === 'fa' ? item.titleFa : item.title}
                  aria-pressed={isActive}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={locale === 'fa' ? item.titleFa : item.title}
                    className="focus-thumb-img"
                    loading="lazy"
                  />
                  {isActive && <span className="active-dot-indicator" />}
                </button>
              );
            })}
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
            aria-label="Close fullscreen view"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedItem.image}
            alt={locale === 'fa' ? selectedItem.titleFa : selectedItem.title}
            className="lightbox-full-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ===== 100% TOKEN DRIVEN SCOPED CSS ===== */}
      <style jsx>{`
        .single-image-app {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 100%;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-text-primary, #ffffff);
          box-sizing: border-box;
          user-select: none;
        }

        /* ===== MAIN BODY ===== */
        .main-body {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
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

        /* ================= 1. LITTLE GALLERY STRIP ================= */
        .little-gallery {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          gap: 12px;
          width: 64px;
          height: calc(100dvh - 56px);
          flex-shrink: 0;
          overflow-y: auto;
          scrollbar-width: none;
          box-sizing: border-box;
        }

        .little-gallery::-webkit-scrollbar {
          display: none;
        }

        .focus-pic-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border-radius: var(--lemmo-radius-media, 12px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          padding: 0;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease;
        }

        .focus-pic-btn:hover {
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.3));
          transform: scale(1.04);
        }

        .focus-pic-btn.active {
          border: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 12px rgba(209, 254, 23, 0.35);
        }

        .focus-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .active-dot-indicator {
          position: absolute;
          bottom: 3px;
          width: 6px;
          height: 6px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 6px var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* ================= 2. DETAILS CONTENT COLUMN ================= */
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
          padding-inline-end: 4px;
        }

        .promp::-webkit-scrollbar {
          display: none;
        }

        /* Top Section: Quick Actions + Author Badge */
        .top_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          min-height: 36px;
          gap: 12px;
        }

        .quick-action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }

        .icon-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 32px;
          padding: 0 10px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          transition: all 0.15s ease;
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

        .like-counter-badge {
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
        }

        /* Author Badge */
        .author-badge-card {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .author-avatar {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-secondary-background, #24282d);
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.18));
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .author-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--lemmo-text-primary, #ffffff);
        }

        .author-handle {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        /* Prompt Card */
        .promp_card {
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 12px;
          width: 100%;
          background: var(--lemmo-surface-primary-background, #17191b);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-2xl, 20px);
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
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
          -webkit-user-select: text;
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

        /* Reference Section */
        .refrance {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .refrance-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .refrance-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--lemmo-text-secondary, #b5b6b8);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .refrance-type-tag {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .refrances {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .ref-item {
          width: 52px;
          height: 52px;
          border-radius: var(--lemmo-radius-md, 10px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .ref-item:hover {
          transform: scale(1.06);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .refrance-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
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

        .remix-spark-icon,
        .remix-arrow-icon {
          display: flex;
          align-items: center;
          line-height: 1;
        }

        /* ================= 3. CENTRAL CONTENT CANVAS ================= */
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

          .little-gallery {
            order: 3;
            flex-direction: row;
            width: 100%;
            height: auto;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 4px 0 12px;
            gap: 10px;
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
