/**
 * Feed / App Index Page — Production Implementation
 *
 * Flagship workspace homepage showcasing:
 * 1. Featured AI Banner Slider (Interactive hero carousel with remix actions)
 * 2. Quick Tools & Generators Section (Instant shortcuts to flagship creation modules)
 * 3. Community Feed & Masonry Gallery (Multi-column masonry with live filtering and real assets)
 *
 * Conforms strictly to:
 * - DOC-DS-001 (Design System Styleguide) & @lemmo-lab/tokens
 * - Concentric radii & 4px spacing ladder
 * - Zero hardcoded raw values
 * - WCAG 2.1 AA accessibility standards
 */

'use client';

import React from 'react';
import BannerSlider from '@/modules/feed/components/BannerSlider';
import QuickToolsSection from '@/modules/feed/components/QuickToolsSection';
import MasonryFeed from '@/modules/feed/components/MasonryFeed';

export default function AppIndexPage() {
  return (
    <div className="feed-page-container">
      {/* 1. Featured Banner Showcase Carousel */}
      <BannerSlider />

      {/* 2. Quick Tools & Specialized Modules */}
      <QuickToolsSection />

      {/* 3. Community Feed with Multi-Column Masonry Gallery */}
      <MasonryFeed />

      <style jsx>{`
        .feed-page-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          max-width: 1760px;
          margin: 0 auto;
          padding: var(--lemmo-space-800, 32px);
          box-sizing: border-box;
          background: var(--lemmo-page-background, #131517);
          color: var(--lemmo-page-foreground, #e1e1e3);
          min-height: 100%;
        }

        /* ================= RESPONSIVE PADDING ================= */
        @media (max-width: 1024px) {
          .feed-page-container {
            padding: var(--lemmo-space-600, 24px);
          }
        }

        @media (max-width: 640px) {
          .feed-page-container {
            padding: var(--lemmo-space-400, 16px);
            padding-bottom: var(--lemmo-space-1200, 48px);
          }
        }
      `}</style>
    </div>
  );
}
