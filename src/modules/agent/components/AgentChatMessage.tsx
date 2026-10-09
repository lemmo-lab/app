'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'synthline/react';
import { sdk } from '@/sdk';
import { AgentChatMessageItem } from '../types';
import { getCommandsFromPrompt, cleanPromptText } from '../constants/agentCommands';
import { AgentCommandIcon } from './AgentCommandPalette';

interface AgentChatMessageProps {
  message: AgentChatMessageItem;
  onRemix?: (prompt: string) => void;
  locale: string;
  isRtl?: boolean;
}

export function AgentChatMessage({
  message,
  locale,
}: AgentChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(message.isFavorite || false);
  const [showMeta, setShowMeta] = useState(false);
  const [jobMediaUrl, setJobMediaUrl] = useState<string | undefined>(undefined);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [jobStatus, setJobStatus] = useState<'idle' | 'running' | 'done' | 'failed'>('idle');

  const mediaUrl = message.resultMediaUrl || jobMediaUrl;

  useEffect(() => {
    if (!message.jobId || message.resultMediaUrl || jobMediaUrl) return;

    const unsubscribe = sdk.jobs.subscribe(message.jobId, (event) => {
      setJobStatus('running');
      if (event.progressPercent !== undefined) {
        setJobProgress(event.progressPercent);
      }
      if (
        event.status === 'done' ||
        event.status === 'SUCCEEDED' ||
        event.type === 'job.terminal'
      ) {
        setJobStatus('done');
        const results = event.results as Record<string, unknown> | undefined;
        const generatedUrl = (results?.url as string) || (results?.preview_url as string);
        if (generatedUrl) {
          setJobMediaUrl(generatedUrl);
        } else if (results?.asset_id) {
          sdk.assets
            .get(results.asset_id as string)
            .then((asset) => {
              if (asset?.url) setJobMediaUrl(asset.url);
            })
            .catch(() => {
              // fallback
            });
        }
      } else if (event.status === 'failed' || event.status === 'FAILED') {
        setJobStatus('failed');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [message.jobId, message.resultMediaUrl, jobMediaUrl]);

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 1. User Prompt Message Row
  if (message.sender === 'user') {
    // Check if prompt uses any tools
    const toolsUsed = getCommandsFromPrompt(message.prompt);
    const cleanedText = cleanPromptText(message.prompt);

    return (
      <div className="agent-chat-row user-row">
        {/* 1. Reference images OUTSIDE and directly ABOVE the message bubble */}
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

        {/* 2. Pure User Prompt Bubble (ONLY text) */}
        <div className="user-prompt-bubble">
          <p className="user-prompt-text">
            {cleanedText || message.prompt}
          </p>
        </div>

        {/* 3. Actions Row below the bubble: Copy action & subtle informational tool indicator */}
        <div className="user-prompt-toolbar">
          <span className="user-toolbar-time">{message.timestamp}</span>

          {/* Subtle Informative Tool Indicator (No heavy styling, pure quiet info) */}
          {toolsUsed && toolsUsed.map((tool) => (
            <div
              key={tool.id}
              className="user-toolbar-tool-tag"
              title={`${locale === 'fa' ? tool.nameFa : tool.name} (${tool.command})`}
            >
              <AgentCommandIcon
                iconName={tool.iconName}
                size={13}
                strokeWidth={2}
                color="currentColor"
              />
              <span className="user-toolbar-tool-label">
                {locale === 'fa' ? tool.nameFa : tool.name}
              </span>
            </div>
          ))}

          {/* Copy Prompt Action */}
          {message.prompt && (
            <button
              type="button"
              className={`user-toolbar-action-btn ${isCopied ? 'copied' : ''}`}
              onClick={() => handleCopy(message.prompt)}
              title={locale === 'fa' ? (isCopied ? 'کپی شد!' : 'کپی پرامپت') : (isCopied ? 'Copied!' : 'Copy prompt')}
              aria-label="Copy prompt"
            >
              {isCopied ? (
                <Check01 size={14} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
              ) : (
                <Copy01 size={14} strokeWidth={1.8} color="currentColor" />
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
      {/* 2a. Text response bubble (streaming or completed) */}
      {message.text && (
        <div className="assistant-text-bubble">
          <p className="assistant-text-content">
            {message.text}
            {message.status === 'streaming' && (
              <span className="streaming-cursor animate-pulse">▋</span>
            )}
          </p>
        </div>
      )}

      {/* 2b. Job progress card during tool execution */}
      {jobStatus === 'running' && !mediaUrl && (
        <div className="assistant-job-progress-card">
          <RefreshCw
            size={18}
            strokeWidth={2.2}
            className="spin-animation"
            color="var(--lemmo-surface-brand-background, #d1fe17)"
          />
          <span>
            {locale === 'fa'
              ? `در حال اجرای ابزار و تولید خروجی... (${jobProgress}٪)`
              : `Executing tool & synthesizing output... (${jobProgress}%)`}
          </span>
        </div>
      )}

      {/* 2c. Result media frame when image/video is available */}
      {mediaUrl && (
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
                src={mediaUrl}
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
            href={mediaUrl}
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
    )}
  </div>
);
}
