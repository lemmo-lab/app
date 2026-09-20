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
}

export default function AgentManager({
  viewMode,
  currentId = 'chat-01',
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
    modelId: 'flux-1-dev',
    batchCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmptySubmit = () => {
    setIsSubmitting(true);
    // Transition to the chat conversation view
    router.push('/app/agent/chat-01');
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
