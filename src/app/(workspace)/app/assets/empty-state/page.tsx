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

      {/* ===== SIDEBAR ===== */}
      <nav className="side">
        <div className="button">
          <div className="icon"><div className="rect-8" /></div>
        </div>

        <div className="primary-cats">
          <div className="nav-button">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
          <div className="nav-button">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
          <div className="nav-button">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
          <div className="nav-button active">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
        </div>

        <div className="tools-section">
          <div className="nav-button">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
        </div>

        <div className="footer-sidebar">
          <div className="nav-button">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </div>
          <div className="button">
            <div className="icon"><div className="rect-8" /></div>
          </div>
        </div>
      </nav>

      {/* Scoped CSS faithful to assets-empty.html */}
      <style jsx>{`
        .assets-empty-app {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          width: 100%;
          min-height: 100dvh;
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow-x: hidden;
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

        /* ===== SIDEBAR ===== */
        .side {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          width: 72px;
          min-height: 100dvh;
          background: #131517;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          border-inline-start: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 20;
        }

        .side .button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          width: 56px;
          height: 56px;
          background: #171717;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .rect-8 {
          width: 40px;
          height: 40px;
          background: #d9d9d9;
          border-radius: 4px;
        }

        .primary-cats {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          width: 56px;
          gap: 8px;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 8px;
          width: 56px;
          height: 60px;
          background: #171717;
          border-radius: 8px;
          cursor: pointer;
        }

        .nav-button.active {
          background: #453d3d;
        }

        .rect-8-small {
          width: 20px;
          height: 20px;
          background: #d9d9d9;
          border-radius: 4px;
        }

        .rect-9-indicator {
          width: 40px;
          height: 10px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .tools-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 56px;
          margin-top: 8px;
        }

        .footer-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 0;
          width: 56px;
          flex: 1 0 0;
          gap: 8px;
          margin-top: auto;
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
          .assets-empty-app {
            flex-direction: column;
          }
          .side {
            width: 100%;
            min-height: auto;
            height: 64px;
            flex-direction: row;
            position: fixed;
            bottom: 0;
            top: auto;
            padding: 0 1rem;
            justify-content: space-between;
            border-inline-start: none;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
          }
          .nav-button {
            width: 48px;
            height: 48px;
          }
          .tools-section, .footer-sidebar {
            display: none;
          }
          .body {
            padding: 1rem 1rem 5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
