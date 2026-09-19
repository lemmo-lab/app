/**
 * DialPagination Component — Analog Tuner Dial Pagination
 * Faithfully built from app/.wireframe/layout/pagintion.html
 *
 * Features:
 * - Analog tuning dial aesthetics with glowing active bracket
 * - Ghost ticks past both ends for continuous analog look
 * - Optical depth-of-field blur and opacity scaling
 * - Cubic-bezier ease-out knob settling physics (RAF animation)
 * - Direction-aware (RTL/LTR) flipping
 * - Keyboard navigation (Arrow keys, Home, End)
 * - 100% tokenized design
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'synthline/react';

interface DialPaginationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
  dir?: 'ltr' | 'rtl';
  ghosts?: number;
  className?: string;
}

export default function DialPagination({
  total,
  current,
  onChange,
  dir = 'ltr',
  ghosts = 6,
  className = '',
}: DialPaginationProps) {
  const isRtl = dir === 'rtl';
  const rootRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const allTicksRef = useRef<(HTMLButtonElement | HTMLSpanElement | null)[]>([]);
  const posRef = useRef<number>(current);
  const rafRef = useRef<number>(0);

  // Total ticks = ghosts on start + actual pages + ghosts on end
  const totalTicks = ghosts + total + ghosts;

  // Paint function: updates --pos, --t (distance/fade), and --a (active magnitude)
  const paint = useCallback((p: number) => {
    posRef.current = p;
    if (rootRef.current) {
      rootRef.current.style.setProperty('--pos', String(p));
    }
    allTicksRef.current.forEach((el, k) => {
      if (!el) return;
      const d = Math.abs(k - ghosts - p);
      el.style.setProperty('--t', String(Math.min(1, d / 5.5)));
      el.style.setProperty('--a', String(Math.max(0, 1 - d)));
    });
  }, [ghosts]);

  // Smooth ease-out knob animation to new index
  const animateTo = useCallback((targetIndex: number) => {
    cancelAnimationFrame(rafRef.current);
    const from = posRef.current;
    const dur = Math.min(700, 320 + Math.abs(targetIndex - from) * 60);
    let t0: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      paint(targetIndex);
      return;
    }

    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const k = Math.min(1, (t - t0) / dur);
      // Ease-out cubic: 1 - Math.pow(1 - k, 3)
      const currentVal = from + (targetIndex - from) * (1 - Math.pow(1 - k, 3));
      paint(currentVal);
      if (k < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [paint]);

  // Sync when current index changes from parent
  useEffect(() => {
    animateTo(current);
  }, [current, animateTo]);

  // Cleanup RAF
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleTickClick = (pageIdx: number) => {
    onChange(pageIdx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((current - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((current + 1) % total);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const delta = isRtl ? (e.key === 'ArrowRight' ? -1 : e.key === 'ArrowLeft' ? 1 : null) : (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : null);
    if (e.key === 'Home') {
      e.preventDefault();
      onChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(total - 1);
    } else if (delta !== null) {
      e.preventDefault();
      onChange((current + delta + total) % total);
    }
  };

  // Build ticks array
  const ticks = [];
  for (let k = 0; k < totalTicks; k++) {
    const pageIdx = k - ghosts;
    const isGhost = pageIdx < 0 || pageIdx >= total;
    ticks.push({ k, pageIdx, isGhost });
  }

  return (
    <div
      ref={rootRef}
      className={`dial ${className}`}
      dir={dir}
      data-ghosts={ghosts}
      style={{
        ['--g' as any]: ghosts,
        ['--pos' as any]: current,
        ['--dir' as any]: isRtl ? -1 : 1,
      }}
      role="group"
      aria-label="Dial Pagination"
      onKeyDown={handleKeyDown}
    >
      {/* Prev Arrow Button (Hidden at rest, revealed on hover) */}
      <button
        type="button"
        className="dial-arrow dial-prev"
        aria-label={isRtl ? 'اسلاید بعدی' : 'Previous slide'}
        onClick={isRtl ? handleNext : handlePrev}
        title={isRtl ? 'بعدی' : 'Previous'}
      >
        <ChevronLeft size={12} strokeWidth={2.4} color="currentColor" />
      </button>

      {/* Dial Window with Gradient Edge Masks */}
      <div className="dial-window">
        <div className="dial-flip">
          <div ref={stripRef} className="dial-strip" role="tablist" aria-label="Slides">
            {ticks.map(({ k, pageIdx, isGhost }) => {
              if (isGhost) {
                return (
                  <span
                    key={`ghost-${k}`}
                    ref={(el) => { allTicksRef.current[k] = el; }}
                    className="dial-tick is-ghost"
                    aria-hidden="true"
                  >
                    <i className="dial-mark" />
                  </span>
                );
              }

              const isSelected = pageIdx === current;
              return (
                <button
                  key={`page-${pageIdx}`}
                  ref={(el) => { allTicksRef.current[k] = el; }}
                  type="button"
                  role="tab"
                  className="dial-tick"
                  aria-selected={isSelected}
                  aria-label={`Slide ${pageIdx + 1} of ${total}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleTickClick(pageIdx)}
                >
                  <i className="dial-mark" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Glowing Centered Active Bracket */}
        <span className="dial-bracket" aria-hidden="true" />
      </div>

      {/* Next Arrow Button (Hidden at rest, revealed on hover) */}
      <button
        type="button"
        className="dial-arrow dial-next"
        aria-label={isRtl ? 'اسلاید قبلی' : 'Next slide'}
        onClick={isRtl ? handlePrev : handleNext}
        title={isRtl ? 'قبلی' : 'Next'}
      >
        <ChevronRight size={12} strokeWidth={2.4} color="currentColor" />
      </button>

      <style jsx>{`
        .dial {
          --pitch: 13px;
          --dial-accent: var(--lemmo-surface-brand-background, #d1fe17);
          --dial-color: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          color: #ffffff;
          font-family: inherit;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }

        :global([dir='rtl']) .dial {
          --dir: -1;
        }

        /* The scale fades out at both ends like an analog tuning dial */
        .dial-window {
          position: relative;
          width: calc(var(--pitch) * 9);
          max-width: 100%;
          height: 26px;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 24%,
            #000 76%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 24%,
            #000 76%,
            transparent 100%
          );
        }

        .dial-flip {
          position: absolute;
          inset: 0;
        }

        :global([dir='rtl']) .dial-flip {
          transform: scaleX(-1);
        }

        .dial-strip {
          position: absolute;
          inset-block: 0;
          left: 50%;
          display: flex;
          direction: ltr;
          /* Slides so the tick at --pos sits exactly under the bracket */
          transform: translateX(
            calc((var(--pos) + var(--g, 0) + 0.5) * var(--pitch) * -1)
          );
          will-change: transform;
        }

        :global(.dial-tick) {
          position: relative;
          flex: none;
          display: grid;
          place-items: center;
          width: var(--pitch);
          height: 100%;
          padding: 0;
          border: 0;
          background: none;
          color: inherit;
          cursor: pointer;
        }

        :global(.dial-tick.is-ghost) {
          cursor: default;
          pointer-events: none;
        }

        :global(.dial-tick:focus-visible) {
          outline: none;
        }

        :global(.dial-tick:focus-visible .dial-mark) {
          box-shadow: 0 0 0 2px var(--dial-accent, #d1fe17);
        }

        /* Delicate tick lines: --t: 0 at center -> 1 at edges. --a: 1 for active tick */
        :global(.dial-mark) {
          display: block;
          width: calc(1.5px + var(--a, 0) * 0.5px);
          height: calc(6px + var(--a, 0) * 8px);
          border-radius: 1px;
          background: var(--dial-color, #ffffff);
          opacity: calc((1 - var(--t, 1) * var(--t, 1) * 0.88) * (0.75 + var(--a, 0) * 0.25));
          filter: blur(calc(var(--t, 1) * var(--t, 1) * 1.5px));
          box-shadow: 0 0 calc(var(--a, 0) * 6px) rgba(255, 255, 255, calc(var(--a, 0) * 0.5));
          transition: background-color 0.15s ease;
        }

        :global(.dial-tick:not(.is-ghost):hover .dial-mark) {
          opacity: 1;
        }

        /* Delicate Glowing Active Bracket */
        .dial-bracket {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 10px;
          height: 20px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .dial-bracket::before,
        .dial-bracket::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2.5px;
          border: 1px solid var(--dial-accent, #d1fe17);
          filter: drop-shadow(0 0 3px rgba(209, 254, 23, 0.65));
        }

        .dial-bracket::before {
          left: 0;
          border-right: 0;
          border-radius: 2px 0 0 2px;
        }

        .dial-bracket::after {
          right: 0;
          border-left: 0;
          border-radius: 0 2px 2px 0;
        }

        /* Arrows: Completely hidden in normal state, reveal on hover without clutter */
        .dial-arrow {
          display: grid;
          place-items: center;
          width: 22px;
          height: 22px;
          padding: 0;
          border: none;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: transparent;
          color: var(--lemmo-text-secondary, #b5b6b8);
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.25s ease, background 0.15s ease, color 0.15s ease;
        }

        .dial-prev {
          transform: translateX(calc(4px * var(--dir, 1)));
        }

        .dial-next {
          transform: translateX(calc(-4px * var(--dir, 1)));
        }

        :global(.hero-banner-card:hover) .dial-arrow,
        .dial:hover .dial-arrow,
        .dial:focus-within .dial-arrow {
          opacity: 0.85;
          pointer-events: auto;
          transform: translateX(0);
        }

        .dial-arrow:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
        }

        .dial-arrow:focus-visible {
          outline: 1.5px solid var(--dial-accent, #d1fe17);
          outline-offset: 1px;
        }

        @media (hover: none) {
          .dial-arrow {
            opacity: 0.7;
            pointer-events: auto;
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .dial {
            --pitch: 11px;
          }

          .dial-window {
            width: calc(var(--pitch) * 7);
            height: 22px;
          }

          .dial-bracket {
            width: 8px;
            height: 18px;
          }

          .dial-arrow {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
}
