/**
 * Canvas Board Surface Component — /app/canvas/[id]
 *
 * Implements the infinite 2D canvas area (.canvas-area) from canvas-01.html:
 * 1. Pan & Zoom Canvas Matrix with customizable dot/cross grid background.
 * 2. Space-to-Pan & Hand Tool dragging gestures with wheel zoom clamping (0.25x - 2.0x).
 * 3. Node rendering layer with SVG connecting wires (typed socket connections).
 * 4. Atmospheric Hint Empty State when no nodes exist.
 *
 * 100% token-based styling using modern logical CSS properties.
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  AiMagicWand01,
  FolderUpload,
} from 'synthline/react';
import { CanvasNode, CanvasViewport, CanvasActiveTool } from '../types';
import { CanvasNodeCard } from './CanvasNodeCard';

interface CanvasBoardSurfaceProps {
  nodes: CanvasNode[];
  viewport: CanvasViewport;
  onChangeViewport: (viewport: CanvasViewport | ((prev: CanvasViewport) => CanvasViewport)) => void;
  activeTool: CanvasActiveTool;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onDeleteNode: (nodeId: string, e: React.MouseEvent) => void;
  onUpdateNodePosition: (nodeId: string, newX: number, newY: number) => void;
  onUpdatePrompt?: (nodeId: string, prompt: string) => void;
  onAddToolNode: (toolType: 'flux-dev' | 'remove-bg' | 'upscale') => void;
  onUploadImage: () => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasBoardSurface({
  nodes,
  viewport,
  onChangeViewport,
  activeTool,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onUpdateNodePosition,
  onUpdatePrompt,
  onAddToolNode,
  onUploadImage,
  locale,
  isRtl,
}: CanvasBoardSurfaceProps) {
  const isFa = locale === 'fa';
  const boardRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef<{ startX: number; startY: number; initialVpX: number; initialVpY: number } | null>(null);

  // Track Space bar for quick pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          setIsSpacePressed(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // Handle Board Pointer Down (Pan or deselect)
  const handleBoardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only pan if clicking on the board background (not on a node)
    if (e.target !== boardRef.current && !(e.target as HTMLElement).classList.contains('canvas-board-grid')) {
      return;
    }

    onSelectNode(null);

    // Pan with left click when Hand tool active, or middle click (button 1), or Space held
    const isHandMode = activeTool === 'hand' || isSpacePressed || e.button === 1;
    if (isHandMode) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialVpX: viewport.x,
        initialVpY: viewport.y,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!panStartRef.current) return;
        const dx = moveEvent.clientX - panStartRef.current.startX;
        const dy = moveEvent.clientY - panStartRef.current.startY;
        onChangeViewport((prev) => ({
          ...prev,
          x: Math.round(panStartRef.current!.initialVpX + dx),
          y: Math.round(panStartRef.current!.initialVpY + dy),
        }));
      };

      const handlePointerUp = () => {
        setIsPanning(false);
        panStartRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
  };

  // Native wheel listener with { passive: false } to prevent default page scrolling while zooming
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      onChangeViewport((prev) => {
        const nextZoom = Math.min(2.0, Math.max(0.25, parseFloat((prev.zoom * zoomFactor).toFixed(2))));
        return { ...prev, zoom: nextZoom };
      });
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
    };
  }, [onChangeViewport]);

  const cursorClass = isPanning
    ? 'cursor-grabbing'
    : activeTool === 'hand' || isSpacePressed
    ? 'cursor-grab'
    : 'cursor-default';

  return (
    <main
      ref={boardRef}
      className={`canvas-area ${cursorClass}`}
      onPointerDown={handleBoardPointerDown}
      aria-label={isFa ? 'بوم تعاملی' : 'Interactive Canvas Surface'}
    >
      {/* Dynamic Grid Background synced with pan & zoom */}
      <div
        className="canvas-board-grid"
        style={{
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          backgroundSize: `${28 * viewport.zoom}px ${28 * viewport.zoom}px`,
        }}
      />

      {/* Transformed Content Matrix Layer */}
      <div
        className="canvas-matrix-layer"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Render Connecting SVG Lines between sequenced nodes */}
        {nodes.length > 1 && (
          <svg className="canvas-wires-svg" aria-hidden="true">
            {nodes.slice(0, -1).map((sourceNode, idx) => {
              const targetNode = nodes[idx + 1];
              const x1 = sourceNode.x + 280;
              const y1 = sourceNode.y + 70;
              const x2 = targetNode.x;
              const y2 = targetNode.y + 70;
              const dx = Math.abs(x2 - x1) * 0.5;

              return (
                <path
                  key={`wire-${sourceNode.id}-${targetNode.id}`}
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                  className="canvas-connection-wire"
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>
        )}

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <CanvasNodeCard
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={onSelectNode}
            onDelete={onDeleteNode}
            onUpdatePosition={onUpdateNodePosition}
            onUpdatePrompt={onUpdatePrompt}
            zoom={viewport.zoom}
            locale={locale}
          />
        ))}
      </div>

      {/* Atmospheric Hint Empty State (.hint-empty-state from canvas-01.html) */}
      {nodes.length === 0 && (
        <div className="hint-empty-state">
          <div className="rect-22">
            <span className="hint-pill-text">
              {isFa
                ? 'محیط نامحدود بوم • Space + Drag برای حرکت در صفحه'
                : 'Infinite Canvas Workspace • Space + Drag to Pan'}
            </span>
          </div>

          <div className="rect-23">
            <span className="hint-pill-text secondary">
              {isFa
                ? 'برای شروع یک نود اضافه کنید یا تصویر خود را رها نمایید'
                : 'Add a tool node from bottom toolbar or drop images'}
            </span>
          </div>

          <div className="empty-quick-actions">
            <button
              type="button"
              className="hint-add-btn"
              onClick={() => onAddToolNode('flux-dev')}
            >
              <AiMagicWand01 size={15} strokeWidth={1.5} color="currentColor" />
              <span>{isFa ? 'افزودن نود مولد FLUX.1' : 'Add FLUX.1 Node'}</span>
            </button>

            <button
              type="button"
              className="hint-add-btn secondary"
              onClick={onUploadImage}
            >
              <FolderUpload size={15} strokeWidth={1.5} color="currentColor" />
              <span>{isFa ? 'بارگذاری تصویر مرجع' : 'Upload Reference'}</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
