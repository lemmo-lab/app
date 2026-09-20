'use client';

import React, { useRef, useEffect } from 'react';
import { Image03, VideoCamera, Check01, Sparks } from 'synthline/react';
import {
  AgentGenerationConfig,
  AgentContentType,
  AgentAspectRatio,
} from '../types';
import { AGENT_MODELS } from '../data/mockAgentData';

interface AgentConfigPopoverProps {
  config: AgentGenerationConfig;
  onChangeConfig: (updater: (prev: AgentGenerationConfig) => AgentGenerationConfig) => void;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

const ASPECT_RATIOS: { ratio: AgentAspectRatio; label: string; iconW: number; iconH: number }[] = [
  { ratio: '1:1', label: '1:1', iconW: 20, iconH: 20 },
  { ratio: '16:9', label: '16:9', iconW: 24, iconH: 14 },
  { ratio: '9:16', label: '9:16', iconW: 14, iconH: 24 },
  { ratio: '4:3', label: '4:3', iconW: 22, iconH: 17 },
  { ratio: '3:4', label: '3:4', iconW: 17, iconH: 22 },
];

export function AgentConfigPopover({
  config,
  onChangeConfig,
  isOpen,
  onClose,
  locale,
}: AgentConfigPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="agent-config-popover"
      role="dialog"
      aria-label={locale === 'fa' ? 'تنظیمات تولید ایجنت' : 'Agent Generation Settings'}
    >
      {/* 1. Media Type Switcher (Image vs Video) */}
      <div className="config-section type-switcher-section">
        <div className="type-toggle-track">
          <button
            type="button"
            className={`type-toggle-btn ${config.contentType === 'image' ? 'active' : ''}`}
            onClick={() =>
              onChangeConfig((prev) => ({ ...prev, contentType: 'image' }))
            }
          >
            <Image03 size={14} strokeWidth={2} color="currentColor" />
            <span>{locale === 'fa' ? 'تصویر' : 'Image'}</span>
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${config.contentType === 'video' ? 'active' : ''}`}
            onClick={() =>
              onChangeConfig((prev) => ({ ...prev, contentType: 'video' }))
            }
          >
            <VideoCamera size={14} strokeWidth={2} color="currentColor" />
            <span>{locale === 'fa' ? 'ویدیو' : 'Video'}</span>
          </button>
        </div>
      </div>

      {/* 2. Aspect Ratio Selector */}
      <div className="config-section">
        <span className="config-section-label">
          {locale === 'fa' ? 'نسبت ابعاد تصویر' : 'Aspect Ratio'}
        </span>
        <div className="ratio-options-row">
          {ASPECT_RATIOS.map((item) => {
            const isSelected = config.aspectRatio === item.ratio;
            return (
              <button
                key={item.ratio}
                type="button"
                className={`ratio-btn ${isSelected ? 'active' : ''}`}
                onClick={() =>
                  onChangeConfig((prev) => ({ ...prev, aspectRatio: item.ratio }))
                }
                title={item.label}
              >
                <div
                  className="ratio-preview-box"
                  style={{ width: `${item.iconW}px`, height: `${item.iconH}px` }}
                />
                <span className="ratio-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. AI Model Selector */}
      <div className="config-section">
        <span className="config-section-label">
          {locale === 'fa' ? 'موتور هوش مصنوعی' : 'AI Model Engine'}
        </span>
        <div className="model-options-list">
          {AGENT_MODELS.map((model) => {
            const isSelected = config.modelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                className={`model-option-btn ${isSelected ? 'active' : ''}`}
                onClick={() =>
                  onChangeConfig((prev) => ({ ...prev, modelId: model.id }))
                }
              >
                <div className="model-name-group">
                  <span className="model-name">{model.name}</span>
                  <span className="model-provider">{model.provider}</span>
                </div>
                {model.badge && (
                  <span className="model-badge">{model.badge}</span>
                )}
                {isSelected && (
                  <Check01
                    size={14}
                    strokeWidth={2.4}
                    color="var(--lemmo-surface-brand-background, #d1fe17)"
                    className="model-check-icon"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Batch Count */}
      <div className="config-section">
        <div className="batch-row">
          <span className="config-section-label">
            {locale === 'fa' ? 'تعداد خروجی' : 'Batch Outputs'}
          </span>
          <div className="batch-buttons-group">
            {([1, 2, 4] as const).map((count) => (
              <button
                key={count}
                type="button"
                className={`batch-count-btn ${config.batchCount === count ? 'active' : ''}`}
                onClick={() =>
                  onChangeConfig((prev) => ({ ...prev, batchCount: count }))
                }
              >
                {count}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Credit Cost Footer */}
      <div className="config-footer">
        <div className="credits-badge">
          <Sparks
            size={13}
            strokeWidth={2.2}
            color="var(--lemmo-surface-brand-background, #d1fe17)"
          />
          <span>
            {locale === 'fa'
              ? `${config.batchCount * 5} کردیت در هر تولید`
              : `${config.batchCount * 5} credits per generation`}
          </span>
        </div>
      </div>
    </div>
  );
}
