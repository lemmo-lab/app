'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Download01,
  Heart,
  Share01,
  LayersThree,
  Maximize01,
  Check01,
  Image03,
  ArrowUp,
  X01,
  RefreshCw,
  InfoCircle,
} from 'synthline/react';
import { AgentReferenceItem } from '../types';
import { AgentCommandPalette, AgentCommandIcon } from './AgentCommandPalette';
import { AgentActiveToolStrip } from './AgentActiveToolStrip';
import { useAgentSlashCommands } from '../hooks/useAgentSlashCommands';

interface AgentSingleContentViewProps {
  currentId?: string;
  locale: string;
  isRtl: boolean;
}

const DEFAULT_RESULT_IMAGE =
  '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp';

export function AgentSingleContentView({
  currentId = 'file-01',
  locale,
  isRtl,
}: AgentSingleContentViewProps) {
  const router = useRouter();

  // State
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_RESULT_IMAGE);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Edit input bar state (purely input + references, no model selection)
  const [prompt, setPrompt] = useState<string>('');
  const [references, setReferences] = useState<AgentReferenceItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        130
      )}px`;
    }
  }, [prompt]);

  // Share handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Add reference handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newRef: AgentReferenceItem = {
      id: `ref-${Date.now()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    };
    setReferences((prev) => [...prev, newRef]);
    e.target.value = '';
  };

  const handleRemoveReference = (id: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const {
    isOpen: isCommandMenuOpen,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown: handleCommandKeyDown,
    handleSelectCommand,
    activeTool,
    handleRemoveActiveTool,
  } = useAgentSlashCommands({
    prompt,
    onChangePrompt: setPrompt,
    textareaRef,
  });

  // Submit edit / iteration handler
  const handleSubmit = () => {
    if (!prompt.trim() && references.length === 0 && !activeTool) return;
    setIsSubmitting(true);

    if (activeTool) {
      handleRemoveActiveTool();
    }

    // Simulate iteration processing and redirect back to conversation with edited output
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/app/agent/chat-01');
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (handleCommandKeyDown(e)) {
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isReady = (prompt.trim().length > 0 || references.length > 0 || activeTool !== null) && !isSubmitting;
  const isButtonDisabled = !mounted ? true : (!isReady || isSubmitting);

  return (
    <div className="agent-single-view-root">
      {/* ===== TOP BAR (Back button at Start, Action pills at End) ===== */}
      <header className="single-top-bar">
        {/* Back Button (matching single feed page pattern) */}
        <Link
          href="/app/agent/chat-01"
          className="single-back-btn"
          title={locale === 'fa' ? 'بازگشت به مکالمه' : 'Back to chat'}
          aria-label="Back to chat"
        >
          <div className="single-back-btn-inner">
            {isRtl ? (
              <ArrowRight size={16} strokeWidth={2.4} color="currentColor" />
            ) : (
              <ArrowLeft size={16} strokeWidth={2.4} color="currentColor" />
            )}
            <span className="back-label">
              {locale === 'fa' ? 'بازگشت' : 'Back'}
            </span>
          </div>
        </Link>

        {/* Quick Actions (docked at the End side) */}
        <div className="single-actions-bar">
          <Link
            href="/app/canvas"
            className="single-action-pill-btn"
            title={locale === 'fa' ? 'ارسال به بوم' : 'Open in Canvas'}
          >
            <LayersThree size={15} strokeWidth={1.8} color="currentColor" />
            <span className="action-label">{locale === 'fa' ? 'بوم' : 'Canvas'}</span>
          </Link>

          <button
            type="button"
            className={`single-action-pill-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
            title={locale === 'fa' ? 'نشان کردن' : 'Favorite'}
            aria-label="Favorite"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              color={isFavorited ? 'var(--lemmo-text-danger, #ff5462)' : 'currentColor'}
            />
            <span className="action-label">{locale === 'fa' ? 'نشان' : 'Favorite'}</span>
          </button>

          <button
            type="button"
            className="single-action-pill-btn"
            onClick={handleShare}
            title={locale === 'fa' ? 'اشتراک‌گذاری' : 'Share link'}
            aria-label="Share"
          >
            {isCopied ? (
              <Check01 size={15} strokeWidth={2.4} color="var(--lemmo-surface-brand-background, #d1fe17)" />
            ) : (
              <Share01 size={15} strokeWidth={1.8} color="currentColor" />
            )}
            <span className="action-label">
              {locale === 'fa'
                ? isCopied
                  ? 'کپی شد'
                  : 'اشتراک'
                : isCopied
                ? 'Copied'
                : 'Share'}
            </span>
          </button>

          <button
            type="button"
            className="single-action-pill-btn"
            onClick={() => setIsFullscreen(true)}
            title={locale === 'fa' ? 'نمای تمام صفحه' : 'Fullscreen'}
            aria-label="Fullscreen"
          >
            <Maximize01 size={15} strokeWidth={1.8} color="currentColor" />
            <span className="action-label">{locale === 'fa' ? 'بزرگ‌نمایی' : 'Fullscreen'}</span>
          </button>

          <a
            href={imageUrl}
            download={`lemmo-agent-${currentId}.webp`}
            className="single-action-pill-btn primary-download"
            title={locale === 'fa' ? 'دانلود تصویر' : 'Download'}
            aria-label="Download"
          >
            <Download01 size={15} strokeWidth={2} color="currentColor" />
            <span className="action-label">{locale === 'fa' ? 'دانلود' : 'Download'}</span>
          </a>
        </div>
      </header>

      {/* ===== CENTRAL PICTURE CANVAS (Centered focused media, No filmstrip) ===== */}
      <main className="single-picture-stage">
        <div className="single-picture-frame" onClick={() => setIsFullscreen(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Generated Result"
            className="single-media-element"
          />
        </div>
      </main>

      {/* ===== BOTTOM FLOATING EDIT INPUT BAR (Only Input + Add Reference, No Model Picker) ===== */}
      <div className="agent-floating-input-wrapper">
        <div className="agent-edit-input-bar">
          {/* Hidden Slash Command Palette Popup (Docked directly above input bar) */}
          {isCommandMenuOpen && (
            <AgentCommandPalette
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              onSelectCommand={handleSelectCommand}
              onHoverIndex={setSelectedIndex}
              locale={locale}
            />
          )}

          {/* Floating Active Tool Pill (Docked cleanly above the input bar) */}
          {activeTool && (
            <div className="agent-floating-tool-anchor">
              <AgentActiveToolStrip
                tool={activeTool}
                onRemove={handleRemoveActiveTool}
                locale={locale}
              />
            </div>
          )}

          {/* Reference Thumbnails Tray (Visible only when reference files exist) */}
          {references.length > 0 && (
            <div className="input-references-tray">
              {references.map((ref) => (
                <div key={ref.id} className="input-ref-thumbnail">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ref.url} alt={ref.name || 'Reference'} className="ref-thumb-img" />
                  <button
                    type="button"
                    className="ref-remove-btn"
                    onClick={() => handleRemoveReference(ref.id)}
                    title={locale === 'fa' ? 'حذف رفرنس' : 'Remove'}
                    aria-label="Remove reference"
                  >
                    <X01 size={11} strokeWidth={2.4} color="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea for edit prompt */}
          <div className="input-textarea-area">
            <textarea
              ref={textareaRef}
              className="prompt-textarea"
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeTool
                  ? locale === 'fa'
                    ? `تغییرات مربوط به ${activeTool.nameFa} را بنویسید (اختیاری)...`
                    : `Describe edits for ${activeTool.name} (optional)...`
                  : locale === 'fa'
                    ? 'تغییرات مورد نظر روی این تصویر را بنویسید (مثلاً: تغییر نورپردازی، اصلاح لباس، افزودن پس‌زمینه...)'
                    : 'Describe edits or changes for this image (e.g., change lighting, modify details, add background)...'
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Actions Row: Add Reference at Start, Send/Submit at End */}
          <div className="input-actions-row">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleFileChange}
            />

            <div className="action-start-group">
              <button
                type="button"
                className="action-icon-pill-btn"
                onClick={() => fileInputRef.current?.click()}
                title={locale === 'fa' ? 'افزودن تصویر مرجع' : 'Add Reference Image'}
                disabled={isSubmitting}
              >
                <Image03 size={15} strokeWidth={2} color="currentColor" />
                <span>{locale === 'fa' ? 'افزودن رفرنس' : 'Add Reference'}</span>
              </button>
            </div>

            <div className="action-end-group">
              <button
                type="button"
                className={`agent-send-btn ${isReady && !isSubmitting ? 'ready' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                suppressHydrationWarning
                title={
                  locale === 'fa'
                    ? isSubmitting
                      ? 'در حال اعمال تغییرات...'
                      : 'اعمال تغییرات روی تصویر'
                    : isSubmitting
                    ? 'Applying changes...'
                    : 'Apply edits to image'
                }
                aria-label="Submit edit"
              >
                {isSubmitting ? (
                  <RefreshCw size={16} strokeWidth={2.4} className="spin-animation" color="currentColor" />
                ) : (
                  <ArrowUp size={18} strokeWidth={2.4} color="currentColor" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FULLSCREEN LIGHTBOX MODAL ===== */}
      {isFullscreen && (
        <div
          className="fullscreen-lightbox"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="close-lightbox-btn"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Fullscreen Result"
            className="lightbox-full-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
