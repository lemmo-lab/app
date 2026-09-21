/**
 * Canvas Bottom Floating Toolbar Component — /app/canvas/[id]
 *
 * Implements the floating bottom dock (.nav-menu) from canvas-01.html:
 * 1. Primary Tools: Select, Hand/Pan, Add Node, Upload Asset, Frame/Group, Text Note.
 * 2. View Controls: Zoom out (-), Zoom Level %, Zoom In (+), Reset/Fit to Screen.
 * 3. Flow Execution: High-contrast Brand Accent CTA to trigger AI pipeline execution.
 *
 * 100% Lemmo Design System tokens with synthline icons (strokeWidth 1.5).
 */

'use client';

import React, { useState } from 'react';
import {
  NavPointer01,
  CursorHand01,
  AiMagicWand01,
  FolderUpload,
  LayersThree,
  File01,
  Minus02,
  Plus01,
  Maximize01,
  Sparks,
} from 'synthline/react';
import { CanvasActiveTool } from '../types';

interface CanvasBottomToolbarProps {
  activeTool: CanvasActiveTool;
  onChangeTool: (tool: CanvasActiveTool) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onAddToolNode: (toolType: 'flux-dev' | 'remove-bg' | 'upscale') => void;
  onUploadImage: () => void;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
  locale: string;
}

export function CanvasBottomToolbar({
  activeTool,
  onChangeTool,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onAddToolNode,
  onUploadImage,
  onRunPipeline,
  isRunningPipeline,
  locale,
}: CanvasBottomToolbarProps) {
  const isFa = locale === 'fa';
  const [nodePickerOpen, setNodePickerOpen] = useState(false);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="canvas-bottom-toolbar-container"
      role="toolbar"
      aria-label={isFa ? 'نوار ابزار اصلی بوم' : 'Canvas Main Toolbar'}
    >
      {/* Node Picker Quick Popover */}
      {nodePickerOpen && (
        <div
          className="canvas-node-picker-popover"
          role="menu"
          aria-label={isFa ? 'انتخاب نود جدید' : 'Add New Node'}
        >
          <div className="picker-header">
            <span>{isFa ? 'افزودن نود هوش مصنوعی' : 'Add AI Tool Node'}</span>
          </div>

          <div className="picker-items">
            <button
              type="button"
              className="picker-item-btn"
              onClick={() => {
                onAddToolNode('flux-dev');
                setNodePickerOpen(false);
              }}
            >
              <span className="picker-badge brand">FLUX.1</span>
              <div className="picker-item-texts">
                <span className="picker-item-title">
                  {isFa ? 'تولید تصویر FLUX.1' : 'FLUX.1 Generator'}
                </span>
                <span className="picker-item-desc">
                  {isFa ? 'تولید واقع‌گرایانه متن به تصویر' : 'Text-to-Image Generation'}
                </span>
              </div>
            </button>

            <button
              type="button"
              className="picker-item-btn"
              onClick={() => {
                onAddToolNode('remove-bg');
                setNodePickerOpen(false);
              }}
            >
              <span className="picker-badge">PNG</span>
              <div className="picker-item-texts">
                <span className="picker-item-title">
                  {isFa ? 'حذف پس‌زمینه' : 'Background Remover'}
                </span>
                <span className="picker-item-desc">
                  {isFa ? 'استخراج خودکار سوژه اصلی' : 'Alpha Mask Extraction'}
                </span>
              </div>
            </button>

            <button
              type="button"
              className="picker-item-btn"
              onClick={() => {
                onAddToolNode('upscale');
                setNodePickerOpen(false);
              }}
            >
              <span className="picker-badge">4K</span>
              <div className="picker-item-texts">
                <span className="picker-item-title">
                  {isFa ? 'افزایش رزولوشن Ultra' : 'Upscale Ultra 4K'}
                </span>
                <span className="picker-item-desc">
                  {isFa ? 'ارتقای جزئیات و وضوح' : 'Clarity & Resolution Booster'}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Dock Pill */}
      <div className="canvas-bottom-dock">
        {/* Tool 1: Pointer / Select */}
        <button
          type="button"
          className={`dock-action-btn ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => {
            onChangeTool('select');
            setNodePickerOpen(false);
          }}
          title={isFa ? 'ابزار انتخاب (V)' : 'Select Tool (V)'}
          aria-label={isFa ? 'ابزار انتخاب' : 'Select Tool'}
        >
          <NavPointer01 size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* Tool 2: Hand / Pan */}
        <button
          type="button"
          className={`dock-action-btn ${activeTool === 'hand' ? 'active' : ''}`}
          onClick={() => {
            onChangeTool('hand');
            setNodePickerOpen(false);
          }}
          title={isFa ? 'ابزار دست و جابجایی (H)' : 'Hand / Pan Tool (H)'}
          aria-label={isFa ? 'ابزار جابجایی' : 'Hand Tool'}
        >
          <CursorHand01 size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* Tool 3: Add Node Popover Trigger */}
        <button
          type="button"
          className={`dock-action-btn ${nodePickerOpen ? 'active' : ''}`}
          onClick={() => setNodePickerOpen(!nodePickerOpen)}
          title={isFa ? 'افزودن نود جدید (A)' : 'Add Tool Node (A)'}
          aria-label={isFa ? 'افزودن نود' : 'Add Tool Node'}
          aria-expanded={nodePickerOpen}
        >
          <AiMagicWand01 size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* Tool 4: Upload Asset */}
        <button
          type="button"
          className="dock-action-btn"
          onClick={() => {
            onUploadImage();
            setNodePickerOpen(false);
          }}
          title={isFa ? 'بارگذاری تصویر (U)' : 'Upload Asset (U)'}
          aria-label={isFa ? 'بارگذاری تصویر' : 'Upload Asset'}
        >
          <FolderUpload size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* Tool 5: Frame / Container */}
        <button
          type="button"
          className={`dock-action-btn ${activeTool === 'frame' ? 'active' : ''}`}
          onClick={() => {
            onChangeTool('frame');
            setNodePickerOpen(false);
          }}
          title={isFa ? 'فریم‌بندی لایه‌ها (F)' : 'Frame Tool (F)'}
          aria-label={isFa ? 'فریم‌بندی' : 'Frame Tool'}
        >
          <LayersThree size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        {/* Tool 6: Sticky Note / Text */}
        <button
          type="button"
          className={`dock-action-btn ${activeTool === 'text' ? 'active' : ''}`}
          onClick={() => {
            onChangeTool('text');
            setNodePickerOpen(false);
          }}
          title={isFa ? 'یادداشت متنی (T)' : 'Text Note (T)'}
          aria-label={isFa ? 'یادداشت متنی' : 'Text Note'}
        >
          <File01 size={18} strokeWidth={1.5} color="currentColor" />
        </button>

        <div className="dock-divider" aria-hidden="true" />

        {/* Zoom Controls */}
        <div className="dock-zoom-group">
          <button
            type="button"
            className="dock-zoom-btn"
            onClick={onZoomOut}
            title={isFa ? 'کاهش زوم' : 'Zoom Out'}
            aria-label={isFa ? 'کاهش زوم' : 'Zoom Out'}
          >
            <Minus02 size={14} strokeWidth={1.8} color="currentColor" />
          </button>

          <span
            className="dock-zoom-value"
            onClick={onResetZoom}
            title={isFa ? 'بازنشانی بزرگ‌نمایی به ۱۰۰٪' : 'Reset Zoom to 100%'}
            role="button"
            tabIndex={0}
            data-numeric="true"
          >
            {zoomPercent}%
          </span>

          <button
            type="button"
            className="dock-zoom-btn"
            onClick={onZoomIn}
            title={isFa ? 'افزایش زوم' : 'Zoom In'}
            aria-label={isFa ? 'افزایش زوم' : 'Zoom In'}
          >
            <Plus01 size={14} strokeWidth={1.8} color="currentColor" />
          </button>

          <button
            type="button"
            className="dock-zoom-btn fit-btn"
            onClick={onResetZoom}
            title={isFa ? 'انطباق با صفحه (Shift + 1)' : 'Fit to Screen (Shift + 1)'}
            aria-label={isFa ? 'انطباق با صفحه' : 'Fit to Screen'}
          >
            <Maximize01 size={13} strokeWidth={1.8} color="currentColor" />
          </button>
        </div>

        <div className="dock-divider" aria-hidden="true" />

        {/* Run Pipeline Primary CTA */}
        <button
          type="button"
          className={`dock-run-btn ${isRunningPipeline ? 'running' : ''}`}
          onClick={onRunPipeline}
          disabled={isRunningPipeline}
          title={isFa ? 'اجرای پردازش پایپ‌لاین بوم' : 'Run Canvas Pipeline'}
          aria-label={isFa ? 'اجرای بوم' : 'Run Canvas Pipeline'}
        >
          <Sparks size={16} strokeWidth={2} color="currentColor" />
          <span className="run-btn-label">
            {isRunningPipeline
              ? isFa
                ? 'در حال پردازش...'
                : 'Processing...'
              : isFa
              ? 'اجرای بوم'
              : 'Run Flow'}
          </span>
        </button>
      </div>
    </div>
  );
}
