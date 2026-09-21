/**
 * Canvas Video Modal Component — /app/canvas
 * Lightweight modal preview for the upcoming canvas overview video.
 */

'use client';

import React, { useEffect } from 'react';
import { X01, Play, Sparks } from 'synthline/react';

interface CanvasVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasVideoModal({
  isOpen,
  onClose,
  locale,
  isRtl,
}: CanvasVideoModalProps) {
  const isFa = locale === 'fa';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="canvas-video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isFa ? 'ویدیوی معرفی بوم کار' : 'Canvas Overview Video'}
    >
      <div
        className="canvas-video-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="video-modal-header">
          <div className="video-modal-title-group">
            <Sparks size={16} strokeWidth={2.2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
            <h3 className="video-modal-title">
              {isFa ? 'ویدیوی معرفی بوم کار لیمو' : 'Lemmo Canvas Walkthrough'}
            </h3>
          </div>

          <button
            type="button"
            className="video-modal-close-btn"
            onClick={onClose}
            title={isFa ? 'بستن' : 'Close'}
            aria-label="Close modal"
          >
            <X01 size={16} strokeWidth={2} color="currentColor" />
          </button>
        </div>

        {/* Video Player / Presentation Area */}
        <div className="video-modal-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/feed/an-ultra-wide-heavily-flared-cinematic-rendering-depicts-a.webp"
            alt=""
            className="video-modal-backdrop"
          />
          <div className="video-screen-overlay">
            <div className="video-screen-play-badge">
              <Play size={22} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
            </div>
            <p className="video-screen-text">
              {isFa
                ? 'ویدیوی رسمی معرفی امکانات، اتصال نودها و میانبرهای کیبورد به‌زودی در این بخش قرار می‌گیرد.'
                : 'Official product walkthrough, node-chaining tutorial, and keyboard shortcuts coming soon.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
