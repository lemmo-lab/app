'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparks,
  Download01,
  Heart,
  Copy01,
  Check01,
  LayersThree,
  Eye,
  InfoCircle,
} from 'synthline/react';
import { AgentChatMessageItem } from '../types';

interface AgentChatMessageProps {
  message: AgentChatMessageItem;
  onRemix?: (prompt: string) => void;
  locale: string;
  isRtl: boolean;
}

export function AgentChatMessage({
  message,
  onRemix,
  locale,
  isRtl,
}: AgentChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(message.isFavorite || false);
  const [showMeta, setShowMeta] = useState(false);

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 1. User Prompt Message Row
  if (message.sender === 'user') {
    return (
      <div className="agent-chat-row user-row">
        <div className="user-prompt-card">
          {/* Reference Thumbnails directly above prompt text */}
          {message.references && message.references.length > 0 && (
            <div className="user-prompt-references-top">
              {message.references.map((ref) => (
                <div key={ref.id} className="user-ref-box" title={ref.name || 'Reference'}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ref.url} alt="Reference" className="ref-img" />
                </div>
              ))}
            </div>
          )}

          <p className="user-prompt-text">{message.prompt}</p>
        </div>

        {/* Ghost Action Toolbar below user card — matching assistant result toolbar */}
        <div className="user-prompt-toolbar">
          <span className="user-toolbar-time">{message.timestamp}</span>

          {message.prompt && (
            <button
              type="button"
              className={`user-toolbar-action-btn ${isCopied ? 'copied' : ''}`}
              onClick={() => handleCopy(message.prompt)}
              title={locale === 'fa' ? (isCopied ? 'کپی شد!' : 'کپی پرامپت') : (isCopied ? 'Copied!' : 'Copy prompt')}
              aria-label="Copy prompt"
            >
              {isCopied ? (
                <Check01 size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
              ) : (
                <Copy01 size={15} strokeWidth={1.8} color="currentColor" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Assistant Generated Output Message Row
  return (
    <div className="agent-chat-row assistant-row">
      <div className="assistant-result-frame">
        {/* Pure image frame without overlay buttons */}
        <div className="assistant-result-media">
          <Link
            href={`/app/agent/file-${message.id}`}
            className="media-link-wrapper"
            title={locale === 'fa' ? 'مشاهده در نمای جزئیات' : 'Inspect single content'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.resultMediaUrl}
              alt="AI Generated Output"
              className="generated-media-img"
            />
          </Link>
        </div>

        {/* Sleek action toolbar beneath image */}
        <div className="assistant-result-toolbar">
          <button
            type="button"
            className={`toolbar-action-btn ${showMeta ? 'active' : ''}`}
            onClick={() => setShowMeta(!showMeta)}
            title={locale === 'fa' ? 'مشخصات و متادیتا' : 'Parameters & Metadata'}
            aria-label="Metadata"
          >
            <InfoCircle size={15} strokeWidth={1.8} color="currentColor" />
          </button>

          <button
            type="button"
            className={`toolbar-action-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
            title={locale === 'fa' ? 'نشان کردن' : 'Favorite'}
            aria-label="Favorite"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              color={isFavorited ? 'var(--lemmo-text-danger, #ff5462)' : 'currentColor'}
            />
          </button>

          <Link
            href="/app/canvas"
            className="toolbar-action-btn"
            title={locale === 'fa' ? 'ارسال به بوم' : 'Open in Canvas'}
            aria-label="Open in Canvas"
          >
            <LayersThree size={15} strokeWidth={1.8} color="currentColor" />
          </Link>

          <Link
            href={`/app/agent/file-${message.id}`}
            className="toolbar-action-btn"
            title={locale === 'fa' ? 'نمای تک‌محتوا' : 'Inspect'}
            aria-label="Inspect"
          >
            <Eye size={15} strokeWidth={1.8} color="currentColor" />
          </Link>

          <a
            href={message.resultMediaUrl}
            download={`lemmo-agent-${message.id}.webp`}
            className="toolbar-action-btn"
            title={locale === 'fa' ? 'دانلود تصویر' : 'Download image'}
            aria-label="Download"
          >
            <Download01 size={15} strokeWidth={1.8} color="currentColor" />
          </a>
        </div>

        {/* Collapsible minimal metadata strip */}
        {showMeta && (
          <div className="assistant-meta-drawer">
            {message.modelUsed && (
              <span className="meta-drawer-chip model-chip">
                <Sparks size={12} strokeWidth={2.2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                <span>{message.modelUsed}</span>
              </span>
            )}
            {message.aspectRatio && (
              <span className="meta-drawer-chip">
                {message.aspectRatio}
              </span>
            )}
            {message.seed && (
              <span className="meta-drawer-chip">
                Seed: {message.seed}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
