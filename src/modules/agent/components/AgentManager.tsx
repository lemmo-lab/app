'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUiStore } from '@/stores/uiStore';
import {
  AgentGenerationConfig,
  AgentReferenceItem,
} from '../types';
import { AgentEmptyStateView } from './AgentEmptyStateView';
import { AgentChatView } from './AgentChatView';
import { AgentSingleContentView } from './AgentSingleContentView';

interface AgentManagerProps {
  viewMode: 'empty' | 'chat' | 'single';
  currentId?: string;
  initialPrompt?: string;
}

export default function AgentManager({
  viewMode,
  currentId = 'chat-01',
  initialPrompt,
}: AgentManagerProps) {
  const router = useRouter();
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';

  // Empty state form states
  const [emptyPrompt, setEmptyPrompt] = useState('');
  const [emptyReferences, setEmptyReferences] = useState<AgentReferenceItem[]>([]);
  const [emptyConfig, setEmptyConfig] = useState<AgentGenerationConfig>({
    contentType: 'image',
    aspectRatio: '1:1',
    modelId: 'gpt-image-2',
    batchCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmptySubmit = (expectedCost?: number) => {
    if (!emptyPrompt.trim() && emptyReferences.length === 0) return;
    setIsSubmitting(true);
    const chatId = `chat-${Date.now()}`;
    const costParam = expectedCost ? `&expectedCost=${expectedCost}` : '';
    router.push(`/app/agent/${chatId}?prompt=${encodeURIComponent(emptyPrompt.trim())}${costParam}`);
  };

  return (
    <div className="agent-engine-root" dir={dir}>
      {viewMode === 'empty' && (
        <AgentEmptyStateView
          prompt={emptyPrompt}
          onChangePrompt={setEmptyPrompt}
          references={emptyReferences}
          onAddReference={(ref) => setEmptyReferences((prev) => [...prev, ref])}
          onRemoveReference={(id) =>
            setEmptyReferences((prev) => prev.filter((r) => r.id !== id))
          }
          config={emptyConfig}
          onChangeConfig={setEmptyConfig}
          onSubmit={handleEmptySubmit}
          isSubmitting={isSubmitting}
          locale={locale}
          isRtl={isRtl}
        />
      )}

      {viewMode === 'chat' && (
        <AgentChatView
          currentId={currentId}
          initialPrompt={initialPrompt}
          locale={locale}
          isRtl={isRtl}
        />
      )}

      {viewMode === 'single' && (
        <AgentSingleContentView
          currentId={currentId}
          locale={locale}
          isRtl={isRtl}
        />
      )}
    </div>
  );
}
