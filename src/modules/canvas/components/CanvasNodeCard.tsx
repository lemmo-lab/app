/**
 * Canvas Node Card Component — /app/canvas/[id]
 *
 * Visual node representation on the 2D canvas surface.
 * Represents modular AI tools (FLUX.1, Background Remover, Upscaler) with:
 * 1. Typed In/Out connector sockets (image, prompt, mask).
 * 2. Parameter preview and prompt controls.
 * 3. Generation status states (idle, running, success).
 * 4. Interactive pointer drag support.
 *
 * 100% token-based styling conforming to Lemmo Design System.
 */

'use client';

import React, { useRef, useCallback } from 'react';
import {
  AiMagicWand01,
  Trash01,
  Sparks,
  CheckCircle01,
} from 'synthline/react';
import { CanvasNode } from '../types';

interface CanvasNodeCardProps {
  node: CanvasNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDelete: (nodeId: string, e: React.MouseEvent) => void;
  onUpdatePosition: (nodeId: string, newX: number, newY: number) => void;
  onUpdatePrompt?: (nodeId: string, prompt: string) => void;
  zoom: number;
  locale: string;
}

export function CanvasNodeCard({
  node,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
  onUpdatePrompt,
  zoom,
  locale,
}: CanvasNodeCardProps) {
  const isFa = locale === 'fa';
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Don't drag if clicking buttons, inputs, or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      e.stopPropagation();
      onSelect(node.id);

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: node.x,
        initialY: node.y,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragRef.current) return;
        const dx = (moveEvent.clientX - dragRef.current.startX) / zoom;
        const dy = (moveEvent.clientY - dragRef.current.startY) / zoom;
        onUpdatePosition(node.id, Math.round(dragRef.current.initialX + dx), Math.round(dragRef.current.initialY + dy));
      };

      const handlePointerUp = () => {
        dragRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [node.id, node.x, node.y, onSelect, onUpdatePosition, zoom]
  );

  const title = isFa ? node.titleFa : node.title;

  return (
    <div
      className={`canvas-node-card ${isSelected ? 'selected' : ''} status-${node.status}`}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
      }}
      onPointerDown={handlePointerDown}
      onClick={() => onSelect(node.id)}
      role="region"
      aria-label={`${title} (${node.status})`}
    >
      {/* Input Sockets (Inline Start) */}
      <div className="node-sockets-column input-sockets">
        <div
          className="socket-dot socket-input"
          title={isFa ? 'ورودی داده' : 'Input Socket'}
        >
          <span className="socket-inner" />
        </div>
      </div>

      {/* Output Sockets (Inline End) */}
      <div className="node-sockets-column output-sockets">
        <div
          className="socket-dot socket-output"
          title={isFa ? 'خروجی داده' : 'Output Socket'}
        >
          <span className="socket-inner" />
        </div>
      </div>

      {/* Card Header */}
      <div className="canvas-node-header">
        <div className="node-title-group">
          <span className="node-icon">
            <AiMagicWand01
              size={15}
              strokeWidth={1.5}
              color="var(--lemmo-surface-brand-background, #d1fe17)"
            />
          </span>
          <span className="node-title-text" title={title}>
            {title}
          </span>
        </div>

        <div className="node-header-actions">
          {/* Status Indicator */}
          {node.status === 'running' && (
            <span className="node-status-badge running" title="Running">
              <span className="node-spinner" />
            </span>
          )}
          {node.status === 'success' && (
            <span className="node-status-badge success" title="Completed">
              <CheckCircle01 size={13} strokeWidth={2} color="#10b981" />
            </span>
          )}

          {/* Delete Node */}
          <button
            type="button"
            className="node-delete-btn"
            onClick={(e) => onDelete(node.id, e)}
            title={isFa ? 'حذف نود' : 'Delete node'}
            aria-label={isFa ? 'حذف نود' : 'Delete node'}
          >
            <Trash01 size={13} strokeWidth={1.5} color="currentColor" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="canvas-node-body">
        {/* Prompt Input Field if applicable */}
        {node.prompt !== undefined && (
          <div className="node-param-row">
            <label className="node-param-label">
              {isFa ? 'متن پرامپت:' : 'Prompt:'}
            </label>
            <textarea
              className="node-prompt-textarea"
              rows={2}
              value={node.prompt}
              onChange={(e) => onUpdatePrompt?.(node.id, e.target.value)}
              placeholder={isFa ? 'توصیف تصویر مورد نظر...' : 'Describe visual output...'}
            />
          </div>
        )}

        {/* Aspect Ratio / Steps Meta */}
        {node.aspectRatio && (
          <div className="node-meta-pills">
            <span className="meta-pill" data-numeric="true">
              {node.aspectRatio}
            </span>
            {node.steps && (
              <span className="meta-pill" data-numeric="true">
                {node.steps} {isFa ? 'گام' : 'steps'}
              </span>
            )}
          </div>
        )}

        {/* Output Image Preview */}
        {node.previewUrl && (
          <div className="node-preview-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={node.previewUrl}
              alt={title}
              className="node-preview-image"
              loading="lazy"
            />
          </div>
        )}

        {/* Running Skeleton Preview if generating */}
        {node.status === 'running' && !node.previewUrl && (
          <div className="node-preview-skeleton">
            <Sparks size={20} strokeWidth={1.5} color="currentColor" />
            <span>{isFa ? 'در حال تولید اثر...' : 'Synthesizing...'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
