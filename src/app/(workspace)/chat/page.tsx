/**
 * App Wireframe Surface — Figma-aligned "app" frame
 * Exact geometric match for Figma 'app' frame (node-id=134-321)
 *
 * Visual spec:
 * - Left rail: dark sidebar with brand triad logo and utility icons
 * - Center stage:
 *   - Massive light-gray hero container (#d9d9d9)
 *   - Thin sub-action bar with tiny square pills and line indicator
 *   - 4-column rounded cards row (#d9d9d9) with bottom accent underlines
 *   - Search / filter action rail (left pill, right search input)
 *   - 5-column x 2-row uniform grid of light-gray card rectangles (#d9d9d9)
 * - Right rail: 7 vertical utility icon blocks
 */

'use client';

import React from 'react';
import { LanguageSwitcher } from '@/shared/ui/primitives/LanguageSwitcher';

export default function AppWireframePage() {
  // Exactly 10 cards arranged in 5 columns x 2 rows
  const gridCards = Array.from({ length: 10 });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: '#131517',
        color: '#e1e1e3',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Left Vertical Navigation Rail */}
      <aside
        style={{
          width: '3.5rem',
          flexShrink: 0,
          borderInlineEnd: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0a0c0e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBlock: '1.25rem',
          gap: '1.125rem',
          zIndex: 10,
        }}
      >
        {/* Lemmo Triad Mark */}
        <div
          title="Lemmo Triad"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            cursor: 'pointer',
            padding: '0.25rem',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#d1fe17',
            }}
          />
          <div style={{ display: 'flex', gap: '3px' }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#d1fe17',
                opacity: 0.7,
              }}
            />
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#d1fe17',
                opacity: 0.4,
              }}
            />
          </div>
        </div>

        {/* Rail square icons matching Figma */}
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.375rem',
              backgroundColor: idx === 1 ? '#d1fe17' : 'rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
            }}
          />
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />
        </div>
      </aside>

      {/* 2. Main Center Viewport */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          overflowY: 'auto',
          paddingInline: '2rem',
          paddingBlock: '1.25rem',
          boxSizing: 'border-box',
          backgroundColor: '#131517',
        }}
      >
        {/* Header with frame title and language switcher */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#a1a1a5',
                letterSpacing: '0.04em',
              }}
            >
              FIGMA WIREFRAME : APP (NODE 134-321)
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(209, 254, 23, 0.15)',
                color: '#d1fe17',
              }}
            >
              M2 WIREFRAME
            </span>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Wireframe Canvas Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '84rem',
            marginInline: 'auto',
            paddingBottom: '2.5rem',
          }}
        >
          {/* A. Huge Light-Gray Top Hero Banner (as seen in Figma) */}
          <div
            style={{
              width: '100%',
              minHeight: '13.5rem',
              borderRadius: '0.875rem',
              backgroundColor: '#d9d9d9',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          />

          {/* B. Sub-Hero Control Bar (2 small squares on left, line pill on right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingInline: '0.25rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#d9d9d9',
                }}
              />
              <div
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#d9d9d9',
                }}
              />
            </div>
            <div
              style={{
                width: '7.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                backgroundColor: '#d9d9d9',
              }}
            />
          </div>

          {/* C. 4 Rounded Horizontal Cards Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '1rem',
              width: '100%',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    height: '5.5rem',
                    borderRadius: '0.875rem',
                    backgroundColor: '#d9d9d9',
                    width: '100%',
                  }}
                />
                {/* Thin underline indicator matching Figma */}
                <div
                  style={{
                    width: '40%',
                    height: '0.25rem',
                    borderRadius: '9999px',
                    backgroundColor: '#d9d9d9',
                    marginInline: 'auto',
                  }}
                />
              </div>
            ))}
          </div>

          {/* D. Filter Pill Bar & Search Rail */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBlock: '0.25rem',
            }}
          >
            {/* Left Category Pill */}
            <div
              style={{
                width: '5.5rem',
                height: '1.25rem',
                borderRadius: '0.375rem',
                backgroundColor: '#d9d9d9',
              }}
            />

            {/* Right Action / Search Bar & Mini Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '8rem',
                  height: '1.25rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#d9d9d9',
                }}
              />
              <div
                style={{
                  width: '1.5rem',
                  height: '1.25rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#d9d9d9',
                }}
              />
            </div>
          </div>

          {/* E. 5-Column x 2-Row Uniform Light Gray Cards Grid (10 cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(2, minmax(13rem, 1fr))',
              gap: '1px',
              backgroundColor: '#131517',
              border: '1px solid #131517',
              borderRadius: '0.875rem',
              overflow: 'hidden',
            }}
          >
            {gridCards.map((_, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#d9d9d9',
                  minHeight: '14rem',
                  width: '100%',
                  transition: 'opacity 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '1';
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 3. Right Vertical Mini Utility Rail */}
      <aside
        style={{
          width: '2.5rem',
          flexShrink: 0,
          borderInlineStart: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0a0c0e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBlock: '1.25rem',
          gap: '0.875rem',
          zIndex: 10,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div
            key={item}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '0.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
            }}
          />
        ))}
      </aside>
    </div>
  );
}
