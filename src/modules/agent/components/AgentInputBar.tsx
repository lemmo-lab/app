'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus01,
  X01,
  Sparks,
  Sliders01,
  FolderUpload,
} from 'synthline/react';
import {
  AgentReferenceItem,
  AgentGenerationConfig,
} from '../types';
import { AgentConfigPopover } from './AgentConfigPopover';
import { AGENT_MODELS } from '../data/mockAgentData';

interface AgentInputBarProps {
  prompt: string;
  onChangePrompt: (value: string) => void;
  references: AgentReferenceItem[];
  onAddReference: (ref: AgentReferenceItem) => void;
  onRemoveReference: (id: string) => void;
  config: AgentGenerationConfig;
  onChangeConfig: (updater: (prev: AgentGenerationConfig) => AgentGenerationConfig) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  locale: string;
  isRtl: boolean;
  placeholder?: string;
}

export function AgentInputBar({
  prompt,
  onChangePrompt,
  references,
  onAddReference,
  onRemoveReference,
  config,
  onChangeConfig,
  onSubmit,
  isSubmitting = false,
  locale,
  isRtl,
  placeholder,
}: AgentInputBarProps) {
  const [configOpen, setConfigOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 24), 140)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((prompt.trim() || references.length > 0) && !isSubmitting) {
        onSubmit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      onAddReference({
        id: `ref-${Date.now()}`,
        url: objectUrl,
        name: file.name,
      });
      // reset input
      e.target.value = '';
    }
  };

  const currentModel = AGENT_MODELS.find((m) => m.id === config.modelId) || AGENT_MODELS[0];

  const defaultPlaceholder =
    locale === 'fa'
      ? 'ایده، صحنه یا کاراکتر مورد نظر خود را توصیف کنید... (Enter برای ارسال)'
      : 'Describe the scene, style, or lighting you want to create... (Enter to generate)';

  const canSubmit = (prompt.trim().length > 0 || references.length > 0) && !isSubmitting;

  return (
    <div className="agent-floating-input-wrapper">
      <div className="agent-input-bar">
        {/* 1. Reference Thumbnails Row (Visible only when references exist) */}
        {references.length > 0 && (
          <div className="input-references-tray">
            {references.map((item) => (
              <div key={item.id} className="input-ref-thumbnail" title={item.name || 'Reference'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="Reference" className="ref-thumb-img" />
                <button
                  type="button"
                  className="ref-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveReference(item.id);
                  }}
                  title={locale === 'fa' ? 'حذف رفرنس' : 'Remove reference'}
                  aria-label="Remove reference"
                >
                  <X01 size={11} strokeWidth={2.4} color="currentColor" />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-ref-mini-btn"
              onClick={() => fileInputRef.current?.click()}
              title={locale === 'fa' ? 'افزودن رفرنس بیشتر' : 'Add another reference'}
            >
              <Plus01 size={14} strokeWidth={2.2} color="currentColor" />
            </button>
          </div>
        )}

        {/* 2. Textarea Prompt Input */}
        <div className="input-textarea-area">
          <textarea
            ref={textareaRef}
            rows={1}
            className="prompt-textarea"
            placeholder={placeholder || defaultPlaceholder}
            value={prompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Agent prompt input"
          />
        </div>

        {/* 3. Action Bar: Upload Reference, Config Popover Pill, and Send CTA */}
        <div className="input-actions-row">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleFileChange}
            aria-hidden="true"
          />

          {/* Add Reference Button */}
          <div className="action-start-group">
            <button
              type="button"
              className="action-icon-pill-btn"
              onClick={() => fileInputRef.current?.click()}
              title={locale === 'fa' ? 'افزودن تصویر رفرنس' : 'Upload reference image'}
            >
              <Plus01 size={16} strokeWidth={2.2} color="currentColor" />
              <span className="action-pill-text">
                {locale === 'fa' ? 'تصویر رفرنس' : 'Reference'}
              </span>
            </button>
          </div>

          {/* End Group: Model Config Trigger + Send Button */}
          <div className="action-end-group">
            {/* Model & Aspect Ratio Trigger Pill */}
            <div className="config-popover-anchor">
              <button
                type="button"
                className={`model-config-trigger ${configOpen ? 'open' : ''}`}
                onClick={() => setConfigOpen(!configOpen)}
                title={locale === 'fa' ? 'تنظیمات مدل و ابعاد' : 'Model & frame settings'}
                aria-haspopup="dialog"
                aria-expanded={configOpen}
              >
                <Sliders01 size={14} strokeWidth={2} color="currentColor" />
                <span className="config-trigger-model-name">
                  {currentModel.name}
                </span>
                <span className="config-trigger-ratio">
                  {config.aspectRatio}
                </span>
              </button>

              {/* Interactive Config Popover */}
              <AgentConfigPopover
                config={config}
                onChangeConfig={onChangeConfig}
                isOpen={configOpen}
                onClose={() => setConfigOpen(false)}
                locale={locale}
              />
            </div>

            {/* Send CTA Button */}
            <button
              type="button"
              className={`agent-send-btn ${canSubmit ? 'ready' : 'disabled'}`}
              onClick={onSubmit}
              disabled={!canSubmit}
              title={locale === 'fa' ? 'تولید محتوا' : 'Generate'}
              aria-label="Generate"
            >
              <Sparks size={16} strokeWidth={2.2} color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
