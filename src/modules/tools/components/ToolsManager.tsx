'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Search01,
  FilterFunnel,
  X01,
  Sparks,
  AiMagicWand01,
  ScissorsCut,
  LayersThree,
  AiCpu,
  AiCamera,
  ChevronLeft,
  ChevronRight,
  Maximize01,
  FolderUpload,
} from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { ToolItem, ToolCategory } from '../types';
import { MOCK_TOOLS } from '../data/mockTools';

interface ToolsManagerProps {
  initialToolId?: string;
}

const CATEGORY_TABS: { key: ToolCategory; labelEn: string; labelFa: string }[] = [
  { key: 'all', labelEn: 'All', labelFa: 'همه' },
  { key: 'vision', labelEn: 'AI Vision', labelFa: 'بینایی هوش مصنوعی' },
  { key: 'editing', labelEn: 'Editing', labelFa: 'ویرایش تصویر' },
  { key: 'depth', labelEn: '3D & Depth', labelFa: 'سه‌بعدی و عمق' },
  { key: 'generative', labelEn: 'Generative', labelFa: 'مدل‌های مولد' },
];

export default function ToolsManager({ initialToolId }: ToolsManagerProps) {
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolItem>(() => {
    if (initialToolId) {
      const found = MOCK_TOOLS.find((t) => t.id === initialToolId);
      if (found) return found;
    }
    return MOCK_TOOLS[0];
  });
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);

  // Position references for the popover-style preview
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [previewTop, setPreviewTop] = useState<number>(40);
  const [arrowTop, setArrowTop] = useState<number>(60);

  // Dynamically calculate and align the preview popover to the active card
  const updatePosition = useCallback((toolId: string) => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth <= 900) return;

    const cardEl = cardRefs.current.get(toolId);
    if (!cardEl) return;

    const cardRect = cardEl.getBoundingClientRect();
    const cardCenter = cardRect.top + cardRect.height / 2;
    const popupHeight = previewCardRef.current?.offsetHeight || 440;
    const viewportHeight = window.innerHeight;
    const minTop = 20;
    const maxTop = Math.max(minTop, viewportHeight - popupHeight - 20);

    let targetTop = cardCenter - popupHeight / 2;

    // For tools near bottom of screen: align bottom of preview card with bottom of tool card
    if (cardRect.bottom > viewportHeight * 0.65 || targetTop > maxTop) {
      targetTop = cardRect.bottom - popupHeight;
    } else if (cardRect.top < viewportHeight * 0.25 || targetTop < minTop) {
      // For tools near top: align top of preview card with top of tool card
      targetTop = cardRect.top;
    }

    // Clamp within viewport
    const finalTop = Math.max(minTop, Math.min(targetTop, maxTop));
    setPreviewTop(finalTop);

    // Arrow indicator position relative to preview card top, pointing at card center
    const targetArrow = cardCenter - finalTop;
    const clampedArrow = Math.max(26, Math.min(targetArrow, popupHeight - 26));
    setArrowTop(clampedArrow);
  }, []);

  // Update position on tool change or list changes
  useEffect(() => {
    updatePosition(selectedTool.id);
  }, [selectedTool, updatePosition]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => updatePosition(selectedTool.id);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTool, updatePosition]);

  // Close bottom sheet & dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileBottomSheetOpen(false);
        setFilterMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    return MOCK_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesQuery =
        tool.name.toLowerCase().includes(query) ||
        tool.nameFa.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.descriptionFa.toLowerCase().includes(query) ||
        tool.categoryLabel.toLowerCase().includes(query) ||
        tool.categoryLabelFa.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const recentTools = useMemo(
    () => filteredTools.filter((t) => t.isRecent),
    [filteredTools]
  );
  const allOtherTools = useMemo(
    () => filteredTools.filter((t) => !t.isRecent),
    [filteredTools]
  );

  const renderToolIcon = (iconName: ToolItem['iconName']) => {
    switch (iconName) {
      case 'scissors':
        return <ScissorsCut size={18} strokeWidth={2} color="currentColor" />;
      case 'wand':
        return <AiMagicWand01 size={18} strokeWidth={2} color="currentColor" />;
      case 'layers':
        return <LayersThree size={18} strokeWidth={2} color="currentColor" />;
      case 'camera':
        return <AiCamera size={18} strokeWidth={2} color="currentColor" />;
      case 'spark':
        return <Sparks size={18} strokeWidth={2} color="currentColor" />;
      default:
        return <AiCpu size={18} strokeWidth={2} color="currentColor" />;
    }
  };

  const handleCardHover = (tool: ToolItem) => {
    setSelectedTool(tool);
    updatePosition(tool.id);
  };

  const handleToolClick = (tool: ToolItem) => {
    setSelectedTool(tool);
    updatePosition(tool.id);
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      setMobileBottomSheetOpen(true);
    }
  };

  const clearActiveCategoryFilter = () => {
    setSelectedCategory('all');
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const activeCategoryObj = CATEGORY_TABS.find((c) => c.key === selectedCategory);

  return (
    <div className="tools-engine-root" dir={dir}>
      {/* ===== TOOLS DRAWER PANEL ===== */}
      <aside className="tools-drawer-aside" aria-label="AI Tools Library">
        {/* Header (Title & Active Count - no hide toggle as requested) */}
        <div className="drawer-header">
          <div className="drawer-header-title-wrap">
            <h1 className="drawer-header-title">
              {locale === 'fa' ? 'ابزارهای هوش مصنوعی' : 'AI Tools'}
            </h1>
            <span className="drawer-header-badge">
              {locale === 'fa'
                ? `${filteredTools.length} فعال`
                : `${filteredTools.length} active`}
            </span>
          </div>
        </div>

        {/* Search Bar & Filter Action Row */}
        <div className="drawer-search-filter-section">
          <div className="search-filter-row">
            <div className="search-input-box">
              <Search01
                size={16}
                strokeWidth={2.2}
                color="var(--lemmo-text-muted, #898a8b)"
              />
              <input
                type="text"
                className="search-input-field"
                placeholder={
                  locale === 'fa'
                    ? 'جستجوی ابزار، مدل یا قابلیت...'
                    : 'Search tools, models, pipelines...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tools"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title={locale === 'fa' ? 'پاک کردن جستجو' : 'Clear search'}
                >
                  <X01 size={13} strokeWidth={2.2} color="currentColor" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              className={`filter-icon-btn ${filterMenuOpen || selectedCategory !== 'all' ? 'active' : ''}`}
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              title={locale === 'fa' ? 'فیلتر دسته‌بندی' : 'Filter categories'}
              aria-label="Filter categories"
              aria-expanded={filterMenuOpen}
            >
              <FilterFunnel size={16} strokeWidth={2.2} color="currentColor" />
              {selectedCategory !== 'all' && <span className="filter-active-dot" />}
            </button>
          </div>

          {/* Collapsible Category Tag Dropdown */}
          {filterMenuOpen && (
            <div className="category-tags-dropdown">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`category-tag-pill ${selectedCategory === tab.key ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(tab.key);
                    setFilterMenuOpen(false);
                  }}
                >
                  {locale === 'fa' ? tab.labelFa : tab.labelEn}
                </button>
              ))}
            </div>
          )}

          {/* Active Filter Tags Row with Close action */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="active-filters-row">
              {selectedCategory !== 'all' && activeCategoryObj && (
                <div className="active-filter-chip">
                  <span className="filter-chip-text">
                    {locale === 'fa'
                      ? activeCategoryObj.labelFa
                      : activeCategoryObj.labelEn}
                  </span>
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={clearActiveCategoryFilter}
                    title={locale === 'fa' ? 'حذف این فیلتر' : 'Remove filter'}
                  >
                    <X01 size={12} strokeWidth={2.4} color="currentColor" />
                  </button>
                </div>
              )}

              {searchQuery && (
                <div className="active-filter-chip">
                  <span className="filter-chip-text">
                    {`"${searchQuery}"`}
                  </span>
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={() => setSearchQuery('')}
                    title={locale === 'fa' ? 'حذف جستجو' : 'Clear search'}
                  >
                    <X01 size={12} strokeWidth={2.4} color="currentColor" />
                  </button>
                </div>
              )}

              <button
                type="button"
                className="clear-all-text-btn"
                onClick={clearAllFilters}
              >
                {locale === 'fa' ? 'حذف همه' : 'Reset'}
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Tools Panel Content */}
        <div
          className="drawer-scroll-container"
          onScroll={() => updatePosition(selectedTool.id)}
        >
          {/* Featured Showcase / Tutorial Banner */}
          <div className="tutorial-banner-card">
            <div className="tutorial-badge">
              <Sparks
                size={13}
                strokeWidth={2.2}
                color="var(--lemmo-surface-brand-background, #d1fe17)"
              />
              <span>{locale === 'fa' ? 'پایپ‌لاین ابزارها' : 'Canvas Pipelines'}</span>
            </div>
            <h3 className="tutorial-title">
              {locale === 'fa'
                ? 'زنجیره‌سازی ابزارهای هوش مصنوعی بر بستر بوم'
                : 'Chain and run AI tools live on Canvas'}
            </h3>
            <p className="tutorial-desc">
              {locale === 'fa'
                ? 'ابزارها را روی هر لایه تصویر ترکیب کرده و با یک کلیک خروجی بگیرید.'
                : 'Combine vision, inpainting, and upscaling directly inside your node workspace.'}
            </p>
            <Link href="/app/canvas" className="tutorial-cta-link">
              <span>{locale === 'fa' ? 'ورود به محیط بوم' : 'Launch Canvas'}</span>
              {isRtl ? (
                <ChevronLeft size={13} strokeWidth={2.4} color="currentColor" />
              ) : (
                <ChevronRight size={13} strokeWidth={2.4} color="currentColor" />
              )}
            </Link>
          </div>

          {/* Recent Tools Section */}
          {recentTools.length > 0 && (
            <div className="tools-section-block">
              <div className="section-label-header">
                <span className="section-label-title">
                  {locale === 'fa' ? 'ابزارهای اخیر' : 'Recent Tools'}
                </span>
                <span className="section-label-count">{recentTools.length}</span>
              </div>
              <div className="tools-cards-list">
                {recentTools.map((tool) => {
                  const isSelected = selectedTool.id === tool.id;
                  return (
                    <div
                      key={tool.id}
                      ref={(el) => {
                        if (el) cardRefs.current.set(tool.id, el);
                        else cardRefs.current.delete(tool.id);
                      }}
                      className={`tool-card-item ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => handleCardHover(tool)}
                      onClick={() => handleToolClick(tool)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="tool-card-icon-box">
                        {renderToolIcon(tool.iconName)}
                      </div>
                      <div className="tool-card-details">
                        <div className="tool-card-title-row">
                          <span className="tool-card-name">
                            {locale === 'fa' ? tool.nameFa : tool.name}
                          </span>
                          <span className="tool-card-rating">
                            {tool.rating} ★
                          </span>
                        </div>
                        <div className="tool-card-meta-row">
                          <span className="tool-card-category-tag">
                            {locale === 'fa' ? tool.categoryLabelFa : tool.categoryLabel}
                          </span>
                          <span className="tool-card-dot" />
                          <span className="tool-card-version">{tool.version}</span>
                        </div>
                      </div>
                      <div className="tool-card-indicator" aria-hidden="true">
                        {isRtl ? (
                          <ChevronLeft size={13} strokeWidth={2.2} color="currentColor" />
                        ) : (
                          <ChevronRight size={13} strokeWidth={2.2} color="currentColor" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tools Section */}
          <div className="tools-section-block">
            <div className="section-label-header">
              <span className="section-label-title">
                {locale === 'fa' ? 'همه ابزارها' : 'All Tools'}
              </span>
              <span className="section-label-count">{allOtherTools.length}</span>
            </div>

            {filteredTools.length === 0 ? (
              <div className="tools-empty-filter">
                <p className="empty-filter-text">
                  {locale === 'fa'
                    ? 'هیچ ابزاری با مشخصات انتخابی یافت نشد.'
                    : 'No tools match your active filter.'}
                </p>
                <button
                  type="button"
                  className="empty-filter-reset-btn"
                  onClick={clearAllFilters}
                >
                  {locale === 'fa' ? 'نمایش همه ابزارها' : 'Show all tools'}
                </button>
              </div>
            ) : (
              <div className="tools-cards-list">
                {allOtherTools.map((tool) => {
                  const isSelected = selectedTool.id === tool.id;
                  return (
                    <div
                      key={tool.id}
                      ref={(el) => {
                        if (el) cardRefs.current.set(tool.id, el);
                        else cardRefs.current.delete(tool.id);
                      }}
                      className={`tool-card-item ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => handleCardHover(tool)}
                      onClick={() => handleToolClick(tool)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="tool-card-icon-box">
                        {renderToolIcon(tool.iconName)}
                      </div>
                      <div className="tool-card-details">
                        <div className="tool-card-title-row">
                          <span className="tool-card-name">
                            {locale === 'fa' ? tool.nameFa : tool.name}
                          </span>
                          <span className="tool-card-rating">
                            {tool.rating} ★
                          </span>
                        </div>
                        <div className="tool-card-meta-row">
                          <span className="tool-card-category-tag">
                            {locale === 'fa' ? tool.categoryLabelFa : tool.categoryLabel}
                          </span>
                          <span className="tool-card-dot" />
                          <span className="tool-card-version">{tool.version}</span>
                        </div>
                      </div>
                      <div className="tool-card-indicator" aria-hidden="true">
                        {isRtl ? (
                          <ChevronLeft size={13} strokeWidth={2.2} color="currentColor" />
                        ) : (
                          <ChevronRight size={13} strokeWidth={2.2} color="currentColor" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ===== CANVAS STAGE & FLOATING DETAIL CARD (DESKTOP) ===== */}
      <main className="tools-canvas-stage">
        <div className="canvas-grid-dots" />

        {/* Floating Tool Detail Popup Card (Desktop - Popover aligned to card) */}
        {selectedTool && (
          <div
            ref={previewCardRef}
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
                src={selectedTool.coverImage}
                alt={locale === 'fa' ? selectedTool.nameFa : selectedTool.name}
                className="card-cover-img"
              />
              <div className="card-cover-overlay-gradient" />
              <div className="card-cover-badges">
                <span className="cover-badge-category">
                  {locale === 'fa'
                    ? selectedTool.categoryLabelFa
                    : selectedTool.categoryLabel}
                </span>
                <span className="cover-badge-version">{selectedTool.version}</span>
              </div>
            </div>

            {/* Title & Rating */}
            <div className="card-header-content">
              <div className="card-title-row">
                <h2 className="card-tool-title">
                  {locale === 'fa' ? selectedTool.nameFa : selectedTool.name}
                </h2>
                <div className="card-rating-pill">
                  <span>{selectedTool.rating}</span>
                  <span className="star-char">★</span>
                </div>
              </div>
              <p className="card-tool-tagline">
                {locale === 'fa' ? selectedTool.taglineFa : selectedTool.tagline}
              </p>
            </div>

            {/* Author / Engine Meta */}
            <div className="card-author-row">
              <div className="card-author-avatar">
                <AiCpu size={14} strokeWidth={2.2} color="currentColor" />
              </div>
              <div className="card-author-meta">
                <span className="card-author-name">
                  {locale === 'fa' ? selectedTool.authorFa : selectedTool.author}
                </span>
                <span className="card-author-badge">
                  {locale === 'fa' ? 'تأیید شده' : 'Verified Engine'}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="card-description-section">
              <p className="card-description-text">
                {locale === 'fa'
                  ? selectedTool.descriptionFa
                  : selectedTool.description}
              </p>
            </div>

            {/* Technical Specs Pills */}
            <div className="card-specs-row">
              <div className="spec-pill">
                <span className="spec-pill-label">{locale === 'fa' ? 'ورودی:' : 'Input:'}</span>
                <span className="spec-pill-value">{locale === 'fa' ? selectedTool.inputsFa : selectedTool.inputs}</span>
              </div>
              <div className="spec-pill">
                <span className="spec-pill-label">{locale === 'fa' ? 'سرعت:' : 'Speed:'}</span>
                <span className="spec-pill-value">{locale === 'fa' ? selectedTool.speedFa : selectedTool.speed}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions-footer">
              <Link
                href={`/app/canvas?tool=${encodeURIComponent(selectedTool.id)}`}
                className="btn-add-to-canvas"
                title={locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}
              >
                <Maximize01 size={15} strokeWidth={2.2} color="currentColor" />
                <span>{locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}</span>
              </Link>

              <Link
                href={`/app/agent?tool=${encodeURIComponent(selectedTool.id)}`}
                className="btn-quick-run-studio"
                title={locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}
              >
                <Sparks size={14} strokeWidth={2.2} color="currentColor" />
                <span>{locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Center Canvas Dropzone / Workspace Helper */}
        <div className="canvas-center-workspace">
          <div className="canvas-dropzone-box">
            <div className="dropzone-icon-ring">
              <FolderUpload size={28} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
            </div>
            <h3 className="dropzone-title">
              {locale === 'fa'
                ? 'فضای تعاملی ابزارهای بوم'
                : 'Interactive Tool Sandbox'}
            </h3>
            <p className="dropzone-subtitle">
              {locale === 'fa'
                ? `ابزار «${selectedTool ? selectedTool.nameFa : ''}» آماده اجراست. برای ایجاد پروژه کامل، بوم را باز کنید.`
                : `Tool "${selectedTool ? selectedTool.name : ''}" is ready. Launch Canvas to chain and edit layers.`}
            </p>
            <Link href="/app/canvas" className="dropzone-launch-btn">
              <span>{locale === 'fa' ? 'ایجاد پروژه در بوم' : 'Open in Canvas'}</span>
              {isRtl ? (
                <ChevronLeft size={14} strokeWidth={2.2} color="currentColor" />
              ) : (
                <ChevronRight size={14} strokeWidth={2.2} color="currentColor" />
              )}
            </Link>
          </div>
        </div>
      </main>

      {/* ===== MOBILE BOTTOM SHEET MODAL ===== */}
      {mobileBottomSheetOpen && selectedTool && (
        <div
          className="mobile-sheet-overlay"
          onClick={() => setMobileBottomSheetOpen(false)}
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
              onClick={() => setMobileBottomSheetOpen(false)}
              aria-label="Close details"
            >
              <X01 size={18} strokeWidth={2.2} color="currentColor" />
            </button>

            {/* Sheet Cover */}
            <div className="sheet-cover-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedTool.coverImage}
                alt={locale === 'fa' ? selectedTool.nameFa : selectedTool.name}
                className="sheet-cover-img"
              />
              <div className="sheet-cover-badges">
                <span className="cover-badge-category">
                  {locale === 'fa'
                    ? selectedTool.categoryLabelFa
                    : selectedTool.categoryLabel}
                </span>
                <span className="cover-badge-version">{selectedTool.version}</span>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="sheet-title-group">
              <div className="card-title-row">
                <h2 className="sheet-tool-title">
                  {locale === 'fa' ? selectedTool.nameFa : selectedTool.name}
                </h2>
                <span className="card-rating-pill">
                  {selectedTool.rating} ★
                </span>
              </div>
              <p className="sheet-tool-tagline">
                {locale === 'fa' ? selectedTool.taglineFa : selectedTool.tagline}
              </p>
            </div>

            {/* Author */}
            <div className="card-author-row">
              <div className="card-author-avatar">
                <AiCpu size={14} strokeWidth={2.2} color="currentColor" />
              </div>
              <span className="card-author-name">
                {locale === 'fa' ? selectedTool.authorFa : selectedTool.author}
              </span>
            </div>

            {/* Description */}
            <p className="sheet-desc-text">
              {locale === 'fa' ? selectedTool.descriptionFa : selectedTool.description}
            </p>

            {/* Specs */}
            <div className="card-specs-row">
              <div className="spec-pill">
                <span className="spec-pill-label">{locale === 'fa' ? 'ورودی:' : 'Input:'}</span>
                <span className="spec-pill-value">{locale === 'fa' ? selectedTool.inputsFa : selectedTool.inputs}</span>
              </div>
              <div className="spec-pill">
                <span className="spec-pill-label">{locale === 'fa' ? 'سرعت:' : 'Speed:'}</span>
                <span className="spec-pill-value">{locale === 'fa' ? selectedTool.speedFa : selectedTool.speed}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sheet-actions-stack">
              <Link
                href={`/app/canvas?tool=${encodeURIComponent(selectedTool.id)}`}
                className="btn-add-to-canvas full-width"
              >
                <Maximize01 size={16} strokeWidth={2.2} color="currentColor" />
                <span>{locale === 'fa' ? 'افزودن به بوم' : 'Add to Canvas'}</span>
              </Link>
              <Link
                href={`/app/agent?tool=${encodeURIComponent(selectedTool.id)}`}
                className="btn-quick-run-studio full-width"
              >
                <Sparks size={15} strokeWidth={2.2} color="currentColor" />
                <span>{locale === 'fa' ? 'تست در استودیو' : 'Run in Studio'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== SCOPED STYLING WITH TOKENS ===== */}
      <style jsx>{`
        .tools-engine-root {
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 100dvh;
          height: 100dvh;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-text-primary, #ffffff);
          overflow: hidden;
          position: relative;
        }

        /* ===== TOOLS DRAWER (SIDE PANEL) ===== */
        .tools-drawer-aside {
          width: 370px;
          min-width: 370px;
          height: 100dvh;
          background: var(--lemmo-surface-primary-background, #17191b);
          border-inline-end: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          display: flex;
          flex-direction: column;
          z-index: 20;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.35);
          position: relative;
        }

        /* Drawer Header */
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        .drawer-header-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drawer-header-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .drawer-header-badge {
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(209, 254, 23, 0.1);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border: 1px solid rgba(209, 254, 23, 0.25);
        }

        /* Search & Filter Section */
        .drawer-search-filter-section {
          padding: 14px 18px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          position: relative;
        }

        .search-filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .search-input-box {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1 1 0;
          height: 38px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--lemmo-radius-pill, 9999px);
          padding: 0 14px;
          transition: all 0.15s ease;
        }

        .search-input-box:focus-within {
          border-color: rgba(209, 254, 23, 0.4);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 2px rgba(209, 254, 23, 0.12);
        }

        .search-input-field {
          flex: 1 1 0;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.8125rem;
        }

        .search-input-field::placeholder {
          color: var(--lemmo-text-muted, #898a8b);
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: var(--lemmo-text-muted, #898a8b);
          cursor: pointer;
          display: grid;
          place-items: center;
          padding: 2px;
        }

        .search-clear-btn:hover {
          color: #ffffff;
        }

        .filter-icon-btn {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          flex-shrink: 0;
        }

        .filter-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.18);
        }

        .filter-icon-btn.active {
          background: rgba(209, 254, 23, 0.12);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border-color: rgba(209, 254, 23, 0.35);
        }

        .filter-active-dot {
          position: absolute;
          top: 6px;
          inset-inline-end: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* Dropdown tag menu */
        .category-tags-dropdown {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px 10px;
          background: rgba(20, 22, 24, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-lg, 12px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          animation: menuSlideDown 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-tag-pill {
          padding: 5px 11px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--lemmo-text-secondary, #b5b6b8);
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .category-tag-pill:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .category-tag-pill.active {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: #131517;
          font-weight: 700;
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* Active Filter Chips */
        .active-filters-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 2px;
        }

        .active-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 26px;
          padding: 0 10px;
          background: rgba(209, 254, 23, 0.12);
          border: 1px solid rgba(209, 254, 23, 0.3);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-size: 0.6875rem;
          font-weight: 600;
        }

        .filter-chip-remove {
          background: transparent;
          border: none;
          color: currentColor;
          cursor: pointer;
          display: grid;
          place-items: center;
          padding: 0;
          margin-inline-start: 2px;
        }

        .filter-chip-remove:hover {
          opacity: 0.7;
        }

        .clear-all-text-btn {
          background: transparent;
          border: none;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: 0.6875rem;
          font-family: inherit;
          cursor: pointer;
          text-decoration: underline;
          padding: 2px 4px;
        }

        .clear-all-text-btn:hover {
          color: #ffffff;
        }

        /* Drawer Scroll Area */
        .drawer-scroll-container {
          flex: 1 1 auto;
          overflow-y: auto;
          padding: 16px 18px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          scrollbar-width: thin;
        }

        /* Showcase Banner */
        .tutorial-banner-card {
          padding: 16px;
          border-radius: var(--lemmo-radius-xl, 16px);
          background: linear-gradient(135deg, rgba(30, 33, 37, 0.95), rgba(18, 20, 22, 0.98));
          border: 1px solid rgba(209, 254, 23, 0.18);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .tutorial-banner-card::before {
          content: '';
          position: absolute;
          top: -40px;
          inset-inline-end: -40px;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(209, 254, 23, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .tutorial-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .tutorial-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.35;
        }

        .tutorial-desc {
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
          line-height: 1.45;
        }

        :global(.tutorial-cta-link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          text-decoration: none;
          transition: gap 0.15s ease;
        }

        :global(.tutorial-cta-link:hover) {
          gap: 9px;
        }

        /* Section Block */
        .tools-section-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-label-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
        }

        .section-label-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--lemmo-text-muted, #898a8b);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .section-label-count {
          font-size: 0.6875rem;
          color: var(--lemmo-text-muted, #898a8b);
          background: rgba(255, 255, 255, 0.05);
          padding: 1px 6px;
          border-radius: var(--lemmo-radius-pill, 9999px);
        }

        /* Tool Card List */
        .tools-cards-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Clean, refined card styling without distracting lines */
        .tool-card-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--lemmo-radius-lg, 12px);
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .tool-card-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .tool-card-item.selected {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
        }

        .tool-card-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--lemmo-radius-md, 10px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: grid;
          place-items: center;
          color: var(--lemmo-text-secondary, #b5b6b8);
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .tool-card-item:hover .tool-card-icon-box {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.09);
        }

        .tool-card-item.selected .tool-card-icon-box {
          background: rgba(209, 254, 23, 0.14);
          border-color: rgba(209, 254, 23, 0.35);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .tool-card-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1 1 0;
          min-width: 0;
        }

        .tool-card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .tool-card-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--lemmo-text-secondary, #cccccc);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.15s ease;
        }

        .tool-card-item:hover .tool-card-name,
        .tool-card-item.selected .tool-card-name {
          color: #ffffff;
          font-weight: 700;
        }

        .tool-card-rating {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #ffd028;
          flex-shrink: 0;
        }

        .tool-card-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tool-card-category-tag {
          font-size: 0.6875rem;
          color: var(--lemmo-text-secondary, #898a8b);
        }

        .tool-card-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .tool-card-version {
          font-size: 0.625rem;
          color: var(--lemmo-text-muted, #707275);
        }

        .tool-card-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-text-muted, #707275);
          opacity: 0;
          transform: translateX(${isRtl ? '4px' : '-4px'});
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .tool-card-item:hover .tool-card-indicator {
          opacity: 0.5;
          transform: translateX(0);
        }

        .tool-card-item.selected .tool-card-indicator {
          opacity: 1;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          transform: translateX(0);
        }

        .tools-empty-filter {
          padding: 24px 16px;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .empty-filter-text {
          font-size: 0.75rem;
          color: var(--lemmo-text-muted, #898a8b);
          margin-bottom: 10px;
        }

        .empty-filter-reset-btn {
          padding: 6px 14px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.6875rem;
          cursor: pointer;
        }

        /* ===== CANVAS STAGE & FLOATING PREVIEW (DESKTOP) ===== */
        .tools-canvas-stage {
          flex: 1 1 0;
          height: 100dvh;
          background: #0d0f11;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .canvas-grid-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* Floating Tool Detail Popup Card (Popover style) */
        .tools-floating-preview-card {
          position: absolute;
          inset-inline-start: 16px;
          width: 345px;
          background: rgba(20, 23, 26, 0.94);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-xl, 20px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          box-sizing: border-box;
          z-index: 10;
          transition: top 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Popover Arrow Indicator */
        .preview-arrow-indicator {
          position: absolute;
          inset-inline-start: -7px;
          width: 12px;
          height: 12px;
          background: #14171a;
          transition: top 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
          pointer-events: none;
        }

        :global([dir="ltr"]) .preview-arrow-indicator {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          border-left: 1px solid rgba(255, 255, 255, 0.14);
          transform: translateY(-50%) rotate(-45deg);
        }

        :global([dir="rtl"]) .preview-arrow-indicator {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          border-right: 1px solid rgba(255, 255, 255, 0.14);
          transform: translateY(-50%) rotate(45deg);
        }

        .card-cover-container {
          width: 100%;
          height: 165px;
          border-radius: var(--lemmo-radius-lg, 14px);
          overflow: hidden;
          position: relative;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .card-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-cover-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.65) 100%);
          pointer-events: none;
        }

        .card-cover-badges {
          position: absolute;
          top: 10px;
          inset-inline-start: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cover-badge-category {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .cover-badge-version {
          font-size: 0.625rem;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(209, 254, 23, 0.2);
          border: 1px solid rgba(209, 254, 23, 0.4);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .card-header-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .card-tool-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
        }

        .card-rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #ffd028;
          background: rgba(255, 208, 40, 0.12);
          border: 1px solid rgba(255, 208, 40, 0.25);
          padding: 2px 7px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          flex-shrink: 0;
        }

        .star-char {
          font-size: 0.625rem;
        }

        .card-tool-tagline {
          font-size: 0.75rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
          line-height: 1.4;
        }

        .card-author-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-author-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: grid;
          place-items: center;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .card-author-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-author-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: #ffffff;
        }

        .card-author-badge {
          font-size: 0.625rem;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .card-description-section {
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--lemmo-radius-md, 10px);
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-description-text {
          font-size: 0.75rem;
          line-height: 1.45;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
        }

        .card-specs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .spec-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--lemmo-radius-sm, 6px);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 0.6875rem;
        }

        .spec-pill-label {
          color: var(--lemmo-text-muted, #898a8b);
        }

        .spec-pill-value {
          color: #ffffff;
          font-weight: 600;
        }

        .card-actions-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 2px;
        }

        :global(.btn-add-to-canvas) {
          flex: 1 1 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          height: 34px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: #131517;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 10px rgba(209, 254, 23, 0.3);
        }

        :global(.btn-add-to-canvas:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(209, 254, 23, 0.45);
          filter: brightness(1.05);
        }

        :global(.btn-quick-run-studio) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          padding: 0 12px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        :global(.btn-quick-run-studio:hover) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        /* Center Canvas Sandbox / Dropzone */
        .canvas-center-workspace {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-inline-start: 380px;
          z-index: 1;
        }

        .canvas-dropzone-box {
          max-width: 440px;
          padding: 36px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          border-radius: var(--lemmo-radius-xl, 24px);
          background: rgba(20, 22, 25, 0.6);
          border: 1.5px dashed rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
        }

        .canvas-dropzone-box:hover {
          border-color: rgba(209, 254, 23, 0.35);
          background: rgba(25, 28, 32, 0.7);
        }

        .dropzone-icon-ring {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(209, 254, 23, 0.1);
          border: 1px solid rgba(209, 254, 23, 0.25);
          display: grid;
          place-items: center;
        }

        .dropzone-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .dropzone-subtitle {
          font-size: 0.8125rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
          line-height: 1.5;
        }

        :global(.dropzone-launch-btn) {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 18px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 6px;
        }

        :global(.dropzone-launch-btn:hover) {
          background: rgba(255, 255, 255, 0.16);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          border-color: rgba(209, 254, 23, 0.4);
        }

        /* ===== MOBILE BOTTOM SHEET MODAL ===== */
        .mobile-sheet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: sheetFadeIn 0.2s ease-out;
        }

        @keyframes sheetFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-bottom-sheet {
          width: 100%;
          max-width: 500px;
          max-height: 88vh;
          overflow-y: auto;
          background: #181a1d;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: none;
          padding: 16px 20px 28px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
          animation: sheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes sheetSlideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .sheet-drag-handle-bar {
          width: 40px;
          height: 4px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.2);
          align-self: center;
          margin-bottom: 4px;
        }

        .sheet-close-btn {
          position: absolute;
          top: 14px;
          inset-inline-end: 16px;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          cursor: pointer;
        }

        .sheet-cover-frame {
          width: 100%;
          height: 190px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background: #000000;
        }

        .sheet-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sheet-cover-badges {
          position: absolute;
          top: 10px;
          inset-inline-start: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sheet-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sheet-tool-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .sheet-tool-tagline {
          font-size: 0.8125rem;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
        }

        .sheet-desc-text {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--lemmo-text-secondary, #b5b6b8);
          margin: 0;
        }

        .sheet-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 8px;
        }

        :global(.btn-add-to-canvas.full-width),
        :global(.btn-quick-run-studio.full-width) {
          width: 100%;
        }

        /* ===== RESPONSIVE STYLING ===== */
        @media (max-width: 1200px) {
          .canvas-center-workspace {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .tools-engine-root {
            flex-direction: column;
            height: auto;
            min-height: 100dvh;
            overflow-y: auto;
          }

          .tools-drawer-aside {
            width: 100%;
            min-width: 100%;
            height: auto;
            min-height: 100dvh;
            border-inline-end: none;
            box-shadow: none;
          }

          .tools-canvas-stage {
            display: none;
          }

          .drawer-header {
            padding: 16px 16px 12px;
          }

          .drawer-search-filter-section {
            padding: 12px 16px 10px;
          }

          .drawer-scroll-container {
            padding: 14px 16px 40px;
          }

          .tools-cards-list {
            gap: 10px;
          }

          .tool-card-item {
            padding: 12px 14px;
          }

          .tool-card-icon-box {
            width: 42px;
            height: 42px;
          }

          .tool-card-name {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
