'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUiStore } from '@/stores/uiStore';
import {
  AgentGenerationConfig,
  AgentReferenceItem,
} from '../types';
import { AgentEmptyStateView } from './AgentEmptyStateView';
import { AgentChatView } from './AgentChatView';
import { AgentSingleContentView } from './AgentSingleContentView';
import { AgentHistoryDrawer } from './AgentHistoryDrawer';

interface AgentManagerProps {
  viewMode: 'empty' | 'chat' | 'single';
  currentId?: string;
  initialPrompt?: string;
}

export default function AgentManager({
  viewMode,
  currentId,
  initialPrompt,
}: AgentManagerProps) {
  const router = useRouter();
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';

  // Sub-sidebar drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('lemmo_agent_history_open');
        if (stored !== null) {
          setIsHistoryOpen(stored === 'true');
        } else {
          setIsHistoryOpen(false);
        }
      } catch {
        // Safe fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleHistory = () => {
    setIsHistoryOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lemmo_agent_history_open', String(next));
      } catch {
        // Safe fallback
      }
      return next;
    });
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
    try {
      localStorage.setItem('lemmo_agent_history_open', 'false');
    } catch {
      // Safe fallback
    }
  };

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
    const costParam = expectedCost ? `&expectedCost=${expectedCost}` : '';
    router.push(`/app/agent?prompt=${encodeURIComponent(emptyPrompt.trim())}${costParam}`);
  };

  return (
    <div className="agent-engine-root" dir={dir}>
      <div className="agent-engine-layout">
        <AgentHistoryDrawer
          isOpen={isHistoryOpen}
          onToggle={handleToggleHistory}
          onClose={handleCloseHistory}
          activeThreadId={viewMode === 'chat' ? currentId : undefined}
          locale={locale}
          isRtl={isRtl}
        />

        <main className="agent-engine-content">
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
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={handleToggleHistory}
            />
          )}

          {viewMode === 'chat' && (
            <AgentChatView
              currentId={currentId}
              initialPrompt={initialPrompt}
              locale={locale}
              isRtl={isRtl}
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={handleToggleHistory}
            />
          )}

          {viewMode === 'single' && (
            <AgentSingleContentView
              currentId={currentId}
              locale={locale}
              isRtl={isRtl}
            />
          )}
        </main>
      </div>
    </div>
  );
}
