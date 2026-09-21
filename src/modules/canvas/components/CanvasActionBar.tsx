/**
 * Canvas Action Bar Component — /app/canvas
 * Filtering tabs, search box, and sorting dropdown.
 * Conforms 100% to Lemmo Design System logical CSS properties.
 */

'use client';

import React, { useState } from 'react';
import {
  Search01,
  X01,
  Sliders01,
  FolderCopy,
  Clock03,
  Heart,
  LayersThree,
  ChevronSelectorVertical,
  Check01,
} from 'synthline/react';
import { CanvasTab, CanvasSortOption } from '../types';

interface CanvasActionBarProps {
  activeTab: CanvasTab;
  onChangeTab: (tab: CanvasTab) => void;
  tabCounts: Record<CanvasTab, number>;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  sortOption: CanvasSortOption;
  onChangeSort: (sort: CanvasSortOption) => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasActionBar({
  activeTab,
  onChangeTab,
  tabCounts,
  searchQuery,
  onChangeSearch,
  sortOption,
  onChangeSort,
  locale,
}: CanvasActionBarProps) {
  const isFa = locale === 'fa';
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const tabs: Array<{
    id: CanvasTab;
    labelEn: string;
    labelFa: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; className?: string }>;
  }> = [
    { id: 'all', labelEn: 'All Projects', labelFa: 'همه پروژه‌ها', icon: FolderCopy },
    { id: 'recent', labelEn: 'Recent', labelFa: 'اخیراً ویرایش‌شده', icon: Clock03 },
    { id: 'starred', labelEn: 'Starred', labelFa: 'نشان‌شده‌ها', icon: Heart },
    { id: 'templates', labelEn: 'Templates', labelFa: 'قالب‌های آماده', icon: LayersThree },
  ];

  const sortOptions: Array<{ id: CanvasSortOption; labelEn: string; labelFa: string }> = [
    { id: 'updated', labelEn: 'Recently Updated', labelFa: 'آخرین به‌روزرسانی' },
    { id: 'name', labelEn: 'Project Name', labelFa: 'نام پروژه (الفبا)' },
    { id: 'created', labelEn: 'Date Created', labelFa: 'تاریخ ایجاد' },
  ];

  const currentSort = sortOptions.find((s) => s.id === sortOption) || sortOptions[0];

  return (
    <div className="canvas-action-section">
      {/* 1. Filter Tabs */}
      <div className="canvas-tabs" role="tablist" aria-label="Canvas Categories">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tabCounts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`canvas-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onChangeTab(tab.id)}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} color="currentColor" />
              <span className="tab-label">{isFa ? tab.labelFa : tab.labelEn}</span>
              <span className={`tab-count-badge ${isActive ? 'active' : ''}`} data-numeric="true">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Sort Actions */}
      <div className="canvas-action-controls">
        {/* Search Input */}
        <div className="canvas-search-box-wrap">
          <Search01
            size={16}
            strokeWidth={1.8}
            className="search-input-icon"
            color="var(--lemmo-text-muted, rgba(255, 255, 255, 0.45))"
          />
          <input
            type="text"
            className="canvas-search-box"
            placeholder={isFa ? 'جستجو در پروژه‌ها...' : 'Search projects...'}
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            aria-label="Search canvas projects"
          />
          {searchQuery && (
            <button
              type="button"
              className="canvas-search-clear-btn"
              onClick={() => onChangeSearch('')}
              title={isFa ? 'پاک کردن جستجو' : 'Clear search'}
              aria-label="Clear search"
            >
              <X01 size={13} strokeWidth={2.4} color="currentColor" />
            </button>
          )}
        </div>

        {/* Sort Popover */}
        <div className="canvas-sort-popover-anchor">
          <button
            type="button"
            className={`canvas-sort-btn ${sortMenuOpen ? 'open' : ''}`}
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            title={isFa ? 'مرتب‌سازی پروژه‌ها' : 'Sort projects'}
            aria-haspopup="listbox"
            aria-expanded={sortMenuOpen}
          >
            <Sliders01 size={15} strokeWidth={1.8} color="currentColor" />
            <span className="sort-btn-label">
              {isFa ? currentSort.labelFa : currentSort.labelEn}
            </span>
            <ChevronSelectorVertical size={14} strokeWidth={1.8} color="currentColor" />
          </button>

          {sortMenuOpen && (
            <>
              <div
                className="canvas-popover-backdrop"
                onClick={() => setSortMenuOpen(false)}
              />
              <div className="canvas-sort-menu" role="listbox">
                <div className="sort-menu-header">
                  {isFa ? 'مرتب‌سازی بر اساس' : 'Sort by'}
                </div>
                {sortOptions.map((opt) => {
                  const isSelected = opt.id === sortOption;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`sort-menu-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        onChangeSort(opt.id);
                        setSortMenuOpen(false);
                      }}
                    >
                      <span>{isFa ? opt.labelFa : opt.labelEn}</span>
                      {isSelected && (
                        <Check01
                          size={14}
                          strokeWidth={2.4}
                          color="var(--lemmo-surface-brand-background, #d1fe17)"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
