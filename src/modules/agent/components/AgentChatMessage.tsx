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
  onRemix,
}: AgentChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(message.isFavorite || false);
  const [showMeta, setShowMeta] = useState(false);
  const [jobMediaUrl, setJobMediaUrl] = useState<string | undefined>(undefined);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [jobStatus, setJobStatus] = useState<'idle' | 'running' | 'done' | 'failed'>('idle');

  const activeJobId =
    message.jobId ||
    (message as unknown as { job_id?: string }).job_id;
  const mediaUrl = message.resultMediaUrl || jobMediaUrl;

  useEffect(() => {
    if (!activeJobId || message.resultMediaUrl || jobMediaUrl) return;

    let isMounted = true;

    // Helper to extract and normalize image URL from results payload
    const extractUrlFromResults = (results?: Record<string, unknown>): string | undefined => {
      if (!results) return undefined;
      let url =
        (results.url as string) ||
        (results.output_url as string) ||
        (results.preview_url as string);
      if (!url && (results.object_key || results.output_object_key)) {
        const key = (results.object_key || results.output_object_key) as string;
        url = `http://localhost:9000/lemmo-artifacts/${key}`;
      }
      if (url && url.includes('minio:9000')) {
        url = url.replace('minio:9000', 'localhost:9000');
      }
      return url;
    };

    // 1. Immediately query job state via REST (handles historical/completed messages)
    sdk.jobs
      .get(activeJobId)
      .then((job) => {
        if (!isMounted) return;
        const jobResults = (job as unknown as { results?: Record<string, unknown> })?.results;
        const status = job.status as string;
        if (
          status === 'done' ||
          status === 'SUCCEEDED' ||
          status === 'completed' ||
          jobResults?.url ||
          jobResults?.output_url
        ) {
          setJobStatus('done');
          const url = extractUrlFromResults(jobResults);
          if (url) {
            setJobMediaUrl(url);
            return;
          }
          if (job.resultAssetId || jobResults?.asset_id) {
            const assetId = (job.resultAssetId || jobResults?.asset_id) as string;
            sdk.assets
              .get(assetId)
              .then((asset) => {
                if (isMounted && asset?.url) {
                  let assetUrl = asset.url;
                  if (assetUrl.includes('minio:9000')) {
                    assetUrl = assetUrl.replace('minio:9000', 'localhost:9000');
                  }
                  setJobMediaUrl(assetUrl);
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to live SSE stream
      });

    // 2. Subscribe to live progress feed
    const unsubscribe = sdk.jobs.subscribe(activeJobId, (event) => {
      if (!isMounted) return;
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
        const generatedUrl = extractUrlFromResults(results);
        if (generatedUrl) {
          setJobMediaUrl(generatedUrl);
        } else if (results?.asset_id) {
          sdk.assets
            .get(results.asset_id as string)
            .then((asset) => {
              if (isMounted && asset?.url) {
                let assetUrl = asset.url;
                if (assetUrl.includes('minio:9000')) {
                  assetUrl = assetUrl.replace('minio:9000', 'localhost:9000');
                }
                setJobMediaUrl(assetUrl);
              }
            })
            .catch(() => {});
        }
      } else if (event.status === 'failed' || event.status === 'FAILED') {
        setJobStatus('failed');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activeJobId, message.resultMediaUrl, jobMediaUrl]);

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
      {/* 2a. Text response bubble (streaming, completed, or failed) */}
      {(Boolean(message.text) || message.status === 'streaming' || message.status === 'failed') && (
        <div className={`assistant-text-bubble ${message.status === 'failed' ? 'failed-bubble' : ''}`}>
          <p className="assistant-text-content">
            {message.status === 'failed' ? (
              <span className="text-error" style={{ color: 'var(--lemmo-text-danger, #ff5462)' }}>
                {message.text || (locale === 'fa' ? 'خطا در ارسال یا پردازش درخواست.' : 'Failed to send or process prompt.')}
              </span>
            ) : (
              message.text
            )}
            {message.status === 'streaming' && (
              <span className="streaming-cursor animate-pulse">▋</span>
            )}
          </p>
          {message.status === 'failed' && onRemix && message.prompt && (
            <div className="assistant-error-actions" style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="assistant-retry-btn"
                onClick={() => onRemix(message.prompt || '')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 84, 98, 0.12)',
                  color: 'var(--lemmo-text-danger, #ff5462)',
                  border: '1px solid rgba(255, 84, 98, 0.3)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <RefreshCw size={13} strokeWidth={2} color="currentColor" />
                <span>{locale === 'fa' ? 'تلاش مجدد' : 'Retry'}</span>
              </button>
            </div>
          )}
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
