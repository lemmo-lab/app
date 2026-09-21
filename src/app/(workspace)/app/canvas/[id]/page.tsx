/**
 * Dynamic Canvas Project Workspace Route — /app/canvas/[id]
 *
 * Implements the interactive Canvas workspace & node editor for a specific project.
 * Supports arbitrary project IDs (e.g. /app/canvas/canvas-01, /app/canvas/[proje-unique-id]).
 *
 * 100% token-driven from @lemmo-lab/tokens via CanvasWorkspaceEditor.
 */

'use client';

import React, { use } from 'react';
import CanvasWorkspaceEditor from '@/modules/canvas/components/CanvasWorkspaceEditor';

export default function DynamicCanvasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id || 'canvas-01';

  return <CanvasWorkspaceEditor projectId={projectId} />;
}
