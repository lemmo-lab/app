/**
 * Canvas Top Mode Switcher Component — /app/canvas/[id]
 *
 * Implements the floating top-center mode switcher (.team-solo) from canvas-01.html:
 * 1. Solo Mode: Focus mode for individual creators.
 * 2. Team Mode: Real-time collaborative workspace mode with active presence indicators.
 *
 * 100% token-based styling using modern logical CSS properties.
 */

'use client';

import React from 'react';
import { User03, Users01 } from 'synthline/react';
import { CanvasMode } from '../types';

interface CanvasTopModeSwitcherProps {
  mode: CanvasMode;
  onChangeMode: (newMode: CanvasMode) => void;
  locale: string;
}

export function CanvasTopModeSwitcher({
  mode,
  onChangeMode,
  locale,
}: CanvasTopModeSwitcherProps) {
  const isFa = locale === 'fa';

  return (
    <div
      className="canvas-top-mode-switcher"
      role="radiogroup"
      aria-label={isFa ? 'حالت کاری بوم' : 'Canvas Collaboration Mode'}
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'solo'}
        className={`mode-switch-btn ${mode === 'solo' ? 'active' : ''}`}
        onClick={() => onChangeMode('solo')}
        title={isFa ? 'حالت انفرادی: تمرکز بر کار شخصی' : 'Solo Mode: Personal focus'}
        aria-label={isFa ? 'حالت انفرادی' : 'Solo Mode'}
      >
        <User03 size={15} strokeWidth={1.5} color="currentColor" />
        <span className="mode-label">{isFa ? 'انفرادی' : 'Solo'}</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === 'team'}
        className={`mode-switch-btn ${mode === 'team' ? 'active' : ''}`}
        onClick={() => onChangeMode('team')}
        title={isFa ? 'حالت تیمی: همکاری زنده و همزمان' : 'Team Mode: Live multi-user'}
        aria-label={isFa ? 'حالت تیمی' : 'Team Mode'}
      >
        <Users01 size={15} strokeWidth={1.5} color="currentColor" />
        <span className="mode-label">{isFa ? 'تیمی' : 'Team'}</span>

        {mode === 'team' && (
          <span className="team-live-indicator" title={isFa ? '۲ نفر آنلاین' : '2 Online'}>
            <span className="live-dot" />
            <span className="live-count" data-numeric="true">
              2
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
