/**
 * Assets Manager Component — Production Implementation
 *
 * Implements DOC-FE-001, DOC-MOD-000, and faithfully realizes:
 * - app/.wireframe/Assets/assets.html (Content State)
 * - app/.wireframe/Assets/assets-empty.html (Empty State)
 *
 * Features:
 * - Real-time search across titles, prompts, and tags
 * - Type filter tabs (All, Images, Videos, 3D & Materials)
 * - Sub-filter pills (All, Favorites, Studio Creations, Uploads) separated by wireframe filter lines
 * - Assets grouped by date (Today, Yesterday, Last Week) with date badges and quick plus action
 * - Standard 185x185px square content cards with interactive favorite heart toggle
 * - Card hover overlay toolbar (Preview modal, Download, Remix in Studio, Delete)
 * - Interactive Empty State with branded illustration, title, subtitle, and flagship CTA
 * - Dedicated toggle to switch between Populated and Empty State for live review and testing
 * - 100% token-driven with dual LTR/RTL support
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search01,
  Heart,
  Plus01,
  Sparks,
  FolderUpload,
  FolderCopy,
  Maximize01,
  Download01,
  Trash01,
  X01,
  Image03,
  Check01,
  AiVideoCamera,
  LayersThree,
  ChevronLeft,
  ChevronRight,
  Copy01,
  AiCpu,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { AssetItem, AssetFilterCategory, AssetSubFilter, DateGroupKey } from '../types';
import { MOCK_ASSETS } from '../data/mockAssets';

interface AssetsManagerProps {
  initialEmpty?: boolean;
}

export default function AssetsManager({ initialEmpty = false }: AssetsManagerProps) {
  const { locale, dir } = useUiStore();
  const isRtl = dir === 'rtl';

  // State management
  const [items, setItems] = useState<AssetItem[]>(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AssetFilterCategory>('all');
  const [activeSubFilter, setActiveSubFilter] = useState<AssetSubFilter>('all');
  const [forceEmptyState, setForceEmptyState] = useState(initialEmpty);
  const [previewItem, setPreviewItem] = useState<AssetItem | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Tabs list
  const categoryTabs = [
    { id: 'all' as AssetFilterCategory, labelEn: 'All Assets', labelFa: 'همه فایل‌ها', icon: FolderCopy },
    { id: 'image' as AssetFilterCategory, labelEn: 'Images', labelFa: 'تصاویر', icon: Image03 },
    { id: 'video' as AssetFilterCategory, labelEn: 'Videos', labelFa: 'ویدیوها', icon: AiVideoCamera },
    { id: 'material' as AssetFilterCategory, labelEn: '3D & Materials', labelFa: 'متریال و سه‌بعدی', icon: LayersThree },
  ];

  // Sub-filter pills (from wireframe filter-rect items)
  const subFilters = [
    { id: 'all' as AssetSubFilter, labelEn: 'All Items', labelFa: 'همه موارد' },
    { id: 'favorites' as AssetSubFilter, labelEn: 'Favorites', labelFa: 'نشان‌شده‌ها' },
    { id: 'generations' as AssetSubFilter, labelEn: 'Studio Creations', labelFa: 'تولیدات استودیو' },
    { id: 'uploads' as AssetSubFilter, labelEn: 'Uploads', labelFa: 'فایل‌های آپلودی' },
  ];

  // Toggle favorite status on an asset
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Delete an asset from the list
  const handleDeleteAsset = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletedIds((prev) => new Set(prev).add(id));
  };

  // Download asset helper
  const handleDownload = (e: React.MouseEvent, item: AssetItem) => {
    e.preventDefault();
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `${item.id}-${item.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items based on category, subFilter, search query, and deletedIds
  const filteredItems = useMemo(() => {
    if (forceEmptyState) return [];

    return items
      .filter((item) => !deletedIds.has(item.id))
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'all' && item.type !== activeCategory) {
          return false;
        }

        // Sub filter
        if (activeSubFilter === 'favorites' && !item.isFavorite) {
          return false;
        }
        if (activeSubFilter === 'generations' && item.category === 'upload') {
          return false;
        }
        if (activeSubFilter === 'uploads' && item.category !== 'upload') {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query) || item.titleFa.includes(query);
          const matchPrompt = item.prompt.toLowerCase().includes(query);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchPrompt && !matchTag) {
            return false;
          }
        }

        return true;
      });
  }, [items, deletedIds, activeCategory, activeSubFilter, searchQuery, forceEmptyState]);

  // Group filtered items by date group
  const groupedItems = useMemo(() => {
    const groups: { key: DateGroupKey; labelEn: string; labelFa: string; items: AssetItem[] }[] = [
      { key: 'today', labelEn: 'Today', labelFa: 'امروز', items: [] },
      { key: 'yesterday', labelEn: 'Yesterday', labelFa: 'دیروز', items: [] },
      { key: 'last_week', labelEn: 'Last Week', labelFa: 'هفته گذشته', items: [] },
    ];

    filteredItems.forEach((item) => {
      const group = groups.find((g) => g.key === item.dateGroup);
      if (group) {
        group.items.push(item);
      } else {
        groups[2].items.push(item);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredItems]);

  const [copiedModalPrompt, setCopiedModalPrompt] = useState(false);

  // Cycling through preview items
  const currentIndex = useMemo(() => {
    if (!previewItem) return -1;
    return filteredItems.findIndex((item) => item.id === previewItem.id);
  }, [previewItem, filteredItems]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredItems.length - 1;

  const handlePrevPreview = () => {
    if (hasPrev) {
      setPreviewItem(filteredItems[currentIndex - 1]);
      setCopiedModalPrompt(false);
    }
  };

  const handleNextPreview = () => {
    if (hasNext) {
      setPreviewItem(filteredItems[currentIndex + 1]);
      setCopiedModalPrompt(false);
    }
  };

  const handleCopyPromptText = (e: React.MouseEvent, promptText: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(promptText);
      setCopiedModalPrompt(true);
      setTimeout(() => setCopiedModalPrompt(false), 2000);
    }
  };

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (!previewItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewItem(null);
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) {
          if (hasNext) setPreviewItem(filteredItems[currentIndex + 1]);
        } else {
          if (hasPrev) setPreviewItem(filteredItems[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowRight') {
        if (isRtl) {
          if (hasPrev) setPreviewItem(filteredItems[currentIndex - 1]);
        } else {
          if (hasNext) setPreviewItem(filteredItems[currentIndex + 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewItem, currentIndex, hasPrev, hasNext, isRtl, filteredItems]);

  const isEmpty = forceEmptyState || filteredItems.length === 0;

  return (
    <div className="assets-app-root" dir={dir}>
      {/* ===== MAIN BODY ===== */}
      <main className="body">
        {/* ===== PAGE HEADER ===== */}
        <header className="page-header">
          {/* Action Section (Search + Filter Tabs + Tools) */}
          <div className="action_section">
            {/* 4 Category Filter Tabs (from wireframe .tabs) */}
            <div className="tabs" role="tablist" aria-label="Asset Category Filter">
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`tab-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setForceEmptyState(false);
                    }}
                  >
                    <IconComponent size={16} strokeWidth={isActive ? 2.2 : 1.8} color="currentColor" />
                    <span>{locale === 'fa' ? tab.labelFa : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Container: Search bar + View Toggle Button */}
            <div className="action">
              <div className="search-wrap">
                <Search01 size={17} strokeWidth={2} color="var(--lemmo-text-muted, #898a8b)" />
                <input
                  type="text"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (forceEmptyState) setForceEmptyState(false);
                  }}
                  placeholder={
                    locale === 'fa'
                      ? 'جستجو در فایل‌ها، پرامپت‌ها و برچسب‌ها...'
                      : 'Search assets, prompts, and tags...'
                  }
                  aria-label="Search assets"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title={locale === 'fa' ? 'پاک کردن' : 'Clear search'}
                  >
                    <X01 size={14} strokeWidth={2} color="currentColor" />
                  </button>
                )}
              </div>

              {/* State Switcher: For Testing & QA between Populated / Empty State */}
              <button
                type="button"
                className={`state-toggle-pill ${forceEmptyState ? 'active-empty' : ''}`}
                onClick={() => setForceEmptyState((prev) => !prev)}
                title={locale === 'fa' ? 'تغییر وضعیت آزمایشی (خالی / پر)' : 'Toggle empty state view'}
              >
                <span>
                  {forceEmptyState
                    ? locale === 'fa'
                      ? 'نمایش محتوا'
                      : 'Show Content'
                    : locale === 'fa'
                    ? 'نمای خالی'
                    : 'Show Empty'}
                </span>
              </button>
            </div>
          </div>

          {/* Sub-filter Rail (wireframe .filter with .filter-rect & .filter-line) */}
          <nav className="filter" aria-label="Sub Filters">
            {subFilters.map((sub, idx) => {
              const isActive = activeSubFilter === sub.id && !forceEmptyState;
              return (
                <React.Fragment key={sub.id}>
                  <button
                    type="button"
                    className={`filter-rect ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSubFilter(sub.id);
                      setForceEmptyState(false);
                    }}
                  >
                    <span>{locale === 'fa' ? sub.labelFa : sub.labelEn}</span>
                  </button>
                  {idx < subFilters.length - 1 && <span className="filter-line" aria-hidden="true" />}
                </React.Fragment>
              );
            })}
          </nav>
        </header>

        {/* ===== MAIN CONTENT AREA ===== */}
        {isEmpty ? (
          /* ================= EMPTY STATE VIEW ================= */
          <section className="empty-content-stage">
            <div className="empty-state">
              {/* Illustrated Icon Box */}
              <div className="empty-state-pic">
                <FolderUpload size={28} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
              </div>

              {/* Title and Subtitle */}
              <div className="title-subtitle">
                <h2 className="empty-title">
                  {searchQuery
                    ? locale === 'fa'
                      ? 'هیچ نتیجه‌ای یافت نشد'
                      : 'No Matching Assets'
                    : locale === 'fa'
                    ? 'هنوز هیچ فایلی ایجاد یا ذخیره نکرده‌اید'
                    : 'No Assets Yet'}
                </h2>
                <p className="empty-description">
                  {searchQuery
                    ? locale === 'fa'
                      ? 'لطفاً عبارت جستجو یا فیلترهای خود را تغییر دهید.'
                      : 'Try adjusting your search query or switching categories.'
                    : locale === 'fa'
                    ? 'تصاویر، ویدیوها و خروجی‌های تولیدشده شما در استودیو به صورت خودکار در این بخش دسته‌بندی می‌شوند.'
                    : 'Creations generated in Studio, variations, and uploaded files will appear here organized by date.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="empty-actions-row">
                <Link href="/app/agent" className="button-add flagship-cta" title="Create in Studio">
                  <Sparks size={16} strokeWidth={2.2} color="currentColor" />
                  <span>{locale === 'fa' ? 'شروع تولید در استودیو' : 'Create in Studio'}</span>
                </Link>

                {searchQuery || forceEmptyState ? (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setForceEmptyState(false);
                      setActiveCategory('all');
                      setActiveSubFilter('all');
                    }}
                  >
                    <span>{locale === 'fa' ? 'مشاهده همه فایل‌ها' : 'Reset Filters'}</span>
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        ) : (
          /* ================= CONTENT STATE: GROUPED ASSETS ================= */
          <div className="groups-container">
            {groupedItems.map((group) => (
              <section key={group.key} className="assets-group">
                {/* Group Action Section (Date Badge + Quick Add Plus) */}
                <div className="group-action-section">
                  <div className="label-group">
                    {/* Date Badge */}
                    <div className="date-badge">
                      <span className="date-text">
                        {locale === 'fa' ? group.labelFa : group.labelEn}
                      </span>
                      <span className="count-pill">
                        {group.items.length}{' '}
                        {locale === 'fa' ? 'فایل' : group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Plus Icon Action */}
                    <Link
                      href="/app/agent"
                      className="plus-icon"
                      title={locale === 'fa' ? `افزودن به ${group.labelFa}` : `Create new asset`}
                      aria-label="Create new asset"
                    >
                      <Plus01 size={14} strokeWidth={2.4} color="currentColor" />
                    </Link>
                  </div>
                </div>

                {/* Cards Grid (Square 185x185px content cards from wireframe) */}
                <div className="cards-grid">
                  {group.items.map((asset) => (
                    <div key={asset.id} className="content-card">
                      <Link
                        href={`/app/assets/${asset.id}`}
                        className="card-media-anchor"
                        title={locale === 'fa' ? asset.titleFa : asset.title}
                      >
                        {/* Square Media Image (.rect-63) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.thumbnail}
                          alt={locale === 'fa' ? asset.titleFa : asset.title}
                          className="rect-63"
                          loading="lazy"
                        />
                      </Link>

                      {/* Aspect Ratio / Format Tag */}
                      <div className="card-format-tag">{asset.aspectRatio}</div>

                      {/* Favorite Icon Toggle (Wireframe .farvarite-icon) */}
                      <div className="card-icon-container">
                        <button
                          type="button"
                          className={`farvarite-icon ${asset.isFavorite ? 'favorited' : ''}`}
                          onClick={(e) => handleToggleFavorite(e, asset.id)}
                          title={locale === 'fa' ? 'علاقه‌مندی' : 'Favorite'}
                          aria-label="Toggle favorite"
                        >
                          <Heart
                            size={13}
                            strokeWidth={2}
                            color={asset.isFavorite ? '#ff3b5c' : 'currentColor'}
                            fill={asset.isFavorite ? '#ff3b5c' : 'none'}
                          />
                        </button>
                      </div>

                      {/* Floating Card Actions Bar (Hover) */}
                      <div className="card-hover-actions">
                        <button
                          type="button"
                          className="hover-action-btn"
                          onClick={() => setPreviewItem(asset)}
                          title={locale === 'fa' ? 'پیش‌نمایش بزرگ' : 'Preview'}
                          aria-label="Preview asset"
                        >
                          <Maximize01 size={13} strokeWidth={2.2} color="currentColor" />
                        </button>

                        <button
                          type="button"
                          className="hover-action-btn"
                          onClick={(e) => handleDownload(e, asset)}
                          title={locale === 'fa' ? 'دانلود' : 'Download'}
                          aria-label="Download asset"
                        >
                          <Download01 size={13} strokeWidth={2.2} color="currentColor" />
                        </button>

                        <button
                          type="button"
                          className="hover-action-btn delete-btn"
                          onClick={(e) => handleDeleteAsset(e, asset.id)}
                          title={locale === 'fa' ? 'حذف' : 'Delete'}
                          aria-label="Delete asset"
                        >
                          <Trash01 size={13} strokeWidth={2} color="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* ===== FLAGSHIP PREVIEW & LIGHTBOX MODAL ===== */}
      {previewItem && (
        <div
          className="preview-modal-overlay"
          onClick={() => setPreviewItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'fa' ? previewItem.titleFa : previewItem.title}
        >
          {/* Top Bar Navigation */}
          <div className="preview-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header-meta">
              <span className="preview-title">
                {locale === 'fa' ? previewItem.titleFa : previewItem.title}
              </span>
              <div className="preview-header-badges">
                <span className="preview-model-badge">
                  <AiCpu size={12} strokeWidth={2} color="currentColor" />
                  <span>{previewItem.model}</span>
                </span>
                <span className="preview-aspect-badge">{previewItem.aspectRatio}</span>
              </div>
            </div>

            <div className="preview-header-actions">
              <Link
                href={`/app/assets/${previewItem.id}`}
                className="btn-full-details-pill"
                title={locale === 'fa' ? 'مشاهده صفحه اختصاصی' : 'View Full Details'}
              >
                <span>{locale === 'fa' ? 'صفحه اختصاصی' : 'Full Details'}</span>
                {isRtl ? (
                  <ChevronLeft size={14} strokeWidth={2.4} color="currentColor" />
                ) : (
                  <ChevronRight size={14} strokeWidth={2.4} color="currentColor" />
                )}
              </Link>

              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setPreviewItem(null)}
                title={locale === 'fa' ? 'بستن (Esc)' : 'Close (Esc)'}
                aria-label="Close preview"
              >
                <X01 size={18} strokeWidth={2.2} color="currentColor" />
              </button>
            </div>
          </div>

          {/* Main Stage with Side Navigation Controls */}
          <div className="preview-stage-container" onClick={(e) => e.stopPropagation()}>
            {/* Prev Button */}
            {hasPrev && (
              <button
                type="button"
                className="nav-arrow-btn prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPreview();
                }}
                title={locale === 'fa' ? 'اثر قبلی' : 'Previous asset'}
                aria-label="Previous asset"
              >
                {isRtl ? (
                  <ChevronRight size={22} strokeWidth={2.4} color="currentColor" />
                ) : (
                  <ChevronLeft size={22} strokeWidth={2.4} color="currentColor" />
                )}
              </button>
            )}

            {/* Media Image Frame */}
            <div className="preview-media-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={previewItem.id}
                src={previewItem.image}
                alt={locale === 'fa' ? previewItem.titleFa : previewItem.title}
                className="preview-img-element"
              />
            </div>

            {/* Next Button */}
            {hasNext && (
              <button
                type="button"
                className="nav-arrow-btn next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPreview();
                }}
                title={locale === 'fa' ? 'اثر بعدی' : 'Next asset'}
                aria-label="Next asset"
              >
                {isRtl ? (
                  <ChevronLeft size={22} strokeWidth={2.4} color="currentColor" />
                ) : (
                  <ChevronRight size={22} strokeWidth={2.4} color="currentColor" />
                )}
              </button>
            )}
          </div>

          {/* Bottom Floating Control Dock */}
          <div className="preview-bottom-dock" onClick={(e) => e.stopPropagation()}>
            {/* Prompt Row */}
            <div className="dock-prompt-section">
              <p className="dock-prompt-text">{previewItem.prompt}</p>
              <button
                type="button"
                className="dock-copy-btn"
                onClick={(e) => handleCopyPromptText(e, previewItem.prompt)}
                title={locale === 'fa' ? 'کپی متن پرامپت' : 'Copy prompt'}
              >
                {copiedModalPrompt ? (
                  <>
                    <Check01 size={13} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                    <span>{locale === 'fa' ? 'کپی شد' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy01 size={13} strokeWidth={2} color="currentColor" />
                    <span>{locale === 'fa' ? 'کپی پرامپت' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Dock Meta & Actions Bar */}
            <div className="dock-controls-bar">
              {/* Specs Pills */}
              <div className="dock-specs-row">
                <span className="dock-spec-pill">{previewItem.dimensions}</span>
                <span className="dock-spec-pill">{previewItem.fileSize}</span>
                <span className="dock-spec-pill">{locale === 'fa' ? previewItem.createdAtFa : previewItem.createdAt}</span>
              </div>

              {/* Actions Group */}
              <div className="dock-actions-group">
                <button
                  type="button"
                  className={`dock-action-circle ${previewItem.isFavorite ? 'favorited' : ''}`}
                  onClick={(e) => handleToggleFavorite(e, previewItem.id)}
                  title={locale === 'fa' ? 'علاقه‌مندی' : 'Favorite'}
                  aria-label="Favorite asset"
                >
                  <Heart
                    size={16}
                    strokeWidth={2}
                    color={previewItem.isFavorite ? '#ff3b5c' : 'currentColor'}
                    fill={previewItem.isFavorite ? '#ff3b5c' : 'none'}
                  />
                </button>

                <button
                  type="button"
                  className="dock-action-circle"
                  onClick={(e) => handleDownload(e, previewItem)}
                  title={locale === 'fa' ? 'دانلود تصویر' : 'Download'}
                  aria-label="Download asset"
                >
                  <Download01 size={16} strokeWidth={2.2} color="currentColor" />
                </button>

                <Link
                  href={`/app/agent?remix=${encodeURIComponent(previewItem.prompt)}`}
                  className="dock-remix-flagship"
                  title={locale === 'fa' ? 'ریمیکس در استودیو' : 'Remix in Studio'}
                >
                  <Sparks size={16} strokeWidth={2.2} color="currentColor" />
                  <span>{locale === 'fa' ? 'ریمیکس در استودیو' : 'Remix in Studio'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS faithful to DOC-DS-001 & assets.html / assets-empty.html */}
      <style jsx>{`
        .assets-app-root {
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

        /* ===== MAIN BODY ===== */
        .body {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: var(--lemmo-space-800, 32px) var(--lemmo-space-900, 48px);
          max-width: 1760px;
          margin: 0 auto;
          width: 100%;
          min-height: 100dvh;
          box-sizing: border-box;
        }

        /* ===== PAGE HEADER ===== */
        .page-header {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-bottom: var(--lemmo-space-800, 32px);
          gap: 20px;
          width: 100%;
        }

        .action_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          width: 100%;
          flex-wrap: wrap;
        }

        /* Category Filter Tabs (from wireframe .tabs) */
        .tabs {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          height: 40px;
        }

        .tab-item {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .tab-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--lemmo-text-primary, #ffffff);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .tab-item.active {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(209, 254, 23, 0.3);
        }

        /* Action: Search Input + State Switcher */
        .action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          width: 440px;
          max-width: 100%;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1 1 0;
          height: 40px;
          padding: 0 14px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-pill, 9999px);
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .search-wrap:focus-within {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          background: rgba(20, 22, 24, 0.95);
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--lemmo-text-primary, #ffffff);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
        }

        .search-input::placeholder {
          color: var(--lemmo-text-muted, #727375);
        }

        .clear-search-btn {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: var(--lemmo-text-secondary, #b5b6b8);
          border-radius: 50%;
          cursor: pointer;
          padding: 0;
        }

        .clear-search-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .state-toggle-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed var(--lemmo-border-mid, rgba(255, 255, 255, 0.22));
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .state-toggle-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .state-toggle-pill.active-empty {
          background: rgba(209, 254, 23, 0.12);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* Sub-filter Rail (wireframe .filter with .filter-rect & .filter-line) */
        .filter {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 4px;
        }

        .filter::-webkit-scrollbar {
          display: none;
        }

        .filter-rect {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-muted, #898a8b);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .filter-rect:hover {
          color: var(--lemmo-text-primary, #ffffff);
          background: rgba(255, 255, 255, 0.06);
        }

        .filter-rect.active {
          background: rgba(255, 255, 255, 0.12);
          color: var(--lemmo-text-primary, #ffffff);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .filter-line {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        /* ===== EMPTY STATE VIEW ===== */
        .empty-content-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1 1 0;
          min-height: 480px;
          padding: 60px 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          max-width: 440px;
          width: 100%;
        }

        .empty-state-pic {
          display: grid;
          place-items: center;
          width: 68px;
          height: 68px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-xl, 20px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .title-subtitle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .empty-title {
          margin: 0;
          font-family: var(--lemmo-font-heading, inherit);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--lemmo-text-primary, #ffffff);
        }

        .empty-description {
          margin: 0;
          font-size: 0.84375rem;
          line-height: 1.6;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .empty-actions-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        :global(.flagship-cta) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          padding: 0 22px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.84375rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(209, 254, 23, 0.35);
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        :global(.flagship-cta:hover) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .button-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 18px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .button-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        /* ===== GROUPS CONTAINER ===== */
        .groups-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          width: 100%;
        }

        .assets-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        /* Group Action Section */
        .group-action-section {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
        }

        .label-group {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .date-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 28px;
          padding: 0 12px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-pill, 9999px);
        }

        .date-text {
          font-size: 0.78125rem;
          font-weight: 700;
          color: var(--lemmo-text-primary, #ffffff);
        }

        .count-pill {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-muted, #898a8b);
        }

        :global(.plus-icon) {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--lemmo-text-secondary, #b5b6b8);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        :global(.plus-icon:hover) {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          transform: scale(1.06);
        }

        /* Cards Grid (185x185px square content cards from wireframe) */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 185px);
          gap: 14px;
          width: 100%;
        }

        .content-card {
          position: relative;
          width: 185px;
          height: 185px;
          border-radius: var(--lemmo-radius-lg, 14px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .content-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        :global(.card-media-anchor) {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;
        }

        .rect-63 {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s ease;
        }

        .content-card:hover .rect-63 {
          transform: scale(1.05);
        }

        .card-format-tag {
          position: absolute;
          top: 8px;
          inset-inline-end: 8px;
          padding: 2px 6px;
          background: rgba(14, 16, 18, 0.7);
          backdrop-filter: blur(8px);
          border-radius: var(--lemmo-radius-xs, 4px);
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--lemmo-text-secondary, #b5b6b8);
          pointer-events: none;
        }

        /* Favorite Icon Container (.card-icon-container) */
        .card-icon-container {
          position: absolute;
          inset-inline-start: 10px;
          bottom: 10px;
          z-index: 2;
        }

        .farvarite-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          background: rgba(18, 20, 22, 0.75);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: var(--lemmo-text-primary, #ffffff);
          cursor: pointer;
          padding: 0;
          transition: all 0.15s ease;
        }

        .farvarite-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .farvarite-icon.favorited {
          border-color: rgba(255, 59, 92, 0.4);
          background: rgba(255, 59, 92, 0.15);
          color: #ff3b5c;
        }

        /* Floating Card Actions Bar (Hover) */
        .card-hover-actions {
          position: absolute;
          inset-inline-end: 10px;
          bottom: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          z-index: 2;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }

        .content-card:hover .card-hover-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .hover-action-btn {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          background: rgba(18, 20, 22, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          color: var(--lemmo-text-primary, #ffffff);
          cursor: pointer;
          padding: 0;
          transition: all 0.15s ease;
        }

        .hover-action-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .hover-action-btn.delete-btn:hover {
          background: rgba(255, 59, 92, 0.2);
          border-color: rgba(255, 59, 92, 0.5);
          color: #ff3b5c;
        }

        /* ===== FLAGSHIP PREVIEW LIGHTBOX MODAL ===== */
        .preview-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(8, 10, 12, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px 28px;
          box-sizing: border-box;
          overflow: hidden;
          animation: previewFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes previewFadeIn {
          from {
            opacity: 0;
            transform: scale(0.99);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Top Bar Navigation */
        .preview-top-bar {
          width: 100%;
          max-width: 1400px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          z-index: 10;
          flex-shrink: 0;
        }

        .preview-header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .preview-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 380px;
        }

        .preview-header-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .preview-model-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 26px;
          padding: 0 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-secondary, #b5b6b8);
        }

        .preview-aspect-badge {
          display: inline-flex;
          align-items: center;
          height: 26px;
          padding: 0 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .preview-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        :global(.btn-full-details-pill) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-primary, #ffffff);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        :global(.btn-full-details-pill:hover) {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.28);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .preview-close-btn {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preview-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.04);
        }

        /* Main Stage & Navigation */
        .preview-stage-container {
          position: relative;
          flex: 1 1 auto;
          width: 100%;
          max-width: 1400px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          margin: 16px 0;
        }

        .nav-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(20, 22, 24, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          z-index: 10;
        }

        .nav-arrow-btn:hover {
          background: rgba(30, 34, 38, 0.95);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .nav-arrow-btn.prev-btn {
          inset-inline-start: 16px;
        }

        .nav-arrow-btn.next-btn {
          inset-inline-end: 16px;
        }

        .preview-media-frame {
          max-width: calc(100% - 140px);
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: var(--lemmo-radius-lg, 16px);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #000000;
        }

        .preview-img-element {
          max-width: 100%;
          max-height: calc(100vh - 280px);
          object-fit: contain;
          display: block;
        }

        /* Bottom Floating Dock */
        .preview-bottom-dock {
          width: 100%;
          max-width: 960px;
          background: rgba(20, 22, 24, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-xl, 24px);
          padding: 14px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);
          z-index: 10;
          flex-shrink: 0;
        }

        .dock-prompt-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .dock-prompt-text {
          margin: 0;
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--lemmo-text-primary, #ffffff);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          flex: 1 1 0;
          word-break: break-word;
        }

        .dock-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 28px;
          padding: 0 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.6875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .dock-copy-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .dock-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dock-specs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .dock-spec-pill {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--lemmo-text-muted, #898a8b);
          background: rgba(255, 255, 255, 0.04);
          padding: 3px 8px;
          border-radius: var(--lemmo-radius-sm, 6px);
        }

        .dock-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-inline-start: auto;
        }

        .dock-action-circle {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dock-action-circle:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .dock-action-circle.favorited {
          color: #ff3b5c;
          border-color: rgba(255, 59, 92, 0.4);
          background: rgba(255, 59, 92, 0.12);
        }

        :global(.dock-remix-flagship) {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 34px;
          padding: 0 14px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 10px rgba(209, 254, 23, 0.3);
        }

        :global(.dock-remix-flagship:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(209, 254, 23, 0.45);
          filter: brightness(1.05);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .body {
            padding: var(--lemmo-space-600, 24px);
          }
          .action_section {
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .body {
            padding: 16px 16px 48px;
          }

          .action_section {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .action {
            order: 1;
            width: 100%;
          }

          .tabs {
            order: 2;
            overflow-x: auto;
            flex-wrap: nowrap;
            width: 100%;
            scrollbar-width: none;
            padding-bottom: 4px;
          }

          .tabs::-webkit-scrollbar {
            display: none;
          }

          .tab-item {
            flex-shrink: 0;
            height: 36px;
            padding: 0 14px;
          }

          /* Fluid 2-column square grid on mobile */
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .content-card {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
          }

          .card-hover-actions {
            opacity: 1;
            transform: translateY(0);
          }

          /* Modal responsive */
          .preview-modal-overlay {
            padding: 12px 12px 16px;
          }

          .preview-title {
            max-width: 140px;
            font-size: 0.8125rem;
          }

          .preview-header-badges {
            display: none;
          }

          .nav-arrow-btn {
            width: 36px;
            height: 36px;
          }

          .nav-arrow-btn.prev-btn {
            inset-inline-start: 4px;
          }

          .nav-arrow-btn.next-btn {
            inset-inline-end: 4px;
          }

          .preview-media-frame {
            max-width: 100%;
          }

          .preview-img-element {
            max-height: calc(100vh - 270px);
          }

          .preview-bottom-dock {
            padding: 12px 14px;
            border-radius: var(--lemmo-radius-lg, 16px);
            gap: 10px;
          }

          .dock-prompt-text {
            font-size: 0.75rem;
            -webkit-line-clamp: 1;
          }

          .dock-controls-bar {
            gap: 10px;
          }

          .dock-specs-row {
            display: none;
          }

          .dock-actions-group {
            width: 100%;
            justify-content: space-between;
          }

          :global(.dock-remix-flagship) {
            flex: 1 1 auto;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
