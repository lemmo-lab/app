/**
 * Tools Index Page — Production Implementation
 * Route: /app/tools
 *
 * Fully modular implementation rendering ToolsManager conforming to:
 * - DOC-FE-001 (Workspace Frontend Architecture)
 * - app/.wireframe/tools/tools-index.html
 * - Complete token coverage from @lemmo-lab/tokens
 */

import React from 'react';
import type { Metadata } from 'next';
import { ToolsManager } from '@/modules/tools';

export const metadata: Metadata = {
  title: 'AI Tools & Model Engine',
  description: 'Discover, chain, and run advanced generative AI tools, vision models, and editing pipelines.',
};

export default function ToolsPage() {
  return <ToolsManager />;
}
