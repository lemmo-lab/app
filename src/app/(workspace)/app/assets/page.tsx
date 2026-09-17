/**
 * Assets Index Wireframe — /app/assets
 * Responsive implementation of assets.html wireframe:
 * - Desktop: 1920px max layout with sticky 72px sidebar
 * - Header:
 *   - Search input & 4 filter tab buttons (All, Images, Videos, etc.)
 *   - Sub-filter rail (filter-rect pills with divider lines)
 * - Grouped Assets By Date:
 *   - Date badge label + plus action icon
 *   - Grid of square content cards (185x185px) with favorite icon overlay
 * - Mobile/Tablet Responsive:
 *   - Sidebar adapts to mobile bottom bar / responsive layout
 *   - Grids collapse fluidly with auto-fill minmax(140px, 1fr)
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function AssetsPage() {
  const group1Cards = Array.from({ length: 5 });
  const group2Cards = Array.from({ length: 2 });

  return (
    <div className="assets-app">
      {/* ===== MAIN BODY ===== */}
      <main className="body">
        {/* Page Header */}
        <div className="page-header">
          <div className="action_section">
            <div className="tabs">
              <div className="tab-item active" />
              <div className="tab-item" />
              <div className="tab-item" />
              <div className="tab-item" />
            </div>
            <div className="action">
              <div className="search" />
            </div>
          </div>

          <div className="filter">
            <div className="filter-rect" />
            <div className="filter-line" />
            <div className="filter-rect" />
            <div className="filter-line" />
            <div className="filter-rect" />
          </div>
        </div>

        {/* Group 1: Today / Date Group */}
        <section className="assets-group">
          <div className="group-action-section">
            <div className="label-group">
              <div className="date-badge" />
              <div className="plus-icon" />
            </div>
          </div>
          <div className="cards-grid">
            {group1Cards.map((_, i) => (
              <Link
                key={i}
                href={`/app/assets/asset-${i + 1}`}
                className="content-card"
                title={`Asset ${i + 1}`}
              >
                <div className="rect-63" />
                <div className="card-icon-container">
                  <div className="farvarite-icon" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Group 2: Previous Date Group */}
        <section className="assets-group">
          <div className="group-action-section">
            <div className="label-group">
              <div className="date-badge" />
              <div className="plus-icon" />
            </div>
          </div>
          <div className="cards-grid">
            {group2Cards.map((_, i) => (
              <Link
                key={i}
                href={`/app/assets/asset-prev-${i + 1}`}
                className="content-card"
                title={`Asset Prev ${i + 1}`}
              >
                <div className="rect-63" />
                <div className="card-icon-container">
                  <div className="farvarite-icon" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Scoped CSS faithful to assets.html */}
      <style jsx>{`
        .assets-app {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 100%;
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ===== MAIN BODY ===== */
        .body {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 3rem;
          flex: 1 1 0;
          min-width: 0;
          background: #0a0a0a;
        }

        /* Page Header */
        .page-header {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-bottom: 3.75rem;
          gap: 1.5rem;
          width: 100%;
        }

        .action_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          gap: 2rem;
          width: 100%;
          flex-wrap: wrap;
        }

        .action {
          display: flex;
          align-items: center;
          width: 378px;
          max-width: 100%;
          height: 40px;
        }

        .search {
          width: 100%;
          height: 40px;
          background: #d9d9d9;
          border-radius: 8px;
        }

        .tabs {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 13px;
          height: 40px;
          flex-wrap: wrap;
        }

        .tab-item {
          width: 105px;
          height: 40px;
          background: #464646;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab-item.active {
          background: #d9d9d9;
        }

        .filter {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 14px;
        }

        .filter-rect {
          width: 98px;
          height: 14px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .filter-line {
          width: 1px;
          height: 14px;
          background: #ffffff;
          opacity: 0.3;
        }

        /* Assets Groups */
        .assets-group {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-bottom: 3.75rem;
          gap: 1.5rem;
          width: 100%;
        }

        .group-action-section {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          width: 100%;
          height: 18px;
        }

        .label-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          height: 18px;
        }

        .plus-icon {
          width: 18px;
          height: 18px;
          background: #d9d9d9;
          border-radius: 4px;
        }

        .date-badge {
          width: 113px;
          height: 18px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .cards-grid {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          width: 100%;
          flex-wrap: wrap;
        }

        .content-card {
          position: relative;
          width: 185px;
          height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          cursor: pointer;
        }

        .rect-63 {
          width: 185px;
          height: 185px;
          background: #d9d9d9;
          border-radius: 8px;
          transition: opacity 0.15s ease;
        }
        .content-card:hover .rect-63 {
          opacity: 0.9;
        }

        .card-icon-container {
          position: absolute;
          inset-inline-start: 16px;
          bottom: 16px;
          width: 18px;
          height: 18px;
          z-index: 1;
        }

        .farvarite-icon {
          width: 18px;
          height: 18px;
          background: #333333;
          border-radius: 4px;
        }

        /* ===== RESPONSIVENESS ===== */
        @media (max-width: 1024px) {
          .body {
            padding: 1.5rem;
          }
          .action_section {
            gap: 1rem;
          }
          .search {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .body {
            padding: 16px 16px 84px 16px;
          }
          .page-header {
            padding-bottom: 24px;
            gap: 16px;
          }
          /* MOBILE ACTION HIERARCHY: Search full width first, Tabs underneath */
          .action_section {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding-bottom: 0;
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
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 8px;
          }
          .tabs::-webkit-scrollbar {
            display: none;
          }
          .tab-item {
            flex: 0 0 90px;
            height: 36px;
          }
          .filter {
            overflow-x: auto;
            flex-wrap: nowrap;
            width: 100%;
            scrollbar-width: none;
            padding-bottom: 2px;
          }
          .filter::-webkit-scrollbar {
            display: none;
          }
          .filter-rect {
            flex-shrink: 0;
          }
          /* Mobile Asset Cards Grid: 2-column clean square tiles */
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            width: 100%;
          }
          .content-card {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
          }
          .rect-63 {
            width: 100%;
            height: 100%;
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>
    </div>
  );
}
