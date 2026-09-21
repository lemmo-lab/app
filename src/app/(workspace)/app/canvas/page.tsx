/**
 * Canvas Index Page — /app/canvas
 *
 * Production Implementation of the Lemmo Interactive Generative Canvas Index.
 * Conforms 100% to:
 * - DOC-FE-001 (Workspace Architecture)
 * - DOC-MOD-000 (Workspace Domain Modules)
 * - canvas-index.html wireframe
 * - 100% token coverage from @lemmo-lab/tokens
 */

import React from 'react';
import type { Metadata } from 'next';
import { CanvasManager } from '@/modules/canvas';

export const metadata: Metadata = {
  title: 'Interactive Canvas | Lemmo Studio',
  description: 'Infinite visual workspace for node-based AI workflows, multi-layer generative art composition, and style exploration.',
};

export default function CanvasPage() {
  return <CanvasManager />;
}
