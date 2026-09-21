/**
 * Canvas Top Floating Zoom Widget — /app/canvas/[id]
 *
 * Clean, modern viewport zoom dock located at the top center of the canvas.
 * Replaces the old solo/team toggle to give full focus to canvas viewport navigation.
 *
 * 100% Lemmo Design System tokens and logical CSS conventions.
 */

'use client';

import React from 'react';
import { Minus02, Plus01, Maximize01 } from 'synthline/react';

interface CanvasZoomWidgetProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  locale: string;
}

export function CanvasZoomWidget({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  locale,
}: CanvasZoomWidgetProps) {
  const isFa = locale === 'fa';
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="canvas-top-zoom-widget"
      role="group"
      aria-label={isFa ? 'کنترل‌های بزرگ‌نمایی بوم' : 'Canvas Zoom Controls'}
    >
      {/* Zoom Out Button */}
      <button
        type="button"
        className="zoom-widget-btn"
        onClick={onZoomOut}
        title={isFa ? 'کاهش بزرگ‌نمایی (Cmd -)' : 'Zoom Out (Cmd -)'}
        aria-label={isFa ? 'کاهش بزرگ‌نمایی' : 'Zoom Out'}
      >
        <Minus02 size={13} strokeWidth={1.8} color="currentColor" />
      </button>

      {/* Zoom Percentage Clickable Display */}
      <button
        type="button"
        className="zoom-widget-value-btn"
        onClick={onResetZoom}
        title={isFa ? 'بازنشانی بزرگ‌نمایی به ۱۰۰٪' : 'Reset Zoom to 100%'}
        aria-label={isFa ? 'بازنشانی به ۱۰۰٪' : 'Reset to 100%'}
        data-numeric="true"
      >
        {zoomPercent}%
      </button>

      {/* Zoom In Button */}
      <button
        type="button"
        className="zoom-widget-btn"
        onClick={onZoomIn}
        title={isFa ? 'افزایش بزرگ‌نمایی (Cmd +)' : 'Zoom In (Cmd +)'}
        aria-label={isFa ? 'افزایش بزرگ‌نمایی' : 'Zoom In'}
      >
        <Plus01 size={13} strokeWidth={1.8} color="currentColor" />
      </button>

      <div className="zoom-widget-divider" aria-hidden="true" />

      {/* Fit to Screen Button */}
      <button
        type="button"
        className="zoom-widget-btn fit-btn"
        onClick={onResetZoom}
        title={isFa ? 'انطباق با صفحه (Shift + 1)' : 'Fit to Screen (Shift + 1)'}
        aria-label={isFa ? 'انطباق با صفحه' : 'Fit to Screen'}
      >
        <Maximize01 size={13} strokeWidth={1.8} color="currentColor" />
      </button>
    </div>
  );
}
