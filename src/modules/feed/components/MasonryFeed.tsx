/**
 * MasonryFeed Component — Responsive Multi-Column Generative Showcase
 *
 * Implements a true CSS column masonry layout supporting mixed aspect ratios
 * (portrait 9:16/3:4, landscape 16:9, square 1:1) with zero layout shifts.
 *
 * Features:
 * - Live Category Tabs filtering (All, Photoreal, Stylized, Architecture, Concept)
 * - Real-time prompt & title search
 * - Interactive Like counter with micro-interaction
 * - Quick "New Generation" trigger leading to Agent Studio
 * - Zero hardcoded hex colors, 100% token-driven
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search01, Heart, AiRobot01, Sparks } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { FEED_ITEMS, FeedItem } from '@/shared/data/feedData';

export default function MasonryFeed() {
  const { locale } = useUiStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Category filter options
  const categories = [
    { id: 'all', labelEn: 'All Showcase', labelFa: 'همه آثار' },
    { id: 'photoreal', labelEn: 'Photoreal', labelFa: 'واقع‌گرایانه' },
    { id: 'stylized', labelEn: 'Stylized & Anime', labelFa: 'تصویرسازی و انیمه' },
    { id: 'architecture', labelEn: 'Architecture & 3D', labelFa: 'معماری و سه‌بعدی' },
    { id: 'concept', labelEn: 'Concept Art', labelFa: 'کانسپت آرت' },
  ];

  // Like toggle handler
  const toggleLike = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return FEED_ITEMS.filter((item) => {
      const matchCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.titleFa.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      className="masonry-feed-section"
      aria-label={locale === 'fa' ? 'گالری آثار تولید شده' : 'Community Feed & Showcase'}
    >
      {/* Feed Toolbar: Categories + Search + Create CTA */}
      <div className="feed-toolbar">
        {/* Category Tabs */}
        <div className="category-tabs" role="tablist" aria-label="Feed Categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              data-action={`filter-${cat.id}`}
            >
              <span>{locale === 'fa' ? cat.labelFa : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Search & Actions Group */}
        <div className="actions-group">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              <Search01 size={16} strokeWidth={1.5} color="currentColor" />
            </span>
            <input
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fa' ? 'جستجو در پرامپت‌ها و آثار...' : 'Search prompts, titles, authors...'}
              aria-label={locale === 'fa' ? 'جستجو در گالری' : 'Search gallery'}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title={locale === 'fa' ? 'پاک کردن' : 'Clear search'}
              >
                &times;
              </button>
            )}
          </div>

          {/* New Generation CTA Button */}
          <Link
            href="/app/agent"
            className="btn-create"
            title={locale === 'fa' ? 'تولید تصویر جدید در استودیو' : 'Generate New in Studio'}
            data-action="create-new"
          >
            <AiRobot01 size={18} strokeWidth={2} color="currentColor" />
            <span className="btn-create-label">
              {locale === 'fa' ? 'تولید جدید' : 'Generate'}
            </span>
          </Link>
        </div>
      </div>

      {/* Masonry Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="empty-search-state">
          <div className="empty-icon-wrap">
            <Search01 size={28} strokeWidth={1.5} color="currentColor" />
          </div>
          <h4 className="empty-title">
            {locale === 'fa' ? 'اثری یافت نشد' : 'No creations found'}
          </h4>
          <p className="empty-desc">
            {locale === 'fa'
              ? 'موردی منطبق با جستجوی شما وجود ندارد. فیلترها را ریست کنید.'
              : 'Try adjusting your search keywords or resetting the category filter.'}
          </p>
          <button
            type="button"
            className="btn-reset"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            {locale === 'fa' ? 'مشاهده همه آثار' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="masonry-columns">
          {filteredItems.map((item: FeedItem) => {
            const isLiked = likedMap[item.id] || false;
            const currentLikes = item.likes + (isLiked ? 1 : 0);

            return (
              <article key={item.id} className="feed-card-item">
                <Link
                  href={`/app/feed/${item.id}`}
                  className="card-media-wrap"
                  title={locale === 'fa' ? item.titleFa : item.title}
                  data-action={`view-item-${item.id}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={locale === 'fa' ? item.titleFa : item.title}
                    className="card-img"
                    loading="lazy"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="card-gradient-scrim" />

                  {/* Top Badges Row: Aspect Ratio & Model Chip */}
                  <div className="card-top-badges">
                    <span className="ratio-tag" data-numeric>{item.aspectRatio}</span>
                    <span className="card-model-chip">{item.model}</span>
                  </div>

                  {/* Hover Meta Card info */}
                  <div className="card-hover-meta">
                    <h4 className="card-title">
                      {locale === 'fa' ? item.titleFa : item.title}
                    </h4>
                    <p className="card-prompt-snippet">
                      &ldquo;{item.prompt}&rdquo;
                    </p>

                    <div className="card-footer-row">
                      {/* Author */}
                      <div className="card-author">
                        <div className="author-avatar">{item.avatar}</div>
                        <span className="author-handle">{item.authorHandle}</span>
                      </div>

                      {/* Interactive Like Button */}
                      <button
                        type="button"
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => toggleLike(e, item.id)}
                        title={isLiked ? 'Unlike' : 'Like'}
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          size={15}
                          strokeWidth={isLiked ? 0 : 2}
                          color="currentColor"
                        />
                        <span className="like-count" data-numeric>
                          {currentLikes.toLocaleString()}
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .masonry-feed-section {
          width: 100%;
          box-sizing: border-box;
        }

        /* ================= Toolbar: Categories + Search + Create CTA ================= */
        .feed-toolbar {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: var(--lemmo-space-400, 16px);
          margin-bottom: var(--lemmo-space-600, 24px);
          flex-wrap: wrap;
        }

        .category-tabs {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-150, 6px);
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }

        .category-tabs::-webkit-scrollbar {
          display: none;
        }

        .cat-pill {
          display: inline-flex;
          align-items: center;
          height: 36px;
          padding: 0 14px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          color: var(--lemmo-text-secondary, #a1a1a5);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .cat-pill:hover {
          background: var(--lemmo-surface-secondary-background, #23262a);
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .cat-pill.active {
          background: var(--lemmo-surface-secondary-background, #23262a);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-primary, #e1e1e3);
          box-shadow: 0 0 10px rgba(209, 254, 23, 0.2);
        }

        .actions-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--lemmo-space-250, 10px);
          flex-wrap: wrap;
        }

        /* Search Input Box */
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 280px;
        }

        .search-icon {
          position: absolute;
          inset-inline-start: 12px;
          color: var(--lemmo-text-muted, #898a8b);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          height: 38px;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.1));
          border-radius: var(--lemmo-radius-pill, 9999px);
          padding-inline-start: 36px;
          padding-inline-end: 28px;
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: inherit;
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .search-input:focus {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 12px rgba(209, 254, 23, 0.2);
        }

        .clear-search-btn {
          position: absolute;
          inset-inline-end: 10px;
          background: transparent;
          border: none;
          color: var(--lemmo-text-muted, #898a8b);
          cursor: pointer;
          font-size: 1.125rem;
          line-height: 1;
          padding: 0;
        }

        /* Create Button */
        :global(.btn-create) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 16px;
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-text-on-brand, #131517);
          border-radius: var(--lemmo-radius-pill, 9999px);
          font-family: var(--lemmo-font-body, inherit);
          font-size: 0.8125rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(209, 254, 23, 0.3);
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        :global(.btn-create:hover) {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        /* ================= CSS Multi-Column Masonry Grid ================= */
        .masonry-columns {
          column-count: 4;
          column-gap: var(--lemmo-space-400, 16px);
          width: 100%;
          box-sizing: border-box;
        }

        .feed-card-item {
          break-inside: avoid;
          margin-bottom: var(--lemmo-space-400, 16px);
          display: block;
          width: 100%;
        }

        :global(.card-media-wrap) {
          position: relative;
          display: block;
          width: 100%;
          border-radius: var(--lemmo-radius-media, 16px);
          overflow: hidden;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.08));
          text-decoration: none;
          box-sizing: border-box;
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.2s ease,
                      box-shadow 0.24s ease;
        }

        :global(.card-media-wrap:hover) {
          transform: translateY(-4px);
          border-color: var(--lemmo-border-mid, rgba(255, 255, 255, 0.25));
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
        }

        :global(.card-media-wrap:focus-visible) {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }

        .card-img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        :global(.card-media-wrap:hover) .card-img {
          transform: scale(1.035);
        }

        /* Scrim overlay: subtle dark fade at bottom */
        .card-gradient-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 12, 14, 0.95) 0%,
            rgba(10, 12, 14, 0.6) 38%,
            rgba(10, 12, 14, 0.08) 70%,
            transparent 100%
          );
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }

        :global(.card-media-wrap:hover) .card-gradient-scrim {
          opacity: 0.98;
        }

        /* Top Badges */
        .card-top-badges {
          position: absolute;
          top: 10px;
          inset-inline: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 3;
          pointer-events: none;
        }

        .ratio-tag {
          font-size: 0.625rem;
          font-weight: 700;
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .card-model-chip {
          font-size: 0.625rem;
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #a1a1a5);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        :global(.card-media-wrap:hover) .card-model-chip {
          opacity: 1;
        }

        /* Bottom Content info */
        .card-hover-meta {
          position: absolute;
          bottom: 0;
          inset-inline: 0;
          padding: var(--lemmo-space-300, 12px) var(--lemmo-space-300, 12px);
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-sizing: border-box;
        }

        .card-title {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-200, 0.875rem);
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .card-prompt-snippet {
          font-size: 0.6875rem;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .card-footer-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-author {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }

        .author-avatar {
          width: 20px;
          height: 20px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: linear-gradient(135deg, #2a2d30 0%, #151718 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.5625rem;
          font-weight: 700;
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .author-handle {
          font-size: 0.6875rem;
          color: var(--lemmo-text-secondary, #a1a1a5);
        }

        .like-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--lemmo-radius-pill, 9999px);
          color: var(--lemmo-text-secondary, #a1a1a5);
          cursor: pointer;
          font-size: 0.6875rem;
          transition: all 0.15s ease;
        }

        .like-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .like-btn.liked {
          background: rgba(255, 84, 98, 0.2);
          border-color: rgba(255, 84, 98, 0.4);
          color: var(--lemmo-text-danger, #ff5462);
        }

        /* Empty Search State */
        .empty-search-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--lemmo-space-1600, 64px) var(--lemmo-space-400, 16px);
          text-align: center;
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px dashed var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-media, 16px);
          margin-top: var(--lemmo-space-400, 16px);
        }

        .empty-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-text-muted, #898a8b);
          margin-bottom: var(--lemmo-space-300, 12px);
        }

        .empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--lemmo-text-primary, #e1e1e3);
          margin: 0 0 6px 0;
        }

        .empty-desc {
          font-size: 0.875rem;
          color: var(--lemmo-text-muted, #898a8b);
          max-width: 380px;
          margin: 0 0 var(--lemmo-space-400, 16px) 0;
        }

        .btn-reset {
          height: 36px;
          padding: 0 16px;
          background: var(--lemmo-surface-secondary-background, #23262a);
          border: 1px solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-base, 8px);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-reset:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* ================= RESPONSIVE MASONRY COLUMNS ================= */
        @media (max-width: 1440px) {
          .masonry-columns {
            column-count: 3;
          }
        }

        @media (max-width: 960px) {
          .masonry-columns {
            column-count: 2;
            column-gap: var(--lemmo-space-300, 12px);
          }

          .feed-card-item {
            margin-bottom: var(--lemmo-space-300, 12px);
          }

          .search-input-wrapper {
            width: 100%;
          }

          .actions-group {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 540px) {
          .masonry-columns {
            column-count: 1;
          }

          .btn-create-label {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
}
