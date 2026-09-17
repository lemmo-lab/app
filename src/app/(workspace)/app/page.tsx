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
import Link from 'next/link';

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
            <div className="placeholder label" />
            <div className="pagination">
              <div className="placeholder arrow" />
              <div className="placeholder arrow" />
            </div>
          </div>
        </section>

        {/* 2. Tools Section */}
        <section className="wireframe-tools-section">
          {toolCards.map((_, i) => (
            <Link key={i} href="/app/tools" className="tools-card" title={`Tool ${i + 1}`}>
              <div className="placeholder tools-card-img" />
              <div className="placeholder tools-card-label" />
            </Link>
          ))}
        </section>

        {/* 3. Gallery Section */}
        <section className="wireframe-gallery">
          {/* Header & Actions */}
          <div className="gallery-header">
            <div className="gallery-actions">
              <div className="placeholder tab" />
              <div className="divider" />
              <div className="placeholder search-bar" />
            </div>
            <div className="placeholder publish-button" />
          </div>

          {/* Cards Grid */}
          <div className="gallery-grid">
            {galleryCards.map((_, i) => (
              <Link
                key={i}
                href={`/app/feed/item-${i + 1}`}
                className="placeholder gallery-card"
                title={`Gallery Item ${i + 1}`}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Styles strictly scoped for this wireframe */}
      <style jsx>{`
        .wireframe-app {
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

        :global(.placeholder) {
          background: #d9d9d9;
          transition: opacity 0.15s ease;
        }
        :global(.placeholder:hover) {
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
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding-bottom: 3.75rem;
          gap: 1.5rem;
          width: 100%;
        }

        :global(.tools-card) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        :global(.tools-card:hover) {
          transform: translateY(-2px);
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

        .gallery-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
          height: 40px;
          flex-wrap: wrap;
        }

        .tab {
          width: 227px;
          height: 40px;
          border-radius: 8px;
        }

        .divider {
          width: 1px;
          height: 40px;
          background: #ffffff;
          opacity: 0.2;
        }

        .search-bar {
          width: 480px;
          max-width: 100%;
          height: 40px;
          border-radius: 8px;
        }

        .publish-button {
          width: 126px;
          height: 40px;
          border-radius: 8px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          width: 100%;
        }

        :global(.gallery-card) {
          display: block;
          width: 100%;
          height: 380px;
          background: #d9d9d9;
          border-radius: 18px;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        :global(.gallery-card:hover) {
          transform: translateY(-3px);
          opacity: 0.9;
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
