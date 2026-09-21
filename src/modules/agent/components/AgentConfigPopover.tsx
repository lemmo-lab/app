'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Image03,
  VideoCamera,
  Check01,
  Sparks,
  ChevronSelectorVertical,
} from 'synthline/react';
import {
  AgentGenerationConfig,
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
  { ratio: '1:1', label: '1:1', iconW: 18, iconH: 18 },
  { ratio: '16:9', label: '16:9', iconW: 24, iconH: 14 },
  { ratio: '9:16', label: '9:16', iconW: 14, iconH: 24 },
  { ratio: '4:3', label: '4:3', iconW: 21, iconH: 16 },
  { ratio: '3:4', label: '3:4', iconW: 16, iconH: 21 },
];

export function AgentConfigPopover({
  config,
  onChangeConfig,
  isOpen,
  onClose,
  locale,
}: AgentConfigPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) {
      setIsModelDropdownOpen(false);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModelDropdownOpen) {
          setIsModelDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isModelDropdownOpen, onClose]);

  if (!isOpen) return null;

  const currentModel =
    AGENT_MODELS.find((m) => m.id === config.modelId) || AGENT_MODELS[0];

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

      {/* 2. Aspect Ratio Selector (5 frames matching wireframe .frame-choice) */}
      <div className="config-section">
        <div className="config-section-header">
          <span className="config-section-label">
            {locale === 'fa' ? 'نسبت ابعاد' : 'Aspect Ratio'}
          </span>
          <span className="config-active-pill">{config.aspectRatio}</span>
        </div>
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

      {/* 3. AI Model Selector (Dropdown Menu matching wireframe .model-dropdown) */}
      <div className="config-section model-section">
        <div className="config-section-header">
          <span className="config-section-label">
            {locale === 'fa' ? 'مدل هوش مصنوعی' : 'AI Model'}
          </span>
        </div>

        {/* Dropdown Trigger */}
        <div className="model-dropdown-container">
          <button
            type="button"
            className={`model-dropdown-trigger ${isModelDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={isModelDropdownOpen}
          >
            <div className="model-trigger-start">
              <Sparks
                size={14}
                strokeWidth={2.2}
                color="var(--lemmo-surface-brand-background, #d1fe17)"
              />
              <span className="model-trigger-name">{currentModel.name}</span>
            </div>

            <div className="model-trigger-end">
              {currentModel.badge && (
                <span className="model-badge">{currentModel.badge}</span>
              )}
              <ChevronSelectorVertical
                size={14}
                strokeWidth={2}
                color="var(--lemmo-text-muted, #898a8b)"
              />
            </div>
          </button>

          {/* Dropdown Popover List */}
          {isModelDropdownOpen && (
            <div className="model-dropdown-menu" role="listbox">
              {AGENT_MODELS.map((model) => {
                const isSelected = config.modelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`model-dropdown-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onChangeConfig((prev) => ({ ...prev, modelId: model.id }));
                      setIsModelDropdownOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="model-item-details">
                      <span className="model-item-name">{model.name}</span>
                      <span className="model-item-provider">{model.provider}</span>
                    </div>

                    <div className="model-item-trailing">
                      {model.badge && (
                        <span className="model-badge">{model.badge}</span>
                      )}
                      {isSelected && (
                        <Check01
                          size={14}
                          strokeWidth={2.4}
                          color="var(--lemmo-surface-brand-background, #d1fe17)"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Batch Count (1, 2, 3, 4 matching wireframe .number-result) */}
      <div className="config-section">
        <div className="config-section-header">
          <span className="config-section-label">
            {locale === 'fa' ? 'تعداد خروجی' : 'Outputs'}
          </span>
        </div>
        <div className="batch-options-track">
          {([1, 2, 3, 4] as const).map((count) => {
            const isSelected = config.batchCount === count;
            return (
              <button
                key={count}
                type="button"
                className={`batch-count-btn ${isSelected ? 'active' : ''}`}
                onClick={() =>
                  onChangeConfig((prev) => ({ ...prev, batchCount: count }))
                }
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Credit Cost Footer (matching wireframe .creadit) */}
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
