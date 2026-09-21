/**
 * Canvas Bottom Floating Toolbar Component — /app/canvas/[id]
 *
 * Professional floating dock (.canvas-bottom-dock) based directly on Figma's floating toolbar design:
 * 1. Global Sequence:
 *    - FIRST (اول): Hero Action CTA (Run Flow "اجرای بوم" / Video Render) with brand lime accent.
 *    - MIDDLE (وسط): Primary Active Canvas Actions & Tools:
 *      * Select / Hand (combined dropdown with chevron)
 *      * AI Tool Node (in workflow mode) / AI Video (in video mode)
 *      * Frame (فریم و آرت‌بورد - فرم کلی محتوا)
 *      * Shape & Image (اشکال هندسی + بارگذاری تصویر در همان دراپ‌داون)
 *      * Draw (قلم و رسم آزاد)
 *      * Text (متن و تایپوگرافی - مشترک برای همه مودها)
 *      * Comment (دیدگاه و کامنت روی بوم - مشترک برای همه مودها)
 *    - END (آخر): Figma-style recessed segmented Mode Switcher track (Icon-only: Workflow, Design, Video).
 * 2. Geometrically Principled Squircles (DOC-DS-008):
 *    - Concentric squircle radii: outer dock 14px -> tool buttons 8px -> mode track 8px -> mode icons 6px.
 * 3. Anchored Dropdown Popovers:
 *    - Clean header-free popovers anchored directly above each tool button.
 *    - Strict UX Row Layout: [ Checkmark slot ] -> [ Tool Icon ] -> [ Label ] -> [ Shortcut (Kbd) ].
 * 4. Micro-Interactions & Keyboard Support:
 *    - Smooth upward/downward caret rotation on dropdown buttons.
 *    - Keyboard shortcuts: V (Select), H (Hand), R/O/Y/P (Shapes), U (Image), D (Draw), T (Text), C (Comment), F (Frame), Escape (Close).
 *
 * 100% Lemmo Design System tokens and synthline icons.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  NavPointer01,
  CursorHand01,
  AiMagicWand01,
  LayersThree,
  Type01,
  MessageSquare01,
  Square,
  Circle,
  Triangle,
  BadgeShape,
  Sparks,
  ChevronRight,
  Check01,
  PenTool01,
  VideoCamera,
  AiVideoCamera,
  Image03,
  PencilLine,
} from 'synthline/react';
import { CanvasActiveTool, CanvasDockMode } from '../types';

export interface DockModeDefinition {
  id: CanvasDockMode;
  label: string;
  labelFa: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
}

export const DOCK_MODES: DockModeDefinition[] = [
  {
    id: 'workflow',
    label: 'AI Workflow Studio',
    labelFa: 'جریان کار هوش مصنوعی (Workflow)',
    icon: Sparks,
  },
  {
    id: 'design',
    label: 'Vector & Design Studio',
    labelFa: 'طراحی برداری و لایه‌ها (Design)',
    icon: PenTool01,
  },
  {
    id: 'video',
    label: 'Video & Motion Timeline',
    labelFa: 'ویدیو و موشن تایم‌لاین (Video)',
    icon: VideoCamera,
  },
];

export interface ShapeOption {
  id: 'rectangle' | 'circle' | 'triangle' | 'star' | 'image';
  labelFa: string;
  labelEn: string;
  shortcut: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'rectangle', labelFa: 'مستطیل', labelEn: 'Rectangle', shortcut: 'R', icon: Square },
  { id: 'circle', labelFa: 'دایره / بیضی', labelEn: 'Circle', shortcut: 'O', icon: Circle },
  { id: 'triangle', labelFa: 'مثلث', labelEn: 'Triangle', shortcut: 'Y', icon: Triangle },
  { id: 'star', labelFa: 'چندضلعی / ستاره', labelEn: 'Polygon Badge', shortcut: 'P', icon: BadgeShape },
  { id: 'image', labelFa: 'بارگذاری تصویر', labelEn: 'Place Image', shortcut: 'U', icon: Image03 },
];

export interface NavOption {
  id: 'select' | 'hand';
  labelFa: string;
  labelEn: string;
  shortcut: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
}

export const NAV_OPTIONS: NavOption[] = [
  { id: 'select', labelFa: 'انتخاب و کلیک', labelEn: 'Select Pointer', shortcut: 'V', icon: NavPointer01 },
  { id: 'hand', labelFa: 'دست و جابجایی', labelEn: 'Hand / Pan', shortcut: 'H', icon: CursorHand01 },
];

interface CanvasBottomToolbarProps {
  dockMode: CanvasDockMode;
  onChangeDockMode: (mode: CanvasDockMode) => void;
  activeTool: CanvasActiveTool;
  onChangeTool: (tool: CanvasActiveTool) => void;
  onAddToolNode: (toolType: 'flux-dev' | 'remove-bg' | 'upscale') => void;
  onUploadImage: () => void;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
  locale: string;
}

export function CanvasBottomToolbar({
  dockMode,
  onChangeDockMode,
  activeTool,
  onChangeTool,
  onAddToolNode,
  onUploadImage,
  onRunPipeline,
  isRunningPipeline,
  locale,
}: CanvasBottomToolbarProps) {
  const isFa = locale === 'fa';
  const containerRef = useRef<HTMLDivElement>(null);

  // Popover open states
  const [nodePickerOpen, setNodePickerOpen] = useState(false);
  const [shapePickerOpen, setShapePickerOpen] = useState(false);
  const [navPickerOpen, setNavPickerOpen] = useState(false);

  // Selected shape sub-type
  const [selectedShapeType, setSelectedShapeType] = useState<'rectangle' | 'circle' | 'triangle' | 'star'>('rectangle');
  const [selectedNavTool, setSelectedNavTool] = useState<'select' | 'hand'>('select');

  // Sync nav tool selection with activeTool if changed externally
  useEffect(() => {
    if (activeTool === 'select' || activeTool === 'hand') {
      setSelectedNavTool(activeTool);
    }
  }, [activeTool]);

  // Close popovers on outside pointer event
  useEffect(() => {
    const handleOutsideClick = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setNodePickerOpen(false);
        setShapePickerOpen(false);
        setNavPickerOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  // Keyboard shortcut support (Escape to close, tool shortcuts R, O, Y, P, U, D, V, H, T, C, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNodePickerOpen(false);
        setShapePickerOpen(false);
        setNavPickerOpen(false);
        return;
      }

      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true');
      if (isInputActive || e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (key === 'V') {
        setSelectedNavTool('select');
        onChangeTool('select');
        setNavPickerOpen(false);
      } else if (key === 'H') {
        setSelectedNavTool('hand');
        onChangeTool('hand');
        setNavPickerOpen(false);
      } else if (key === 'R') {
        setSelectedShapeType('rectangle');
        onChangeTool('shape');
        setShapePickerOpen(false);
      } else if (key === 'O') {
        setSelectedShapeType('circle');
        onChangeTool('shape');
        setShapePickerOpen(false);
      } else if (key === 'Y') {
        setSelectedShapeType('triangle');
        onChangeTool('shape');
        setShapePickerOpen(false);
      } else if (key === 'P') {
        setSelectedShapeType('star');
        onChangeTool('shape');
        setShapePickerOpen(false);
      } else if (key === 'U') {
        onUploadImage();
        setShapePickerOpen(false);
      } else if (key === 'D') {
        onChangeTool('draw');
        setShapePickerOpen(false);
        setNavPickerOpen(false);
      } else if (key === 'T') {
        onChangeTool('text');
        setShapePickerOpen(false);
        setNavPickerOpen(false);
      } else if (key === 'C') {
        onChangeTool('comment');
        setShapePickerOpen(false);
        setNavPickerOpen(false);
      } else if (key === 'F') {
        onChangeTool('frame');
        setShapePickerOpen(false);
        setNavPickerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChangeTool, onUploadImage]);

  const handleSwitchMode = (mode: CanvasDockMode) => {
    setNodePickerOpen(false);
    setShapePickerOpen(false);
    setNavPickerOpen(false);
    onChangeDockMode(mode);
  };

  const handleSelectShapeOption = (optId: 'rectangle' | 'circle' | 'triangle' | 'star' | 'image') => {
    if (optId === 'image') {
      onChangeTool('media');
      onUploadImage();
    } else {
      setSelectedShapeType(optId);
      onChangeTool('shape');
    }
    setShapePickerOpen(false);
  };

  const handleSelectNavTool = (tool: 'select' | 'hand') => {
    setSelectedNavTool(tool);
    onChangeTool(tool);
    setNavPickerOpen(false);
  };

  const getShapeIcon = () => {
    if (activeTool === 'media') {
      return <Image03 size={17} strokeWidth={1.5} color="currentColor" />;
    }
    switch (selectedShapeType) {
      case 'circle':
        return <Circle size={17} strokeWidth={1.5} color="currentColor" />;
      case 'triangle':
        return <Triangle size={17} strokeWidth={1.5} color="currentColor" />;
      case 'star':
        return <BadgeShape size={17} strokeWidth={1.5} color="currentColor" />;
      case 'rectangle':
      default:
        return <Square size={17} strokeWidth={1.5} color="currentColor" />;
    }
  };

  const isNavActive = activeTool === 'select' || activeTool === 'hand';
  const isShapeActive = activeTool === 'shape' || activeTool === 'media';

  return (
    <div
      ref={containerRef}
      className="canvas-bottom-toolbar-container"
      role="toolbar"
      aria-label={isFa ? 'نوار ابزار اصلی بوم' : 'Canvas Main Toolbar'}
    >
      {/* Main Floating Dock Container (Figma Squircle Geometry) */}
      <div className="canvas-bottom-dock">
        {/* ==================================================== */}
        {/* 1. FIRST (اول): Hero Action CTA (Run Flow / Render)   */}
        {/* ==================================================== */}
        {dockMode === 'workflow' && (
          <>
            <button
              type="button"
              className={`dock-run-btn ${isRunningPipeline ? 'running' : ''}`}
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              title={isFa ? 'اجرای پردازش پایپ‌لاین بوم (Cmd+Enter)' : 'Run Canvas Pipeline (Cmd+Enter)'}
              aria-label={isFa ? 'اجرای بوم' : 'Run Canvas Pipeline'}
            >
              <Sparks size={15} strokeWidth={2} color="currentColor" />
              <span className="run-btn-label">
                {isRunningPipeline
                  ? isFa
                    ? 'در حال اجرا...'
                    : 'Processing...'
                  : isFa
                  ? 'اجرای بوم'
                  : 'Run Flow'}
              </span>
            </button>
            <div className="dock-divider" aria-hidden="true" />
          </>
        )}

        {dockMode === 'video' && (
          <>
            <button
              type="button"
              className="dock-run-btn"
              onClick={onRunPipeline}
              title={isFa ? 'رندر و استخراج ویدیو' : 'Render Video Project'}
              aria-label={isFa ? 'رندر ویدیو' : 'Render Video'}
            >
              <VideoCamera size={15} strokeWidth={2} color="currentColor" />
              <span className="run-btn-label">
                {isFa ? 'رندر ویدیو' : 'Render Video'}
              </span>
            </button>
            <div className="dock-divider" aria-hidden="true" />
          </>
        )}

        {/* ==================================================== */}
        {/* 2. MIDDLE (وسط): Primary Active Canvas Tools         */}
        {/* ==================================================== */}
        <div className="dock-tools-group" key={dockMode}>
          {/* Tool #1: Navigation (Select / Hand) with Anchored Popover */}
          <div className="dock-popover-anchor">
            <button
              type="button"
              className={`dock-dropdown-tool-btn ${isNavActive ? 'active' : ''} ${navPickerOpen ? 'open' : ''}`}
              onClick={() => {
                onChangeTool(selectedNavTool);
                setNavPickerOpen(!navPickerOpen);
                setNodePickerOpen(false);
                setShapePickerOpen(false);
              }}
              title={
                selectedNavTool === 'select'
                  ? isFa
                    ? 'ابزار انتخاب و کلیک (V) — کلیک برای تغییر ابزار'
                    : 'Select Pointer (V) — Click to switch'
                  : isFa
                  ? 'ابزار دست و جابجایی (H) — کلیک برای تغییر ابزار'
                  : 'Hand / Pan (H) — Click to switch'
              }
              aria-label={selectedNavTool === 'select' ? 'Select Tool' : 'Hand Tool'}
              aria-expanded={navPickerOpen}
              aria-haspopup="menu"
            >
              {selectedNavTool === 'select' ? (
                <NavPointer01 size={17} strokeWidth={1.5} color="currentColor" />
              ) : (
                <CursorHand01 size={17} strokeWidth={1.5} color="currentColor" />
              )}
              <span className="dropdown-caret-arrow" aria-hidden="true">
                <ChevronRight size={9} strokeWidth={2.4} color="currentColor" />
              </span>
            </button>

            {navPickerOpen && (
              <div
                className="dock-popover-menu nav-popover-menu"
                role="menu"
                aria-label={isFa ? 'ابزارهای انتخاب و جابجایی' : 'Selection & Pan Tools'}
              >
                {NAV_OPTIONS.map((opt) => {
                  const isSelected = selectedNavTool === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`dock-popover-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectNavTool(opt.id)}
                      role="menuitem"
                    >
                      <span className="popover-item-check-slot" aria-hidden="true">
                        {isSelected && (
                          <Check01
                            size={14}
                            strokeWidth={2.4}
                            color="var(--lemmo-surface-brand-background, #d1fe17)"
                          />
                        )}
                      </span>
                      <span className="popover-item-icon" aria-hidden="true">
                        <Icon size={17} strokeWidth={1.5} color="currentColor" />
                      </span>
                      <span className="popover-item-label">
                        {isFa ? opt.labelFa : opt.labelEn}
                      </span>
                      <kbd className="popover-item-shortcut">{opt.shortcut}</kbd>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Workflow Specific: AI Tool Node Spawner */}
          {dockMode === 'workflow' && (
            <div className="dock-popover-anchor">
              <button
                type="button"
                className={`dock-dropdown-tool-btn ${nodePickerOpen || activeTool === 'node' ? 'active' : ''} ${nodePickerOpen ? 'open' : ''}`}
                onClick={() => {
                  setNodePickerOpen(!nodePickerOpen);
                  setShapePickerOpen(false);
                  setNavPickerOpen(false);
                }}
                title={isFa ? 'نودهای هوش مصنوعی (A)' : 'AI Tool Nodes (A)'}
                aria-label={isFa ? 'نودهای هوش مصنوعی' : 'AI Tool Nodes'}
                aria-expanded={nodePickerOpen}
                aria-haspopup="menu"
              >
                <AiMagicWand01 size={17} strokeWidth={1.5} color="currentColor" />
                <span className="dropdown-caret-arrow" aria-hidden="true">
                  <ChevronRight size={9} strokeWidth={2.4} color="currentColor" />
                </span>
              </button>

              {nodePickerOpen && (
                <div
                  className="dock-popover-menu node-popover-menu"
                  role="menu"
                  aria-label={isFa ? 'نودهای هوش مصنوعی' : 'AI Tool Nodes'}
                >
                  <button
                    type="button"
                    className="dock-popover-item node-item"
                    onClick={() => {
                      onAddToolNode('flux-dev');
                      setNodePickerOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span className="node-item-badge brand">FLUX</span>
                    <div className="node-item-text">
                      <span className="node-item-title">
                        {isFa ? 'تولید تصویر FLUX.1' : 'FLUX.1 Generator'}
                      </span>
                      <span className="node-item-sub">
                        {isFa ? 'تولید تصویر از متن با کیفیت بالا' : 'Text-to-Image Generation'}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="dock-popover-item node-item"
                    onClick={() => {
                      onAddToolNode('remove-bg');
                      setNodePickerOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span className="node-item-badge">PNG</span>
                    <div className="node-item-text">
                      <span className="node-item-title">
                        {isFa ? 'حذف خودکار پس‌زمینه' : 'Background Remover'}
                      </span>
                      <span className="node-item-sub">
                        {isFa ? 'استخراج ماسک شفاف سوژه' : 'Alpha Mask Extraction'}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="dock-popover-item node-item"
                    onClick={() => {
                      onAddToolNode('upscale');
                      setNodePickerOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span className="node-item-badge">4K</span>
                    <div className="node-item-text">
                      <span className="node-item-title">
                        {isFa ? 'افزایش رزولوشن ۴K' : 'Upscale Ultra 4K'}
                      </span>
                      <span className="node-item-sub">
                        {isFa ? 'ارتقای کیفیت و وضوح تصویر' : 'Clarity & Resolution Booster'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Video Specific: AI Video Generator Node */}
          {dockMode === 'video' && (
            <button
              type="button"
              className={`dock-dropdown-tool-btn ${activeTool === 'node' ? 'active' : ''}`}
              onClick={() => onAddToolNode('flux-dev')}
              title={isFa ? 'تولید ویدیو هوش مصنوعی' : 'AI Video Generator'}
              aria-label={isFa ? 'تولید ویدیو' : 'AI Video Generator'}
            >
              <AiVideoCamera size={17} strokeWidth={1.5} color="currentColor" />
              <span className="dropdown-caret-arrow" aria-hidden="true">
                <ChevronRight size={9} strokeWidth={2.4} color="currentColor" />
              </span>
            </button>
          )}

          {/* Tool #2: Frame / Artboard (فرم کلی محتوا) — Available Across All Modes */}
          <button
            type="button"
            className={`dock-action-btn ${activeTool === 'frame' ? 'active' : ''}`}
            onClick={() => {
              onChangeTool('frame');
              setShapePickerOpen(false);
              setNavPickerOpen(false);
            }}
            title={isFa ? 'فریم و آرت‌بورد (F) — فرم کلی محتوا' : 'Frame / Container (F)'}
            aria-label={isFa ? 'فریم و آرت‌بورد' : 'Frame Tool'}
          >
            <LayersThree size={17} strokeWidth={1.5} color="currentColor" />
          </button>

          {/* Tool #3: Shape with Figma-Style Anchored Popover (Including Place Image!) */}
          <div className="dock-popover-anchor">
            <button
              type="button"
              className={`dock-dropdown-tool-btn ${isShapeActive ? 'active' : ''} ${shapePickerOpen ? 'open' : ''}`}
              onClick={() => {
                if (activeTool !== 'shape' && activeTool !== 'media') {
                  onChangeTool('shape');
                }
                setShapePickerOpen(!shapePickerOpen);
                setNavPickerOpen(false);
              }}
              title={
                isFa
                  ? 'اشکال هندسی و تصویر (R/U) — کلیک برای انتخاب شکل یا بارگذاری تصویر'
                  : 'Shapes & Image Tool (R/U) — Click to select shape or place image'
              }
              aria-label={isFa ? 'اشکال هندسی و تصویر' : 'Shapes & Image Tool'}
              aria-expanded={shapePickerOpen}
              aria-haspopup="menu"
            >
              {getShapeIcon()}
              <span className="dropdown-caret-arrow" aria-hidden="true">
                <ChevronRight size={9} strokeWidth={2.4} color="currentColor" />
              </span>
            </button>

            {shapePickerOpen && (
              <div
                className="dock-popover-menu shape-popover-menu"
                role="menu"
                aria-label={isFa ? 'اشکال هندسی و تصویر' : 'Shapes & Image'}
              >
                {SHAPE_OPTIONS.map((opt) => {
                  const isSelected =
                    opt.id === 'image'
                      ? activeTool === 'media'
                      : activeTool === 'shape' && selectedShapeType === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`dock-popover-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectShapeOption(opt.id)}
                      role="menuitem"
                    >
                      <span className="popover-item-check-slot" aria-hidden="true">
                        {isSelected && (
                          <Check01
                            size={14}
                            strokeWidth={2.4}
                            color="var(--lemmo-surface-brand-background, #d1fe17)"
                          />
                        )}
                      </span>
                      <span className="popover-item-icon" aria-hidden="true">
                        <Icon size={17} strokeWidth={1.5} color="currentColor" />
                      </span>
                      <span className="popover-item-label">
                        {isFa ? opt.labelFa : opt.labelEn}
                      </span>
                      <kbd className="popover-item-shortcut">{opt.shortcut}</kbd>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tool #4: Draw Tool (قلم و رسم آزاد) */}
          <button
            type="button"
            className={`dock-action-btn ${activeTool === 'draw' ? 'active' : ''}`}
            onClick={() => {
              onChangeTool('draw');
              setShapePickerOpen(false);
              setNavPickerOpen(false);
            }}
            title={isFa ? 'قلم و رسم آزاد (D)' : 'Draw / Pencil Tool (D)'}
            aria-label={isFa ? 'قلم و رسم آزاد' : 'Draw Tool'}
          >
            <PencilLine size={17} strokeWidth={1.5} color="currentColor" />
          </button>

          {/* Tool #5: Text / Typography (مشترک برای همه) */}
          <button
            type="button"
            className={`dock-action-btn ${activeTool === 'text' ? 'active' : ''}`}
            onClick={() => {
              onChangeTool('text');
              setShapePickerOpen(false);
              setNavPickerOpen(false);
            }}
            title={isFa ? 'متن و تایپوگرافی (T)' : 'Text Tool (T)'}
            aria-label={isFa ? 'ابزار متن' : 'Text Tool'}
          >
            <Type01 size={17} strokeWidth={1.5} color="currentColor" />
          </button>

          {/* Tool #6: Canvas Comment Pin (مشترک برای همه) */}
          <button
            type="button"
            className={`dock-action-btn ${activeTool === 'comment' ? 'active' : ''}`}
            onClick={() => {
              onChangeTool('comment');
              setShapePickerOpen(false);
              setNavPickerOpen(false);
            }}
            title={isFa ? 'ثبت دیدگاه و کامنت روی بوم (C)' : 'Comment Pin (C)'}
            aria-label={isFa ? 'کامنت روی بوم' : 'Comment Pin'}
          >
            <MessageSquare01 size={17} strokeWidth={1.5} color="currentColor" />
          </button>
        </div>

        {/* Vertical Divider separating Tools from Mode Track */}
        <div className="dock-divider" aria-hidden="true" />

        {/* ==================================================== */}
        {/* 3. END (آخر): Segmented Mode Switcher Track (Icon-Only!) */}
        {/* ==================================================== */}
        <div
          className="dock-mode-track"
          role="tablist"
          aria-label={isFa ? 'انتخاب مود کاری بوم' : 'Canvas Mode Switcher'}
        >
          {DOCK_MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = dockMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`dock-mode-icon-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSwitchMode(mode.id)}
                title={isFa ? mode.labelFa : mode.label}
                aria-label={isFa ? mode.labelFa : mode.label}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.5} color="currentColor" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
