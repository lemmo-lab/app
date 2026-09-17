/**
 * App Index Wireframe — /app
 * Responsive implementation of app-web-index.html wireframe:
 * - Desktop: 1920px max-width layout with sticky 72px right-docked sidebar (or left according to dir)
 * - Mobile / Tablet: Responsive fluid layout with stacked sections and touch scroll
 * - Components:
 *   1. Banner Slider (400px height on desktop, 32px rounded, with pagination & label)
 *   2. Tools Section (4 cards in horizontal row with 167px image block & 16px label)
 *   3. Gallery Section (Header with publish button + search bar + tab, followed by masonry/grid cards)
 *   4. Sidebar (Logo button, primary categories, tools section, footer buttons)
 */

'use client';

import React from 'react';

export default function AppIndexPage() {
  // 10 gallery cards matching wireframe
  const galleryCards = Array.from({ length: 10 });
  const toolCards = Array.from({ length: 4 });

  return (
    <div className="wireframe-app">
      {/* ===== MAIN BODY CONTENT ===== */}
      <main className="wireframe-body">
        {/* 1. Banner Section */}
        <section className="wireframe-banner">
          <div className="wireframe-slider">
            <div className="placeholder slider-image" />
          </div>
          <div className="slider-footer">
            <div className="pagination">
              <div className="placeholder arrow" />
              <div className="placeholder arrow" />
            </div>
            <div className="placeholder label" />
          </div>
        </section>

        {/* 2. Tools Section */}
        <section className="wireframe-tools-section">
          {toolCards.map((_, i) => (
            <div key={i} className="tools-card">
              <div className="placeholder tools-card-img" />
              <div className="placeholder tools-card-label" />
            </div>
          ))}
        </section>

        {/* 3. Gallery Section */}
        <section className="wireframe-gallery">
          {/* Header & Actions */}
          <div className="gallery-header">
            <div className="placeholder publish-button" />
            <div className="gallery-actions">
              <div className="placeholder search-bar" />
              <div className="divider" />
              <div className="placeholder tab" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="gallery-grid">
            {galleryCards.map((_, i) => (
              <div key={i} className="placeholder gallery-card" />
            ))}
          </div>
        </section>
      </main>

      {/* Styles strictly scoped for this wireframe */}
      <style jsx>{`
        .wireframe-app {
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

        .placeholder {
          background: #d9d9d9;
          transition: opacity 0.15s ease;
        }
        .placeholder:hover {
          opacity: 0.9;
        }

        /* ===== MAIN BODY ===== */
        .wireframe-body {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 3rem;
          flex: 1 1 0;
          min-width: 0;
          gap: 0;
        }

        /* ---- Banner ---- */
        .wireframe-banner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-bottom: 3.75rem;
          gap: 1.5rem;
          width: 100%;
        }

        .wireframe-slider {
          width: 100%;
        }

        .slider-image {
          width: 100%;
          height: 400px;
          border-radius: 32px;
        }

        .slider-footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 32px;
        }

        .pagination {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 72px;
          height: 32px;
        }

        .arrow {
          width: 32px;
          height: 32px;
          border-radius: 6px;
        }

        .label {
          width: 203px;
          height: 18px;
          border-radius: 99px;
        }

        /* ---- Tools Section ---- */
        .wireframe-tools-section {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-bottom: 3.75rem;
          gap: 1.5rem;
          width: 100%;
        }

        .tools-card {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          flex: 1 1 0;
          min-width: 0;
        }

        .tools-card-img {
          width: 100%;
          height: 167px;
          border-radius: 18px;
        }

        .tools-card-label {
          width: 100%;
          max-width: 167px;
          height: 16px;
          border-radius: 99px;
        }

        /* ---- Gallery Section ---- */
        .wireframe-gallery {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 2rem;
          width: 100%;
        }

        .gallery-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          width: 100%;
          min-height: 40px;
          flex-wrap: wrap;
        }

        .publish-button {
          width: 126px;
          height: 40px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .gallery-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2rem;
          height: 40px;
          flex-wrap: wrap;
        }

        .search-bar {
          width: 515px;
          max-width: 100%;
          height: 40px;
          border-radius: 8px;
        }

        .divider {
          width: 1px;
          height: 40px;
          background: #ffffff;
          opacity: 0.2;
        }

        .tab {
          width: 227px;
          height: 40px;
          border-radius: 8px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 12px;
          width: 100%;
          border-radius: 32px;
        }

        .gallery-card {
          width: 100%;
          height: 560px;
          border-radius: 12px;
        }

        /* ===== SIDEBAR ===== */
        .wireframe-sidebar {
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
          align-self: stretch;
          border-inline-start: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 20;
        }

        /* ===== RESPONSIVENESS ===== */
        @media (max-width: 1024px) {
          .wireframe-body {
            padding: 1.5rem;
          }
          .wireframe-tools-section {
            flex-wrap: wrap;
            gap: 1rem;
          }
          .tools-card {
            flex: 1 1 calc(50% - 1rem);
          }
          .search-bar {
            width: 100%;
          }
          .gallery-header {
            flex-direction: column;
            align-items: stretch;
          }
          .gallery-actions {
            flex-direction: column;
            align-items: stretch;
            height: auto;
          }
          .divider {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .wireframe-app {
            flex-direction: column;
          }
          .wireframe-body {
            padding: 1rem 1rem 5rem 1rem;
          }
          .slider-image {
            height: 240px;
            border-radius: 18px;
          }
          .wireframe-tools-section {
            flex-direction: column;
            gap: 1rem;
          }
          .tools-card {
            width: 100%;
          }
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 8px;
          }
          .gallery-card {
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}
