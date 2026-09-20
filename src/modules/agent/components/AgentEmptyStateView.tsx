'use client';

import React from 'react';
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
  onSubmit: () => void;
  isSubmitting?: boolean;
  locale: string;
  isRtl: boolean;
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
