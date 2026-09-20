/**
 * Dynamic Agent Route — /app/agent/[id]
 *
 * Handles both:
 * 1. Conversational Chat View: /app/agent/[chat-id] (e.g. /app/agent/chat-01)
 * 2. Single Content Inspector: /app/agent/[file-id] (e.g. /app/agent/file-01 or ?view=single)
 *
 * 100% token-driven from @lemmo-lab/tokens via AgentManager.
 */

'use client';

import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { AgentManager } from '@/modules/agent';

export default function DynamicAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id || 'chat-01';
  const searchParams = useSearchParams();
  const viewQuery = searchParams.get('view');

  // Determine view mode based on query or filename convention
  const isFileView =
    viewQuery === 'single' ||
    (viewQuery !== 'chat' &&
      (id.startsWith('file') ||
        id.startsWith('img') ||
        id.startsWith('image') ||
        id.startsWith('asset') ||
        id.startsWith('content') ||
        id.includes('.')));

  return (
    <AgentManager
      viewMode={isFileView ? 'single' : 'chat'}
      currentId={id}
    />
  );
}
