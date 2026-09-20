/**
 * Agent Studio Page — Production Implementation
 * Route: /app/agent
 *
 * Fully modular implementation rendering AgentManager conforming to:
 * - DOC-FE-001 (Workspace Frontend Architecture)
 * - 100% token coverage from @lemmo-lab/tokens
 */

import React from 'react';
import type { Metadata } from 'next';
import { AgentManager } from '@/modules/agent';

export const metadata: Metadata = {
  title: 'Agent Studio | Lemmo Studio',
  description: 'AI generative agent workspace for multi-modal synthesis and style exploration.',
};

export default function AgentPage() {
  return <AgentManager viewMode="empty" />;
}
