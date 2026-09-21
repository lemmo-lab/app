/**
 * Canvas Workspace Side Panel Component — /app/canvas/[id]
 *
 * Modern, distraction-free layer hierarchy and workspace panel inspired by Figma & professional creative suites.
 *
 * Key Capabilities:
 * 1. Resizable Panel Width: Smooth interactive drag handle to expand/contract width (min 280px, max 560px).
 * 2. Refined, Compact Header: Sleek project title with inline editing and NO back button.
 * 3. Figma-Style Layer Hierarchy: Nested folders/groups with expand/collapse and child items.
 * 4. Drag & Drop Layer Reordering: Move layers up or down representing visual stacking order (Foreground at top, Background at bottom).
 * 5. Instant Inline Renaming: Click directly on any layer's name to edit in place.
 * 6. Clean Minimalist Controls: Dedicated single visibility eye toggle without clutter.
 * 7. Sleek Distraction-Free Aesthetic: Pure dark UI with subtle micro-interactions and no loud gradients.
 *
 * Conforms 100% to Lemmo Design System tokens and logical CSS conventions.
 */

'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus01,
  FolderPlus,
  Folder,
  ChevronRight,
  Eye,
  EyeOff,
  CoinsHand01,
  Image03,
  AiMagicWand01,
  File01,
  Edit01,
} from 'synthline/react';
import { CanvasLayer } from '../types';

interface CanvasWorkspaceSidePanelProps {
  sideWidth: number;
  onChangeSideWidth: (newWidth: number) => void;
  projectTitle: string;
  onChangeTitle: (newTitle: string) => void;
  layers: CanvasLayer[];
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  onAddLayer: () => void;
  onAddGroup: () => void;
  onToggleVisibility: (layerId: string, e: React.MouseEvent) => void;
  onToggleExpand: (layerId: string) => void;
  onUpdateLayerName: (layerId: string, newName: string) => void;
  onReorderLayers: (draggedId: string, targetId: string, position: 'top' | 'bottom') => void;
  locale: string;
  isRtl: boolean;
}

export function CanvasWorkspaceSidePanel({
  sideWidth,
  onChangeSideWidth,
  projectTitle,
  onChangeTitle,
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onAddGroup,
  onToggleVisibility,
  onToggleExpand,
  onUpdateLayerName,
  onReorderLayers,
  locale,
  isRtl,
}: CanvasWorkspaceSidePanelProps) {
  const isFa = locale === 'fa';

  // Title inline editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(projectTitle);

  // Layer inline rename state
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState<string>('');

  // Drag and drop state
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{ id: string; position: 'top' | 'bottom' } | null>(null);

  // Panel resize handle logic
  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = sideWidth;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        // In RTL, side panel is docked at the right, so moving left increases its width
        const delta = isRtl ? startX - moveEvent.clientX : moveEvent.clientX - startX;
        const newWidth = Math.min(560, Math.max(280, Math.round(startWidth + delta)));
        onChangeSideWidth(newWidth);
      };

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [sideWidth, onChangeSideWidth, isRtl]
  );

  // Title submission
  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim()) {
      onChangeTitle(editedTitle.trim());
    } else {
      setEditedTitle(projectTitle);
    }
  };

  // Layer inline rename submission
  const handleStartRename = (layer: CanvasLayer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLayerId(layer.id);
    setEditingLayerName(isFa ? layer.nameFa : layer.name);
  };

  const handleSaveLayerName = (layerId: string) => {
    if (editingLayerName.trim()) {
      onUpdateLayerName(layerId, editingLayerName.trim());
    }
    setEditingLayerId(null);
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedLayerId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedLayerId === id) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'top' : 'bottom';
    setDragOverInfo({ id, position });
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedLayerId || draggedLayerId === targetId || !dragOverInfo) {
      setDraggedLayerId(null);
      setDragOverInfo(null);
      return;
    }

    onReorderLayers(draggedLayerId, targetId, dragOverInfo.position);
    setDraggedLayerId(null);
    setDragOverInfo(null);
  };

  const getLayerIcon = (layer: CanvasLayer) => {
    if (layer.type === 'group') {
      return <Folder size={14} strokeWidth={1.5} color="currentColor" />;
    }
    switch (layer.type) {
      case 'image':
        return <Image03 size={14} strokeWidth={1.5} color="currentColor" />;
      case 'prompt':
      case 'text':
        return <File01 size={14} strokeWidth={1.5} color="currentColor" />;
      case 'tool':
      case 'mask':
      default:
        return <AiMagicWand01 size={14} strokeWidth={1.5} color="currentColor" />;
    }
  };

  // Recursive item renderer for Figma-like nested tree structure
  const renderLayerItem = (layer: CanvasLayer, depth: number = 0) => {
    const isGroup = layer.type === 'group';
    const isExpanded = layer.isExpanded ?? true;
    const isActive = layer.id === activeLayerId;
    const isEditing = editingLayerId === layer.id;
    const displayName = isFa ? layer.nameFa : layer.name;
    const isDraggingThis = draggedLayerId === layer.id;
    const isDragOverTop = dragOverInfo?.id === layer.id && dragOverInfo.position === 'top';
    const isDragOverBottom = dragOverInfo?.id === layer.id && dragOverInfo.position === 'bottom';

    return (
      <div key={layer.id} className="layer-tree-branch">
        <div
          className={`layer-row-item ${isActive ? 'active' : ''} ${!layer.isVisible ? 'muted' : ''} ${
            isDraggingThis ? 'dragging' : ''
          } ${isDragOverTop ? 'drag-over-top' : ''} ${isDragOverBottom ? 'drag-over-bottom' : ''}`}
          style={{ paddingInlineStart: `${10 + depth * 16}px` }}
          onClick={() => onSelectLayer(layer.id)}
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, layer.id)}
          onDragOver={(e) => handleDragOver(e, layer.id)}
          onDragLeave={() => {
            if (dragOverInfo?.id === layer.id) setDragOverInfo(null);
          }}
          onDrop={(e) => handleDrop(e, layer.id)}
          role="treeitem"
          aria-selected={isActive}
          aria-expanded={isGroup ? isExpanded : undefined}
          tabIndex={0}
        >
          {/* Leading group toggle or indent space */}
          <div className="layer-item-lead">
            {isGroup ? (
              <button
                type="button"
                className={`group-collapse-btn ${isExpanded ? 'expanded' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(layer.id);
                }}
                title={isExpanded ? (isFa ? 'بستن پوشه' : 'Collapse folder') : (isFa ? 'باز کردن پوشه' : 'Expand folder')}
                aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
              >
                <ChevronRight
                  size={12}
                  strokeWidth={1.8}
                  style={{
                    transform: isExpanded
                      ? 'rotate(90deg)'
                      : isRtl
                      ? 'rotate(180deg)'
                      : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  color="currentColor"
                />
              </button>
            ) : (
              <span className="group-leaf-spacer" aria-hidden="true" />
            )}

            {/* Type Icon */}
            <span className="layer-icon-symbol" aria-hidden="true">
              {getLayerIcon(layer)}
            </span>
          </div>

          {/* Name Display or Inline Rename Input */}
          <div className="layer-item-name-col">
            {isEditing ? (
              <input
                type="text"
                className="layer-inline-name-input"
                value={editingLayerName}
                onChange={(e) => setEditingLayerName(e.target.value)}
                onBlur={() => handleSaveLayerName(layer.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveLayerName(layer.id);
                  if (e.key === 'Escape') setEditingLayerId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span
                className="layer-name-label"
                onClick={(e) => handleStartRename(layer, e)}
                title={isFa ? 'برای تغییر نام کلیک کنید' : 'Click to rename layer'}
              >
                {displayName}
              </span>
            )}
          </div>

          {/* Dedicated Single Visibility Toggle */}
          <div className="layer-item-trailing">
            <button
              type="button"
              className="layer-vis-btn"
              onClick={(e) => onToggleVisibility(layer.id, e)}
              title={
                layer.isVisible
                  ? isFa
                    ? 'مخفی کردن لایه'
                    : 'Hide layer'
                  : isFa
                  ? 'نمایش لایه'
                  : 'Show layer'
              }
              aria-label={layer.isVisible ? 'Hide layer' : 'Show layer'}
            >
              {layer.isVisible ? (
                <Eye size={13} strokeWidth={1.5} color="currentColor" />
              ) : (
                <EyeOff size={13} strokeWidth={1.5} color="currentColor" />
              )}
            </button>
          </div>
        </div>

        {/* Nested Child Layers if Expanded */}
        {isGroup && isExpanded && layer.children && layer.children.length > 0 && (
          <div className="layer-tree-children">
            {layer.children.map((child) => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="canvas-workspace-side"
      style={{ width: `${sideWidth}px` }}
      aria-label={isFa ? 'پنل لایه‌ها و مدیریت بوم' : 'Canvas Workspace & Layers'}
    >
      {/* 1. Refined Compact Header (NO back button, delicate typography) */}
      <div className="canvas-name-config">
        <div className="canvas-title-wrapper">
          {isEditingTitle ? (
            <input
              type="text"
              className="canvas-title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setEditedTitle(projectTitle);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              aria-label={isFa ? 'ویرایش نام پروژه' : 'Edit project title'}
            />
          ) : (
            <div
              className="canvas-title-display"
              onClick={() => setIsEditingTitle(true)}
              title={isFa ? 'کلیک برای تغییر نام پروژه' : 'Click to rename project'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsEditingTitle(true);
                }
              }}
            >
              <h2 className="canvas-project-heading">{projectTitle}</h2>
              <span className="canvas-title-edit-hint" aria-hidden="true">
                <Edit01 size={12} strokeWidth={1.5} color="currentColor" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Workspace Items (Figma-Style Layer Hierarchy with Drag & Drop) */}
      <div className="workspace-items">
        <div className="workspace-layers-head">
          <div className="layers-head-info">
            <span className="layers-title">{isFa ? 'لایه‌ها' : 'Layers'}</span>
            <span className="layers-badge" data-numeric="true">
              {layers.length}
            </span>
          </div>

          <div className="layers-head-actions">
            {/* New Group / Folder */}
            <button
              type="button"
              className="head-action-btn"
              onClick={onAddGroup}
              title={isFa ? 'پوشه جدید (Group)' : 'New Folder Group'}
              aria-label={isFa ? 'پوشه جدید' : 'New Folder Group'}
            >
              <FolderPlus size={14} strokeWidth={1.5} color="currentColor" />
            </button>

            {/* New Leaf Layer */}
            <button
              type="button"
              className="head-action-btn"
              onClick={onAddLayer}
              title={isFa ? 'افزودن لایه جدید' : 'Add New Layer'}
              aria-label={isFa ? 'افزودن لایه جدید' : 'Add New Layer'}
            >
              <Plus01 size={14} strokeWidth={1.8} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Tree Container */}
        <div className="layers-tree-list" role="tree">
          {layers.length === 0 ? (
            <div className="layers-empty-note">
              <span>{isFa ? 'هیچ لایه‌ای روی بوم نیست' : 'No layers on canvas'}</span>
            </div>
          ) : (
            layers.map((layer) => renderLayerItem(layer, 0))
          )}
        </div>
      </div>

      {/* 3. Subtle Workspace Footer (Figma / Linear Style Credit Bar) */}
      <div className="workspace-footer">
        <div className="credits">
          <div className="credits-top">
            <div className="credits-meta-left">
              <span className="credits-icon">
                <CoinsHand01
                  size={14}
                  strokeWidth={1.5}
                  color="var(--lemmo-surface-brand-background, #d1fe17)"
                />
              </span>
              <span className="credits-label">
                {isFa ? 'اعتبار مصرفی' : 'Compute'}
              </span>
            </div>

            <Link
              href="/settings/billing"
              className="credits-count-link"
              title={isFa ? 'شارژ حساب و بسته‌ها' : 'Upgrade balance'}
              data-numeric="true"
            >
              {isFa ? '۲,۴۵۰ / ۵,۰۰۰' : '2,450 / 5,000'}
            </Link>
          </div>

          <div className="credits-progress-track">
            <div
              className="credits-progress-fill"
              style={{ width: '49%' }}
              aria-valuenow={49}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
        </div>
      </div>

      {/* 4. Drag Resizer Handle on the Inner Edge */}
      <div
        className="canvas-side-resizer"
        onPointerDown={handleResizeStart}
        title={isFa ? 'برای تغییر عرض پنل بکشید' : 'Drag to resize panel'}
        aria-hidden="true"
      />
    </aside>
  );
}
