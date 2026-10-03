'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '@/stores/uiStore';
import { sdk, ToolManifest } from '@/sdk';
import { ToolItem, ToolCategory } from '../types';
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

function manifestToToolItem(m: ToolManifest): ToolItem {
  let category: ToolCategory = 'generative';
  if (m.category === 'image-editing' || m.category === 'editing') category = 'editing';
  else if (m.category === 'vision') category = 'vision';
  else if (m.category === 'depth' || m.category === '3d') category = 'depth';

  let iconName: ToolItem['iconName'] = 'wand';
  if (m.id.includes('bg') || m.id.includes('remove')) iconName = 'scissors';
  else if (m.id.includes('upscale')) iconName = 'spark';
  else if (m.id.includes('face')) iconName = 'cpu';

  return {
    id: m.id,
    name: m.name,
    nameFa: m.nameFa,
    tagline: m.description ? m.description.slice(0, 45) : 'High performance AI tool',
    taglineFa: m.descriptionFa ? m.descriptionFa.slice(0, 45) : 'ابزار پردازش هوش مصنوعی با عملکرد بالا',
    description: m.description,
    descriptionFa: m.descriptionFa,
    category,
    categoryLabel: m.category,
    categoryLabelFa: m.nameFa,
    rating: '4.9',
    version: 'v1.0',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    author: 'Lemmo Studio',
    authorFa: 'استودیو لمو',
    iconName,
    inputs: m.inputFields?.map((f) => f.label).join(', ') || 'Parameters',
    inputsFa: m.inputFields?.map((f) => f.labelFa || f.label).join('، ') || 'پارامترها',
    speed: '~2s',
    speedFa: '۲ ثانیه',
    credits: m.estimatedTokenCost || 5,
    isRecent: true,
  };
}

export default function ToolsManager({ initialToolId }: ToolsManagerProps) {
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);

  // Fetch tools from SDK / gateway
  const { data: rawManifests = [] } = useQuery({
    queryKey: ['tools'],
    queryFn: () => sdk.tools.list(),
  });

  const tools = useMemo(() => {
    return rawManifests.map(manifestToToolItem);
  }, [rawManifests]);

  const [activeToolId, setActiveToolId] = useState<string | null>(initialToolId || null);

  const selectedTool: ToolItem | null = useMemo(() => {
    if (activeToolId && tools.length > 0) {
      const found = tools.find((t) => t.id === activeToolId);
      if (found) return found;
    }
    return tools[0] || null;
  }, [activeToolId, tools]);

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
    if (selectedTool) {
      updatePosition(selectedTool.id);
    }
  }, [selectedTool, updatePosition]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (selectedTool) {
        updatePosition(selectedTool.id);
      }
    };
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
    return tools.filter((tool) => {
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
  }, [tools, searchQuery, selectedCategory]);

  const recentTools = useMemo(
    () => filteredTools.filter((t) => t.isRecent),
    [filteredTools]
  );
  const allOtherTools = useMemo(
    () => filteredTools.filter((t) => !t.isRecent),
    [filteredTools]
  );

  const handleCardHover = useCallback(
    (tool: ToolItem) => {
      if (typeof window !== 'undefined' && window.innerWidth > 900) {
        setActiveToolId(tool.id);
        updatePosition(tool.id);
      }
    },
    [updatePosition]
  );

  const handleToolClick = useCallback(
    (tool: ToolItem) => {
      setActiveToolId(tool.id);
      if (typeof window !== 'undefined' && window.innerWidth <= 900) {
        setMobileBottomSheetOpen(true);
      } else {
        updatePosition(tool.id);
      }
    },
    [updatePosition]
  );

  const handleRegisterRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) {
        cardRefs.current.set(id, el);
      } else {
        cardRefs.current.delete(id);
      }
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  return (
    <div className="tools-workspace-container" dir={dir}>
      {/* ===== SIDEBAR DRAWER (TOOLS CATALOG) ===== */}
      <aside className="tools-drawer-sidebar">
        <ToolDrawerHeader
          count={tools.length}
          locale={locale}
        />

        <ToolSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          filterMenuOpen={filterMenuOpen}
          onToggleFilterMenu={() => setFilterMenuOpen((prev) => !prev)}
          onClearCategoryFilter={() => setSelectedCategory('all')}
          onClearAllFilters={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
          locale={locale}
          categoryTabs={CATEGORY_TABS}
        />

        {/* Scrollable Tool list area */}
        <div
          className="drawer-scroll-container"
          onScroll={() => selectedTool && updatePosition(selectedTool.id)}
        >
          {/* Featured Showcase / Tutorial Banner */}
          <ToolTutorialBanner locale={locale} isRtl={isRtl} />

          {/* Recent Tools Section */}
          {recentTools.length > 0 && (
            <ToolListSection
              title={locale === 'fa' ? 'ابزارهای اخیر' : 'Recent Tools'}
              count={recentTools.length}
              tools={recentTools}
              selectedToolId={selectedTool?.id || ''}
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
            selectedToolId={selectedTool?.id || ''}
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
        {selectedTool && (
          <ToolCanvasDropzone
            selectedTool={selectedTool}
            locale={locale}
            isRtl={isRtl}
          />
        )}
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
