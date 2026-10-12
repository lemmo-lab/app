'use client';

/**
 * Agent Studio Page — Production Implementation
 * Route: /app/agent
 *
 * Fully modular implementation rendering AgentManager conforming to:
 * - DOC-FE-001 (Workspace Frontend Architecture)
 * - 100% token coverage from @lemmo-lab/tokens
 */

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AgentManager } from '@/modules/agent';

function AgentPageContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || undefined;
  return <AgentManager viewMode={prompt ? 'chat' : 'empty'} initialPrompt={prompt} />;
}

export default function AgentPage() {
  return (
    <Suspense fallback={<AgentManager viewMode="empty" />}>
      <AgentPageContent />
    </Suspense>
  );
}
