'use client';

import React from 'react';
import { Clock03 } from 'synthline/react';
import { AgentStyleDeck } from './AgentStyleDeck';
import { AgentInputBar } from './AgentInputBar';
import {
  AgentGenerationConfig,
  AgentReferenceItem,
  AgentStylePreset,
} from '../types';

interface AgentEmptyStateViewProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  references: AgentReferenceItem[];
  onAddReference: (ref: AgentReferenceItem) => void;
  onRemoveReference: (id: string) => void;
  config: AgentGenerationConfig;
  onChangeConfig: (updater: (prev: AgentGenerationConfig) => AgentGenerationConfig) => void;
  onSubmit: (expectedCost?: number) => void;
  isSubmitting?: boolean;
  locale: string;
  isRtl: boolean;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
}

export function AgentEmptyStateView({
  prompt,
  onChangePrompt,
  references,
  onAddReference,
  onRemoveReference,
  config,
  onChangeConfig,
  onSubmit,
  isSubmitting,
  locale,
  isRtl,
  isHistoryOpen,
  onToggleHistory,
}: AgentEmptyStateViewProps) {
  const handleSelectStyle = (preset: AgentStylePreset) => {
    onChangePrompt(locale === 'fa' ? preset.promptSuggestionFa : preset.promptSuggestionEn);
    onChangeConfig((prev) => ({
      ...prev,
      aspectRatio: preset.aspectRatio,
    }));
  };

  return (
    <div className="agent-empty-view-root">
      {/* Top Header bar with history toggle */}
      <header className="empty-state-header">
        <div className="empty-header-start">
          {onToggleHistory && (
            <button
              type="button"
              className={`history-toggle-btn ${isHistoryOpen ? 'active' : ''}`}
              onClick={onToggleHistory}
              aria-label={locale === 'fa' ? 'تاریخچه گفتگوها' : 'Chat History'}
              title={locale === 'fa' ? 'تاریخچه گفتگوها' : 'Chat History'}
            >
              <Clock03 size={16} strokeWidth={1.5} color="currentColor" />
            </button>
          )}
          <span className="empty-header-badge">
            {locale === 'fa' ? 'ایجنت استودیو' : 'Agent Studio'}
          </span>
        </div>
      </header>

      {/* Central Style Discovery Deck */}
      <div className="agent-empty-center-stage">
        <AgentStyleDeck onSelectStyle={handleSelectStyle} locale={locale} />
      </div>

      {/* Floating Bottom Input Bar */}
      <AgentInputBar
        prompt={prompt}
        onChangePrompt={onChangePrompt}
        references={references}
        onAddReference={onAddReference}
        onRemoveReference={onRemoveReference}
        config={config}
        onChangeConfig={onChangeConfig}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        locale={locale}
        isRtl={isRtl}
      />
    </div>
  );
}
