'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { ToolItem, ToolCategory } from '../types';
import { MOCK_TOOLS } from '../data/mockTools';
import {
  ToolDrawerHeader,
  ToolSearchFilter,
  ToolTutorialBanner,
  ToolListSection,
  ToolPreviewCard,
  ToolCanvasDropzone,
  ToolMobileBottomSheet,
} from './';

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

  const handleRegisterRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  };

  const clearActiveCategoryFilter = () => {
    setSelectedCategory('all');
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="tools-engine-root" dir={dir}>
      {/* ===== TOOLS DRAWER PANEL ===== */}
      <aside className="tools-drawer-aside" aria-label="AI Tools Library">
        {/* Header (Title & Active Count) */}
        <ToolDrawerHeader
          count={filteredTools.length}
          locale={locale}
        />

        {/* Search Bar & Filter Action Row */}
        <ToolSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setFilterMenuOpen(false);
          }}
          filterMenuOpen={filterMenuOpen}
          onToggleFilterMenu={() => setFilterMenuOpen(!filterMenuOpen)}
          onClearCategoryFilter={clearActiveCategoryFilter}
          onClearAllFilters={clearAllFilters}
          locale={locale}
          categoryTabs={CATEGORY_TABS}
        />

        {/* Scrollable Tools Panel Content */}
        <div
          className="drawer-scroll-container"
          onScroll={() => updatePosition(selectedTool.id)}
        >
          {/* Featured Showcase / Tutorial Banner */}
          <ToolTutorialBanner locale={locale} isRtl={isRtl} />

          {/* Recent Tools Section */}
          {recentTools.length > 0 && (
            <ToolListSection
              title={locale === 'fa' ? 'ابزارهای اخیر' : 'Recent Tools'}
              count={recentTools.length}
              tools={recentTools}
              selectedToolId={selectedTool.id}
              onHoverTool={handleCardHover}
              onClickTool={handleToolClick}
              registerRef={handleRegisterRef}
              locale={locale}
              isRtl={isRtl}
            />
          )}

          {/* All Tools Section */}
          <ToolListSection
            title={locale === 'fa' ? 'همه ابزارها' : 'All Tools'}
            count={allOtherTools.length}
            tools={allOtherTools}
            selectedToolId={selectedTool.id}
            onHoverTool={handleCardHover}
            onClickTool={handleToolClick}
            registerRef={handleRegisterRef}
            locale={locale}
            isRtl={isRtl}
            showEmptyState={true}
            onResetAllFilters={clearAllFilters}
          />
        </div>
      </aside>

      {/* ===== CANVAS STAGE & FLOATING DETAIL CARD (DESKTOP) ===== */}
      <main className="tools-canvas-stage">
        <div className="canvas-grid-dots" />

        {/* Floating Tool Detail Popup Card (Desktop - Popover aligned to card) */}
        {selectedTool && (
          <ToolPreviewCard
            ref={previewCardRef}
            tool={selectedTool}
            previewTop={previewTop}
            arrowTop={arrowTop}
            locale={locale}
          />
        )}

        {/* Center Canvas Dropzone / Workspace Helper */}
        <ToolCanvasDropzone
          selectedTool={selectedTool}
          locale={locale}
          isRtl={isRtl}
        />
      </main>

      {/* ===== MOBILE BOTTOM SHEET MODAL ===== */}
      {mobileBottomSheetOpen && selectedTool && (
        <ToolMobileBottomSheet
          tool={selectedTool}
          onClose={() => setMobileBottomSheetOpen(false)}
          locale={locale}
        />
      )}
    </div>
  );
}
