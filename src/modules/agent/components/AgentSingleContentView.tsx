'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Plus01,
  Minus02,
  Share01,
  Download01,
  Heart,
  Maximize01,
  Sparks,
  Check01,
} from 'synthline/react';
import { AgentInputBar } from './AgentInputBar';
import {
  AgentGenerationConfig,
  AgentReferenceItem,
} from '../types';

interface AgentSingleContentViewProps {
  currentId?: string;
  locale: string;
  isRtl: boolean;
}

const FILMSTRIP_ITEMS = [
  {
    id: 'file-01',
    url: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
    title: 'Retro Studio Portrait',
  },
  {
    id: 'file-02',
    url: '/images/feed/an-anime-style-girl-with-translucent-moth-wings-and-fluffy.webp',
    title: 'Cyberpunk Moth Girl',
  },
  {
    id: 'file-03',
    url: '/images/feed/complex-multi-level-urban-highway-interchange-captured-using.webp',
    title: 'Urban Interchange',
  },
  {
    id: 'file-04',
    url: '/images/feed/futuristic-solarpunk-city-towering-mushroom-shaped.webp',
    title: 'Avant-garde Sculpture',
  },
];

export function AgentSingleContentView({
  currentId = 'file-01',
  locale,
  isRtl,
}: AgentSingleContentViewProps) {
  const [selectedItem, setSelectedItem] = useState(
    FILMSTRIP_ITEMS.find((item) => item.id === currentId) || FILMSTRIP_ITEMS[0]
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Input bar state
  const [prompt, setPrompt] = useState('');
  const [references, setReferences] = useState<AgentReferenceItem[]>([
    {
      id: 'ref-current',
      url: selectedItem.url,
      name: `${selectedItem.id}.webp`,
    },
  ]);
  const [config, setConfig] = useState<AgentGenerationConfig>({
    contentType: 'image',
    aspectRatio: '3:4',
    modelId: 'flux-1-dev',
    batchCount: 1,
  });

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="agent-single-view-root">
      {/* 1. Filmstrip Sidebar (start side) */}
      <aside className="agent-filmstrip-rail" aria-label="Media Filmstrip">
        <span className="filmstrip-label">
          {locale === 'fa' ? 'خروجی‌ها' : 'Gallery'}
        </span>
        <div className="filmstrip-scroll">
          {FILMSTRIP_ITEMS.map((item) => {
            const isActive = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`filmstrip-thumb-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedItem(item);
                  setReferences([
                    {
                      id: 'ref-current',
                      url: item.url,
                      name: `${item.id}.webp`,
                    },
                  ]);
                }}
                title={item.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.title} className="thumb-media" />
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="agent-single-canvas-area">
        {/* Top Control Header: Zoom Controls (Start) & Action Pills (Center/End) */}
        <div className="single-top-bar">
          {/* Zoom Controls */}
          <div className="zoom-controls-pill">
            <button
              type="button"
              className="zoom-btn"
              onClick={handleZoomOut}
              title="Zoom out"
              disabled={zoomLevel <= 50}
            >
              <Minus02 size={14} strokeWidth={2} color="currentColor" />
            </button>
            <button
              type="button"
              className="zoom-reset-btn"
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              <span>{zoomLevel}%</span>
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={handleZoomIn}
              title="Zoom in"
              disabled={zoomLevel >= 200}
            >
              <Plus01 size={14} strokeWidth={2} color="currentColor" />
            </button>
          </div>

          {/* Action Pills Bar */}
          <div className="single-actions-bar">
            <Link
              href="/app/canvas"
              className="action-bar-btn"
              title={locale === 'fa' ? 'افزودن به بوم' : 'Open in Canvas'}
            >
              <Maximize01 size={15} strokeWidth={2} color="currentColor" />
              <span>{locale === 'fa' ? 'بوم' : 'Canvas'}</span>
            </Link>

            <button
              type="button"
              className={`action-bar-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={() => setIsFavorited(!isFavorited)}
              title={locale === 'fa' ? 'افزودن به علاقه‌مندی' : 'Favorite'}
            >
              <Heart
                size={15}
                strokeWidth={2}
                color={isFavorited ? 'var(--lemmo-text-danger, #ff5462)' : 'currentColor'}
              />
            </button>

            <button
              type="button"
              className="action-bar-btn"
              onClick={handleShare}
              title={locale === 'fa' ? 'اشتراک‌گذاری' : 'Share link'}
            >
              {isCopied ? (
                <Check01 size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
              ) : (
                <Share01 size={15} strokeWidth={2} color="currentColor" />
              )}
            </button>

            <a
              href={selectedItem.url}
              download={`${selectedItem.id}.webp`}
              className="action-bar-btn primary-download"
              title={locale === 'fa' ? 'دانلود فایل' : 'Download'}
            >
              <Download01 size={15} strokeWidth={2} color="currentColor" />
              <span>{locale === 'fa' ? 'دانلود' : 'Download'}</span>
            </a>
          </div>
        </div>

        {/* Central Picture Frame with Natural Aspect Ratio */}
        <div className="single-picture-stage">
          <div
            className="single-picture-frame"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedItem.url}
              alt={selectedItem.title}
              className="single-media-element"
            />
          </div>
        </div>

        {/* Back Button (docked at bottom-start) */}
        <div className="single-back-dock">
          <Link
            href="/app/agent/chat-01"
            className="btn-back-to-chat"
            title={locale === 'fa' ? 'بازگشت به مکالمه' : 'Back to conversation'}
          >
            {isRtl ? (
              <ArrowRight size={16} strokeWidth={2.2} color="currentColor" />
            ) : (
              <ArrowLeft size={16} strokeWidth={2.2} color="currentColor" />
            )}
            <span>{locale === 'fa' ? 'بازگشت به مکالمه' : 'Back to Chat'}</span>
          </Link>
        </div>

        {/* Bottom Floating Prompt Bar for rapid iteration */}
        <AgentInputBar
          prompt={prompt}
          onChangePrompt={setPrompt}
          references={references}
          onAddReference={(ref) => setReferences((prev) => [...prev, ref])}
          onRemoveReference={(id) => setReferences((prev) => prev.filter((r) => r.id !== id))}
          config={config}
          onChangeConfig={setConfig}
          onSubmit={() => {
            alert(locale === 'fa' ? 'تولید نسخه جدید آغاز شد.' : 'Generating iteration...');
          }}
          locale={locale}
          isRtl={isRtl}
          placeholder={
            locale === 'fa'
              ? 'تغییرات مورد نظر روی این تصویر را بنویسید (ریمیکس)...'
              : 'Prompt adjustments for this image (Remix mode)...'
          }
        />
      </main>
    </div>
  );
}
