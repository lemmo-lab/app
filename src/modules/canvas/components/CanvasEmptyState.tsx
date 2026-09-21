/**
 * Canvas Empty State Component — /app/canvas
 * Clean Lemmo-styled empty state for filtered searches or empty project tabs.
 */

'use client';

import React from 'react';
import { Search01, LayersThree, Plus01, RefreshCw } from 'synthline/react';

interface CanvasEmptyStateProps {
  isSearchEmpty: boolean;
  searchQuery?: string;
  onResetSearch: () => void;
  onCreateNew: () => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasEmptyState({
  isSearchEmpty,
  searchQuery,
  onResetSearch,
  onCreateNew,
  locale,
  isRtl,
}: CanvasEmptyStateProps) {
  const isFa = locale === 'fa';

  if (isSearchEmpty) {
    return (
      <div className="canvas-empty-state-root">
        <div className="canvas-empty-icon-wrap">
          <Search01
            size={28}
            strokeWidth={1.8}
            color="var(--lemmo-surface-brand-background, #d1fe17)"
          />
        </div>

        <h3 className="canvas-empty-title">
          {isFa ? 'پروژه‌ای یافت نشد' : 'No matching projects found'}
        </h3>

        <p className="canvas-empty-desc">
          {isFa
            ? `هیچ پروژه‌ای مطابق با عبارت «${searchQuery}» پیدا نشد. می‌توانید عبارت را تغییر دهید یا فیلتر را پاک کنید.`
            : `We couldn't find any canvas projects matching "${searchQuery}". Try adjusting your keywords or clearing search.`}
        </p>

        <button
          type="button"
          className="canvas-empty-action-btn secondary"
          onClick={onResetSearch}
        >
          <RefreshCw size={15} strokeWidth={2} color="currentColor" />
          <span>{isFa ? 'پاک کردن فیلتر جستجو' : 'Clear search query'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="canvas-empty-state-root">
      <div className="canvas-empty-icon-wrap">
        <LayersThree
          size={28}
          strokeWidth={1.8}
          color="var(--lemmo-surface-brand-background, #d1fe17)"
        />
      </div>

      <h3 className="canvas-empty-title">
        {isFa ? 'هنوز پروژه‌ای در این بخش وجود ندارد' : 'No projects here yet'}
      </h3>

      <p className="canvas-empty-desc">
        {isFa
          ? 'می‌توانید همین حالا اولین بوم کاری خود را ایجاد کنید یا پروژه‌ای را با زدن آیکون قلب نشان‌دار کنید.'
          : 'You can create your first canvas workspace right now, or star favorite projects to access them quickly.'}
      </p>

      <button
        type="button"
        className="canvas-empty-action-btn primary"
        onClick={onCreateNew}
      >
        <Plus01 size={16} strokeWidth={2.4} color="currentColor" />
        <span>{isFa ? 'افزودن پروژه' : 'Add Project'}</span>
      </button>
    </div>
  );
}
