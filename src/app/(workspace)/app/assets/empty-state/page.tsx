/**
 * Assets Empty State Wireframe — /app/assets/empty-state
 * Responsive implementation of assets-empty.html:
 * - Same page-header (search + tabs + filter bar)
 * - Empty state content in center:
 *   - 48x48px icon box (#d9d9d9)
 *   - Title & Subtitle skeleton pills (130px & 292px)
 *   - 186x40px Add button pill
 * - Standard navigation sidebar
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function AssetsEmptyStatePage() {
  return (
    <div className="assets-empty-app">
      {/* ===== MAIN BODY ===== */}
      <main className="body">
        {/* Page Header */}
        <div className="page-header">
          <div className="action_section">
            <div className="action">
              <div className="search" />
            </div>
            <div className="tabs">
              <div className="tab-item" />
              <div className="tab-item" />
              <div className="tab-item" />
              <div className="tab-item active" />
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

        {/* Empty State Center Stage */}
        <div className="content">
          <div className="empty-state">
            <div className="empty-state-pic" />
            <div className="title-subtitle">
              <div className="rect-42" />
              <div className="rect-41" />
            </div>
            <Link href="/app/assets" style={{ textDecoration: 'none' }}>
              <div className="button-add" title="Add Assets" />
            </Link>
          </div>
        </div>
      </main>

      {/* Scoped CSS faithful to assets-empty.html */}
      <style jsx>{`
        .assets-empty-app {
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
          min-height: 100dvh;
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
          justify-content: flex-end;
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

        /* Empty State Content */
        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1 1 0;
          min-height: 450px;
          width: 100%;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 42px;
          width: 292px;
          max-width: 100%;
        }

        .empty-state-pic {
          width: 48px;
          height: 48px;
          background: #d9d9d9;
          border-radius: 8px;
        }

        .title-subtitle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          width: 100%;
        }

        .rect-42 {
          width: 130px;
          height: 18px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .rect-41 {
          width: 292px;
          max-width: 100%;
          height: 14px;
          background: #535353;
          border-radius: 99px;
        }

        .button-add {
          display: block;
          width: 186px;
          height: 40px;
          background: #d9d9d9;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .button-add:hover {
          opacity: 0.9;
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
            padding: 1rem 1rem 5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
