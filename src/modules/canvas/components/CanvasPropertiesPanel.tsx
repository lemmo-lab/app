/**
 * Canvas Properties Inspector Panel Component — /app/canvas/[id]
 *
 * Professional, highly-engineered inspector panel located at the inline-end
 * of the canvas workspace, tailored specifically for Lemmo's AI Creative Studio:
 *
 * Supported Contexts:
 * 1. AI Tool Node (FLUX.1, Background Remover, Upscaler):
 *    - Model hyperparameters (Aspect ratio pills, Steps, CFG guidance, Seed).
 *    - Prompt engine with smart AI prompt expansion.
 *    - Live execution with token/credit estimator.
 * 2. Vector & Design Shapes (Rectangle, Circle, Triangle, Polygon / Star):
 *    - 6-way alignment toolbar, coordinates (X, Y), rotation (∠), 90° rotate, Flip H/V.
 *    - Dimensions (W, H) with aspect ratio lock.
 *    - Appearance: Opacity, corner radius, polygon sides count, star ratio inset.
 *    - Fill: Solid, Linear gradient, Radial gradient, Lemmo token color presets.
 *    - Stroke & Effects: Neon glow, drop shadows, blurs.
 * 3. Frame / Artboard:
 *    - Social media presets (Instagram 1:1, Story 9:16, YouTube 16:9, Twitter 3:1).
 *    - Dimensions, clip content toggle, background fill, export.
 * 4. Image / Media Asset:
 *    - AI Quick Actions: Remove BG, Upscale 4K, Variations.
 *    - Dimensions, opacity, corner radius.
 * 5. Canvas Global Settings (when clicking canvas background):
 *    - Grid mode: Dots, Grid, None. Snap to grid toggle.
 *    - Background color presets.
 *    - Full pipeline execution CTA.
 *
 * Conforms 100% to @lemmo-lab/tokens and Synthline icons.
 */

'use client';

import React, { useState } from 'react';
import {
  Square,
  Circle,
  Triangle,
  BadgeShape,
  LayersThree,
  Type01,
  Sparks,
  Eye,
  EyeOff,
  Lock01,
  Lock02Unlocked,
  ChevronRight,
  Droplets01,
  ColorPalette,
  Image03,
  Sliders01,
  AiMagicWand01,
  Trash01,
  CheckCircle01,
  AiCpu,
  Refresh01,
} from 'synthline/react';
import { CanvasNode } from '../types';

export type InspectorSelectionType = 'node' | 'shape' | 'frame' | 'image' | 'text' | 'canvas';

export interface CanvasShapeElement {
  id: string;
  name: string;
  type: 'rectangle' | 'polygon' | 'circle' | 'triangle';
  x: number;
  y: number;
  rotation: number;
  isFlippedH?: boolean;
  isFlippedV?: boolean;
  width: number;
  height: number;
  isAspectLocked?: boolean;
  opacity: number;
  cornerRadius: number;
  sides?: number;
  starInset?: number;
  fill: {
    type: 'solid' | 'linear-gradient' | 'radial-gradient';
    color: string;
    opacity: number;
    isVisible: boolean;
    gradient?: {
      from: string;
      to: string;
      angle: number;
    };
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
    style: 'solid' | 'dashed';
    position: 'inside' | 'center' | 'outside';
  };
  effects: {
    id: string;
    type: 'neon-glow' | 'drop-shadow' | 'layer-blur' | 'background-blur';
    blur: number;
    x: number;
    y: number;
    color: string;
    enabled: boolean;
  }[];
}

export interface CanvasFrameElement {
  id: string;
  name: string;
  preset: 'instagram-square' | 'instagram-story' | 'youtube' | 'twitter-header' | 'custom';
  width: number;
  height: number;
  x: number;
  y: number;
  bgColor: string;
  clipContent: boolean;
  fillOpacity: number;
}

export interface CanvasWorkspaceSettings {
  gridStyle: 'dots' | 'grid' | 'none';
  snapToGrid: boolean;
  bgColor: string;
  renderEngine: string;
}

interface CanvasPropertiesPanelProps {
  // Active Context
  selectionType: InspectorSelectionType;
  onChangeSelectionType: (type: InspectorSelectionType) => void;

  // AI Node Selection
  selectedNode: CanvasNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<CanvasNode>) => void;
  onRunNode?: (nodeId: string) => void;
  isRunningNode?: boolean;

  // Vector Shape Selection
  shapeElement: CanvasShapeElement;
  onChangeShape: (updater: (prev: CanvasShapeElement) => CanvasShapeElement) => void;

  // Frame Selection
  frameElement: CanvasFrameElement;
  onChangeFrame: (updater: (prev: CanvasFrameElement) => CanvasFrameElement) => void;

  // Global Canvas Settings
  canvasSettings: CanvasWorkspaceSettings;
  onChangeCanvasSettings: (updater: (prev: CanvasWorkspaceSettings) => CanvasWorkspaceSettings) => void;
  onRunGlobalPipeline: () => void;
  isRunningPipeline: boolean;

  // Visibility & Layout
  isOpen: boolean;
  onToggleOpen: () => void;
  locale: string;
  isRtl: boolean;
}

const LEMMO_COLOR_PRESETS = [
  { name: 'Brand Lime', hex: '#d1fe17' },
  { name: 'Cyber Blue', hex: '#00c8ff' },
  { name: 'Electric Purple', hex: '#a855f7' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Coral', hex: '#ff5c5c' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Dark Slate', hex: '#2c2f35' },
  { name: 'Deep Onyx', hex: '#141619' },
];

export function CanvasPropertiesPanel({
  selectionType,
  onChangeSelectionType,
  selectedNode,
  onUpdateNode,
  onRunNode,
  isRunningNode = false,
  shapeElement,
  onChangeShape,
  frameElement,
  onChangeFrame,
  canvasSettings,
  onChangeCanvasSettings,
  onRunGlobalPipeline,
  isRunningPipeline,
  isOpen,
  onToggleOpen,
  locale,
  isRtl,
}: CanvasPropertiesPanelProps) {
  const isFa = locale === 'fa';
  const [activeTab, setActiveTab] = useState<'properties' | 'engine'>('properties');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [cornerExpanded, setCornerExpanded] = useState(false);

  // AI Generation Engine configuration state
  const [engineConfig, setEngineConfig] = useState({
    model: 'flux-dev' as 'flux-dev' | 'flux-schnell' | 'sdxl-lightning' | 'sd-3.5',
    sampler: 'euler-a' as 'euler-a' | 'dpmpp-2m' | 'unipc' | 'ddim',
    cfgScale: 3.5,
    seed: 4829104,
    negativePrompt: 'blurry, low quality, deformed anatomy, duplicate hands, watermark',
    precision: 'bf16' as 'fp16' | 'bf16',
    clipSkip: 1,
  });

  // If collapsed, show smooth floating expand tab
  if (!isOpen) {
    return (
      <aside
        className="canvas-properties-collapsed-bar"
        aria-label={isFa ? 'باز کردن پنل تنظیمات' : 'Open Inspector Panel'}
      >
        <button
          type="button"
          className="properties-expand-tab-btn"
          onClick={onToggleOpen}
          title={isFa ? 'نمایش پنل تنظیمات المان' : 'Show Inspector Panel'}
        >
          <Sliders01 size={16} strokeWidth={1.8} color="currentColor" />
          <span className="expand-tab-label">{isFa ? 'تنظیمات' : 'Properties'}</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="canvas-properties-panel"
      role="region"
      aria-label={isFa ? 'پنل مشخصات و تنظیمات مهندسی شده بوم' : 'Canvas Properties Inspector'}
    >
      {/* ==================================================== */}
      {/* 1. HEADER: Tabs, Collapse & Context Switcher Bar     */}
      {/* ==================================================== */}
      <div className="inspector-header-bar">
        <div className="inspector-tabs-track" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'properties'}
            className={`inspector-tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            {isFa ? 'مشخصات' : 'Properties'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'engine'}
            className={`inspector-tab-btn ${activeTab === 'engine' ? 'active' : ''}`}
            onClick={() => setActiveTab('engine')}
          >
            {isFa ? 'موتور AI' : 'AI Engine'}
          </button>
        </div>

        <div className="inspector-header-actions">
          <button
            type="button"
            className="inspector-mini-action-btn collapse-btn"
            onClick={onToggleOpen}
            title={isFa ? 'بستن پنل تنظیمات' : 'Collapse Inspector'}
          >
            <ChevronRight
              size={15}
              strokeWidth={2}
              color="currentColor"
              style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* 2. Context Navigation Chips (Quick Switcher) - only in properties mode */}
      {activeTab === 'properties' && (
        <div className="inspector-context-bar" role="group" aria-label={isFa ? 'انتخاب المان فعال' : 'Active Element Context'}>
          <button
            type="button"
            className={`context-pill ${selectionType === 'node' ? 'active' : ''}`}
            onClick={() => onChangeSelectionType('node')}
            title={isFa ? 'تنظیمات نود هوش مصنوعی' : 'AI Tool Node'}
          >
            <Sparks size={12} strokeWidth={2} />
            <span>{isFa ? 'نود AI' : 'AI Node'}</span>
          </button>
          <button
            type="button"
            className={`context-pill ${selectionType === 'shape' ? 'active' : ''}`}
            onClick={() => onChangeSelectionType('shape')}
            title={isFa ? 'تنظیمات شیپ و اشکال' : 'Shape / Vector'}
          >
            <BadgeShape size={12} strokeWidth={2} />
            <span>{isFa ? 'شیپ' : 'Shape'}</span>
          </button>
          <button
            type="button"
            className={`context-pill ${selectionType === 'frame' ? 'active' : ''}`}
            onClick={() => onChangeSelectionType('frame')}
            title={isFa ? 'تنظیمات فریم و آرت‌بورد' : 'Frame / Artboard'}
          >
            <LayersThree size={12} strokeWidth={2} />
            <span>{isFa ? 'فریم' : 'Frame'}</span>
          </button>
          <button
            type="button"
            className={`context-pill ${selectionType === 'canvas' ? 'active' : ''}`}
            onClick={() => onChangeSelectionType('canvas')}
            title={isFa ? 'تنظیمات کل بوم' : 'Canvas Settings'}
          >
            <Sliders01 size={12} strokeWidth={2} />
            <span>{isFa ? 'بوم' : 'Canvas'}</span>
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DYNAMIC SCROLL CONTENT BY TAB & SELECTION TYPE    */}
      {/* ==================================================== */}
      <div className="inspector-scroll-area">
        {/* =================================================== */}
        {/* TAB 2: AI INFERENCE ENGINE VIEW                    */}
        {/* =================================================== */}
        {activeTab === 'engine' && (
          <div className="inspector-context-view">
            {/* Engine Hero */}
            <div className="node-inspector-hero engine-hero">
              <div className="node-hero-top">
                <div className="node-hero-lead">
                  <span className="node-hero-icon">
                    <AiCpu size={15} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                  </span>
                  <span className="node-hero-title">{isFa ? 'موتور استنتاج AI' : 'AI Inference Engine'}</span>
                </div>
                <span className="node-hero-badge">Core v2.4</span>
              </div>
              <div className="engine-hero-meta">
                <span>{isFa ? 'مدل پیش‌فرض پایپ‌لاین:' : 'Pipeline Model:'}</span>
                <strong style={{ color: 'var(--lemmo-surface-brand-background, #d1fe17)' }}>
                  {engineConfig.model === 'flux-dev'
                    ? 'FLUX.1 [dev]'
                    : engineConfig.model === 'flux-schnell'
                    ? 'FLUX.1 [schnell]'
                    : engineConfig.model === 'sdxl-lightning'
                    ? 'SDXL Lightning'
                    : 'SD 3.5 Large'}
                </strong>
              </div>
            </div>

            {/* Model Selection */}
            <section className="inspector-section" aria-label={isFa ? 'مدل پایه' : 'Base Model'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'مدل پایه تولید (Base Model)' : 'Base Model'}</span>
              </div>
              <div className="engine-models-grid">
                <button
                  type="button"
                  className={`engine-model-card ${engineConfig.model === 'flux-dev' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, model: 'flux-dev' }))}
                >
                  <div className="engine-model-header">
                    <span className="engine-model-name">FLUX.1 [dev]</span>
                    <span className="engine-model-tag">12B DiT</span>
                  </div>
                  <p className="engine-model-desc">
                    {isFa ? 'بالاترین کیفیت، واقع‌گرایی بالا و درک دقیق پرامپت' : 'Highest fidelity & prompt adherence'}
                  </p>
                </button>

                <button
                  type="button"
                  className={`engine-model-card ${engineConfig.model === 'flux-schnell' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, model: 'flux-schnell' }))}
                >
                  <div className="engine-model-header">
                    <span className="engine-model-name">FLUX.1 [schnell]</span>
                    <span className="engine-model-tag fast">Fast 4-Step</span>
                  </div>
                  <p className="engine-model-desc">
                    {isFa ? 'خروجی ۴ گامه فوق‌سریع مناسب پروتوتایپ سریع' : 'Ultra-fast distilled 4-step generation'}
                  </p>
                </button>

                <button
                  type="button"
                  className={`engine-model-card ${engineConfig.model === 'sdxl-lightning' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, model: 'sdxl-lightning' }))}
                >
                  <div className="engine-model-header">
                    <span className="engine-model-name">SDXL Lightning</span>
                    <span className="engine-model-tag">Photoreal</span>
                  </div>
                  <p className="engine-model-desc">
                    {isFa ? 'فتورئالیسم و سرعت بالا در ۸ گام استنتاج' : '8-step realtime photorealism'}
                  </p>
                </button>

                <button
                  type="button"
                  className={`engine-model-card ${engineConfig.model === 'sd-3.5' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, model: 'sd-3.5' }))}
                >
                  <div className="engine-model-header">
                    <span className="engine-model-name">SD 3.5 Large</span>
                    <span className="engine-model-tag">Balanced</span>
                  </div>
                  <p className="engine-model-desc">
                    {isFa ? 'مدل چندوجهی با قابلیت ترکیب‌بندی پایدار' : 'Multi-modal diffusion transformer'}
                  </p>
                </button>
              </div>
            </section>

            {/* Sampler & Guidance */}
            <section className="inspector-section" aria-label={isFa ? 'سمپلر و زمان‌بند' : 'Sampler & Scheduler'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'الگوریتم سمپلینگ (Sampler)' : 'Sampling Algorithm'}</span>
              </div>
              <div className="ratio-chips-track">
                {[
                  { id: 'euler-a', label: 'Euler A' },
                  { id: 'dpmpp-2m', label: 'DPM++ 2M' },
                  { id: 'unipc', label: 'UniPC' },
                  { id: 'ddim', label: 'DDIM' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`ratio-chip ${engineConfig.sampler === s.id ? 'active' : ''}`}
                    onClick={() => setEngineConfig((p) => ({ ...p, sampler: s.id as any }))}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="property-sublabel-row" style={{ marginTop: '10px' }}>
                <span>{isFa ? 'مقیاس هدایت پرامپت (CFG / Guidance)' : 'Guidance Scale (CFG)'}</span>
                <span className="field-badge" style={{ color: 'var(--lemmo-surface-brand-background, #d1fe17)' }}>
                  {engineConfig.cfgScale}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={engineConfig.cfgScale}
                className="inspector-range-slider"
                onChange={(e) => setEngineConfig((p) => ({ ...p, cfgScale: Number(e.target.value) }))}
              />
            </section>

            {/* Seed & Reproducibility */}
            <section className="inspector-section" aria-label={isFa ? 'سید و تکرارپذیری' : 'Seed'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'سید تولید (Seed)' : 'Seed & Reproducibility'}</span>
                <button
                  type="button"
                  className="section-action-chip"
                  onClick={() => {
                    const rand = Math.floor(Math.random() * 9000000) + 1000000;
                    setEngineConfig((p) => ({ ...p, seed: rand }));
                  }}
                  title={isFa ? 'تولید سید تصادفی جدید' : 'Randomize Seed'}
                >
                  <Refresh01 size={11} strokeWidth={2} />
                  <span>{isFa ? 'تصادفی 🎲' : 'Randomize'}</span>
                </button>
              </div>
              <div className="property-input-field" style={{ width: '100%' }}>
                <span className="field-prefix">#</span>
                <input
                  type="number"
                  value={engineConfig.seed}
                  onChange={(e) => setEngineConfig((p) => ({ ...p, seed: Number(e.target.value) }))}
                  style={{ width: '100%', direction: 'ltr' }}
                />
              </div>
            </section>

            {/* Negative Prompt */}
            <section className="inspector-section" aria-label={isFa ? 'پرامپت منفی' : 'Negative Prompt'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'پرامپت منفی (حذف ناخواسته‌ها)' : 'Negative Prompt'}</span>
              </div>
              <textarea
                className="inspector-prompt-textarea"
                rows={3}
                value={engineConfig.negativePrompt}
                placeholder={isFa ? 'موارد ناخواسته مثل: blur, deformed, low quality...' : 'Items to avoid...'}
                onChange={(e) => setEngineConfig((p) => ({ ...p, negativePrompt: e.target.value }))}
              />
              <div className="engine-tags-row">
                {[
                  { label: isFa ? '+ بدون تاری' : '+ No blur', tag: 'blurry, out of focus' },
                  { label: isFa ? '+ آناتومی درست' : '+ Proper anatomy', tag: 'bad anatomy, extra limbs' },
                  { label: isFa ? '+ بدون واترمارک' : '+ No watermark', tag: 'watermark, signature, text' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="engine-tag-chip"
                    onClick={() => {
                      setEngineConfig((p) => ({
                        ...p,
                        negativePrompt: p.negativePrompt ? `${p.negativePrompt}, ${item.tag}` : item.tag,
                      }));
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Precision */}
            <section className="inspector-section" aria-label={isFa ? 'دقت تانسور' : 'Tensor Precision'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'دقت محاسباتی تانسور (Precision)' : 'Precision'}</span>
              </div>
              <div className="ratio-chips-track">
                <button
                  type="button"
                  className={`ratio-chip ${engineConfig.precision === 'bf16' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, precision: 'bf16' }))}
                >
                  BF16 ({isFa ? 'پیشنهادی' : 'Optimal'})
                </button>
                <button
                  type="button"
                  className={`ratio-chip ${engineConfig.precision === 'fp16' ? 'active' : ''}`}
                  onClick={() => setEngineConfig((p) => ({ ...p, precision: 'fp16' }))}
                >
                  FP16 ({isFa ? 'سازگار' : 'Legacy'})
                </button>
              </div>
            </section>

            {/* Run with Engine CTA */}
            <section className="inspector-section node-exec-section">
              <button
                type="button"
                className="inspector-run-node-btn"
                disabled={isRunningPipeline || isRunningNode}
                onClick={() => {
                  if (selectedNode && onRunNode) {
                    onRunNode(selectedNode.id);
                  } else if (onRunGlobalPipeline) {
                    onRunGlobalPipeline();
                  }
                }}
              >
                <Sparks size={16} strokeWidth={2} />
                <span>
                  {isRunningNode || isRunningPipeline
                    ? isFa
                      ? 'در حال پردازش با موتور...'
                      : 'Running Inference...'
                    : isFa
                    ? 'اعمال تنظیمات و اجرای نود'
                    : 'Apply & Execute Node'}
                </span>
                <span className="run-cost-badge">{isFa ? '۲ اعتبار' : '2 Cr'}</span>
              </button>
            </section>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 1: PROPERTIES (BY SELECTION TYPE)               */}
        {/* =================================================== */}
        {activeTab === 'properties' && selectionType === 'node' && (
          <div className="inspector-context-view">
            {/* Node Title & Status Banner */}
            <div className="node-inspector-hero">
              <div className="node-hero-top">
                <div className="node-hero-lead">
                  <span className="node-hero-icon">
                    <Sparks size={15} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                  </span>
                  <span className="node-hero-title">
                    {selectedNode
                      ? isFa
                        ? selectedNode.titleFa
                        : selectedNode.title
                      : isFa
                      ? 'نود تولید تصویر FLUX.1'
                      : 'FLUX.1 Generator'}
                  </span>
                </div>
                <span className="node-hero-badge">
                  {selectedNode?.toolType === 'flux-dev'
                    ? 'FLUX.1 [dev]'
                    : selectedNode?.toolType === 'remove-bg'
                    ? 'Alpha Mask'
                    : 'Upscale 4K'}
                </span>
              </div>
              <div className="node-hero-status-row">
                <span
                  className={`node-status-dot ${
                    selectedNode?.status === 'running'
                      ? 'running'
                      : selectedNode?.status === 'success'
                      ? 'success'
                      : 'idle'
                  }`}
                />
                <span className="node-status-label">
                  {selectedNode?.status === 'running'
                    ? isFa
                      ? 'در حال پردازش...'
                      : 'Generating...'
                    : selectedNode?.status === 'success'
                    ? isFa
                      ? 'تکمیل شده (آماده)'
                      : 'Ready (Success)'
                    : isFa
                    ? 'در انتظار اجرا'
                    : 'Idle'}
                </span>
              </div>
            </div>

            {/* Prompt Engine Section */}
            <section className="inspector-section" aria-label={isFa ? 'موتور پرامپت' : 'Prompt Engine'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'پرامپت و هدایت مدل' : 'Prompt Engine'}</span>
                <button
                  type="button"
                  className="section-action-chip"
                  onClick={() => {
                    if (selectedNode) {
                      const enhanced = `${selectedNode.prompt || ''}, ultra detailed 8k cinematic lighting, masterwork composition`;
                      onUpdateNode(selectedNode.id, { prompt: enhanced });
                    }
                  }}
                  title={isFa ? 'بهبود هوشمند متن با هوش مصنوعی' : 'AI Prompt Enhancer'}
                >
                  <AiMagicWand01 size={12} strokeWidth={2} />
                  <span>{isFa ? 'بهبود با AI' : 'Enhance'}</span>
                </button>
              </div>

              <textarea
                className="inspector-prompt-textarea"
                rows={4}
                value={selectedNode?.prompt || ''}
                placeholder={isFa ? 'توصیف تصویر یا ایده خود را بنویسید...' : 'Describe what you want to generate...'}
                onChange={(e) => {
                  if (selectedNode) {
                    onUpdateNode(selectedNode.id, { prompt: e.target.value });
                  }
                }}
              />
            </section>

            {/* Hyperparameters Section */}
            <section className="inspector-section" aria-label={isFa ? 'پارامترهای تولید' : 'Generation Hyperparameters'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'نسبت ابعاد تصویر' : 'Aspect Ratio'}</span>
              </div>

              <div className="ratio-chips-track">
                {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`ratio-chip ${selectedNode?.aspectRatio === ratio ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedNode) {
                        onUpdateNode(selectedNode.id, { aspectRatio: ratio });
                      }
                    }}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <div className="property-sublabel-row">
                <span>{isFa ? 'تعداد گام‌ها (Steps)' : 'Sampling Steps'}</span>
                <span>{selectedNode?.steps || 28}</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={selectedNode?.steps || 28}
                className="inspector-range-slider"
                onChange={(e) => {
                  if (selectedNode) {
                    onUpdateNode(selectedNode.id, { steps: Number(e.target.value) });
                  }
                }}
              />

              {/* Coordinates on Canvas */}
              <div className="property-sublabel">{isFa ? 'موقعیت در صفحه بوم' : 'Canvas Coordinates'}</div>
              <div className="property-two-cols">
                <div className="property-input-field">
                  <span className="field-prefix">X</span>
                  <input
                    type="number"
                    value={selectedNode?.x || 80}
                    onChange={(e) => {
                      if (selectedNode) {
                        onUpdateNode(selectedNode.id, { x: Number(e.target.value) });
                      }
                    }}
                  />
                </div>
                <div className="property-input-field">
                  <span className="field-prefix">Y</span>
                  <input
                    type="number"
                    value={selectedNode?.y || 80}
                    onChange={(e) => {
                      if (selectedNode) {
                        onUpdateNode(selectedNode.id, { y: Number(e.target.value) });
                      }
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Execution CTA & Token Cost */}
            <section className="inspector-section node-exec-section">
              <button
                type="button"
                className="inspector-run-node-btn"
                disabled={isRunningNode || selectedNode?.status === 'running'}
                onClick={() => {
                  if (selectedNode && onRunNode) {
                    onRunNode(selectedNode.id);
                  }
                }}
              >
                <Sparks size={16} strokeWidth={2} />
                <span>
                  {selectedNode?.status === 'running'
                    ? isFa
                      ? 'در حال تولید...'
                      : 'Generating...'
                    : isFa
                    ? 'اجرای این نود'
                    : 'Execute Node'}
                </span>
                <span className="run-cost-badge">{isFa ? '۲ اعتبار' : '2 Cr'}</span>
              </button>
            </section>
          </div>
        )}

        {/* =================================================== */}
        {/* CONTEXT B: VECTOR SHAPE PROPERTIES                  */}
        {/* =================================================== */}
        {activeTab === 'properties' && selectionType === 'shape' && (
          <div className="inspector-context-view">
            {/* Shape Title & Quick Switcher */}
            <div className="inspector-element-title-row">
              <div className="element-badge-and-name">
                <span className="element-type-icon">
                  {shapeElement.type === 'polygon' ? (
                    <BadgeShape size={16} strokeWidth={2} />
                  ) : shapeElement.type === 'circle' ? (
                    <Circle size={16} strokeWidth={2} />
                  ) : shapeElement.type === 'triangle' ? (
                    <Triangle size={16} strokeWidth={2} />
                  ) : (
                    <Square size={16} strokeWidth={2} />
                  )}
                </span>
                <input
                  type="text"
                  className="element-name-input"
                  value={shapeElement.name}
                  onChange={(e) =>
                    onChangeShape((prev) => ({ ...prev, name: e.target.value }))
                  }
                  title={isFa ? 'نام المان' : 'Element Name'}
                />
              </div>

              {/* Quick Type Switcher Chips */}
              <div className="quick-type-switcher">
                <button
                  type="button"
                  className={`type-chip ${shapeElement.type === 'rectangle' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeShape((prev) => ({
                      ...prev,
                      type: 'rectangle',
                      name: isFa ? 'مستطیل' : 'Rectangle',
                      cornerRadius: 8,
                    }))
                  }
                  title={isFa ? 'مستطیل' : 'Rectangle'}
                >
                  <Square size={12} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className={`type-chip ${shapeElement.type === 'polygon' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeShape((prev) => ({
                      ...prev,
                      type: 'polygon',
                      name: isFa ? 'چندضلعی' : 'Polygon',
                      sides: 5,
                      starInset: 50,
                    }))
                  }
                  title={isFa ? 'چندضلعی و ستاره' : 'Polygon'}
                >
                  <BadgeShape size={12} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className={`type-chip ${shapeElement.type === 'circle' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeShape((prev) => ({
                      ...prev,
                      type: 'circle',
                      name: isFa ? 'دایره' : 'Circle',
                      cornerRadius: 9999,
                    }))
                  }
                  title={isFa ? 'دایره' : 'Circle'}
                >
                  <Circle size={12} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className={`type-chip ${shapeElement.type === 'triangle' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeShape((prev) => ({
                      ...prev,
                      type: 'triangle',
                      name: isFa ? 'مثلث' : 'Triangle',
                    }))
                  }
                  title={isFa ? 'مثلث' : 'Triangle'}
                >
                  <Triangle size={12} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Position & 6-Way Alignment Section */}
            <section className="inspector-section" aria-label={isFa ? 'موقعیت و تراز' : 'Position'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'موقعیت و تراز' : 'Position'}</span>
              </div>

              <div className="property-sublabel">{isFa ? 'تراز سریع' : 'Alignment'}</div>
              <div className="alignment-toolbar">
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, x: 20 }))}
                  title={isFa ? 'تراز چپ' : 'Align Left'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="2" width="2" height="12" rx="0.5" />
                    <rect x="6" y="5" width="8" height="6" rx="1" opacity="0.8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, x: 200 }))}
                  title={isFa ? 'تراز وسط افقی' : 'Align Horizontal Center'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="7" y="2" width="2" height="12" rx="0.5" />
                    <rect x="3" y="5" width="10" height="6" rx="1" opacity="0.8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, x: 380 }))}
                  title={isFa ? 'تراز راست' : 'Align Right'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="12" y="2" width="2" height="12" rx="0.5" />
                    <rect x="2" y="5" width="8" height="6" rx="1" opacity="0.8" />
                  </svg>
                </button>
                <div className="align-divider" />
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, y: 20 }))}
                  title={isFa ? 'تراز بالا' : 'Align Top'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="2" width="12" height="2" rx="0.5" />
                    <rect x="5" y="6" width="6" height="8" rx="1" opacity="0.8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, y: 150 }))}
                  title={isFa ? 'تراز وسط عمودی' : 'Align Vertical Center'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="7" width="12" height="2" rx="0.5" />
                    <rect x="5" y="3" width="6" height="10" rx="1" opacity="0.8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="align-btn"
                  onClick={() => onChangeShape((p) => ({ ...p, y: 280 }))}
                  title={isFa ? 'تراز پایین' : 'Align Bottom'}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="12" width="12" height="2" rx="0.5" />
                    <rect x="5" y="2" width="6" height="8" rx="1" opacity="0.8" />
                  </svg>
                </button>
              </div>

              <div className="property-sublabel">{isFa ? 'مختصات' : 'Coordinates'}</div>
              <div className="property-two-cols">
                <div className="property-input-field">
                  <span className="field-prefix">X</span>
                  <input
                    type="number"
                    value={shapeElement.x}
                    onChange={(e) =>
                      onChangeShape((p) => ({ ...p, x: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="property-input-field">
                  <span className="field-prefix">Y</span>
                  <input
                    type="number"
                    value={shapeElement.y}
                    onChange={(e) =>
                      onChangeShape((p) => ({ ...p, y: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="property-sublabel">{isFa ? 'زاویه و چرخش' : 'Rotation & Flip'}</div>
              <div className="property-two-cols">
                <div className="property-input-field">
                  <span className="field-prefix">∠</span>
                  <input
                    type="number"
                    value={shapeElement.rotation}
                    onChange={(e) =>
                      onChangeShape((p) => ({ ...p, rotation: Number(e.target.value) }))
                    }
                  />
                  <span className="field-suffix">°</span>
                </div>

                <div className="flip-controls-wrap">
                  <button
                    type="button"
                    className="flip-btn"
                    onClick={() =>
                      onChangeShape((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))
                    }
                    title={isFa ? 'چرخش ۹۰ درجه' : 'Rotate 90°'}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 2a6 6 0 1 1-4.24 1.76l-1.42-1.42V6h3.66L4.58 4.58A4 4 0 1 0 8 4v-2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`flip-btn ${shapeElement.isFlippedH ? 'active' : ''}`}
                    onClick={() =>
                      onChangeShape((p) => ({ ...p, isFlippedH: !p.isFlippedH }))
                    }
                    title={isFa ? 'معکوس افقی' : 'Flip Horizontal'}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 2v12M3 11l4-4-4-4v8zM13 11l-4-4 4-4v8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`flip-btn ${shapeElement.isFlippedV ? 'active' : ''}`}
                    onClick={() =>
                      onChangeShape((p) => ({ ...p, isFlippedV: !p.isFlippedV }))
                    }
                    title={isFa ? 'معکوس عمودی' : 'Flip Vertical'}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 8h12M11 3l-4 4-4-4h8zM11 13l-4-4-4 4h8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            {/* Layout Dimensions & Aspect Lock */}
            <section className="inspector-section" aria-label={isFa ? 'ابعاد' : 'Dimensions'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'ابعاد' : 'Dimensions'}</span>
              </div>

              <div className="property-two-cols layout-row">
                <div className="property-input-field">
                  <span className="field-prefix">W</span>
                  <input
                    type="number"
                    value={shapeElement.width}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      onChangeShape((p) => {
                        const ratio = p.isAspectLocked && p.width > 0 ? val / p.width : 1;
                        return {
                          ...p,
                          width: val,
                          height: p.isAspectLocked ? Math.round(p.height * ratio) : p.height,
                        };
                      });
                    }}
                  />
                </div>

                <div className="property-input-field">
                  <span className="field-prefix">H</span>
                  <input
                    type="number"
                    value={shapeElement.height}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      onChangeShape((p) => {
                        const ratio = p.isAspectLocked && p.height > 0 ? val / p.height : 1;
                        return {
                          ...p,
                          height: val,
                          width: p.isAspectLocked ? Math.round(p.width * ratio) : p.width,
                        };
                      });
                    }}
                  />
                </div>

                <button
                  type="button"
                  className={`aspect-lock-btn ${shapeElement.isAspectLocked ? 'active' : ''}`}
                  onClick={() =>
                    onChangeShape((p) => ({ ...p, isAspectLocked: !p.isAspectLocked }))
                  }
                  title={isFa ? 'حفظ تناسب ابعاد' : 'Constrain Proportions'}
                >
                  {shapeElement.isAspectLocked ? (
                    <Lock01 size={13} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                  ) : (
                    <Lock02Unlocked size={13} strokeWidth={1.8} color="currentColor" />
                  )}
                </button>
              </div>
            </section>

            {/* Appearance, Corners & Polygon Points */}
            <section className="inspector-section" aria-label={isFa ? 'ظاهر و گوشه‌ها' : 'Appearance'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'ظاهر و انحنا' : 'Appearance'}</span>
              </div>

              <div className="property-two-cols">
                <div className="property-col">
                  <span className="property-sublabel">{isFa ? 'شفافیت' : 'Opacity'}</span>
                  <div className="property-input-field">
                    <span className="field-prefix">%</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={shapeElement.opacity}
                      onChange={(e) =>
                        onChangeShape((p) => ({
                          ...p,
                          opacity: Math.min(100, Math.max(0, Number(e.target.value))),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="property-col">
                  <span className="property-sublabel">{isFa ? 'شعاع گوشه' : 'Corner radius'}</span>
                  <div className="property-input-field">
                    <span className="field-prefix">R</span>
                    <input
                      type="number"
                      min="0"
                      value={shapeElement.cornerRadius}
                      onChange={(e) =>
                        onChangeShape((p) => ({
                          ...p,
                          cornerRadius: Math.max(0, Number(e.target.value)),
                        }))
                      }
                    />
                    <button
                      type="button"
                      className={`corner-expand-btn ${cornerExpanded ? 'active' : ''}`}
                      onClick={() => setCornerExpanded(!cornerExpanded)}
                      title={isFa ? 'تنظیم ۴ گوشه' : 'Independent Corners'}
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="2" y="2" width="4" height="4" rx="1" />
                        <rect x="10" y="2" width="4" height="4" rx="1" />
                        <rect x="10" y="10" width="4" height="4" rx="1" />
                        <rect x="2" y="10" width="4" height="4" rx="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Polygon Sides & Star Ratio */}
              {(shapeElement.type === 'polygon' || shapeElement.type === 'triangle') && (
                <div className="property-two-cols polygon-props-row">
                  <div className="property-col">
                    <span className="property-sublabel">{isFa ? 'تعداد اضلاع' : 'Sides'}</span>
                    <div className="property-input-field">
                      <BadgeShape size={12} strokeWidth={1.8} className="field-prefix" />
                      <input
                        type="number"
                        min="3"
                        max="32"
                        value={shapeElement.sides || 5}
                        onChange={(e) =>
                          onChangeShape((p) => ({
                            ...p,
                            sides: Math.max(3, Number(e.target.value)),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="property-col">
                    <span className="property-sublabel">{isFa ? 'عمق ستاره' : 'Star Depth'}</span>
                    <div className="property-input-field">
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={shapeElement.starInset || 50}
                        onChange={(e) =>
                          onChangeShape((p) => ({
                            ...p,
                            starInset: Number(e.target.value),
                          }))
                        }
                      />
                      <span className="field-suffix">%</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Fill & Gradient Section */}
            <section className="inspector-section" aria-label={isFa ? 'رنگ و گرادیانت پس‌زمینه' : 'Fill'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'رنگ و پس‌زمینه' : 'Fill & Color'}</span>
                <div className="section-actions">
                  <button
                    type="button"
                    className="section-action-icon"
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    title={isFa ? 'پالت رنگ و گرادیانت' : 'Color Palette'}
                  >
                    <ColorPalette size={13} strokeWidth={2} color="currentColor" />
                  </button>
                </div>
              </div>

              {/* Unified Fill Bar */}
              <div className="fill-item-row">
                <div className="fill-unified-control">
                  <button
                    type="button"
                    className="fill-swatch-box"
                    style={{
                      background:
                        shapeElement.fill.type === 'linear-gradient'
                          ? `linear-gradient(${shapeElement.fill.gradient?.angle || 90}deg, ${shapeElement.fill.gradient?.from || '#d1fe17'}, ${shapeElement.fill.gradient?.to || '#00c8ff'})`
                          : shapeElement.fill.type === 'radial-gradient'
                          ? `radial-gradient(circle, ${shapeElement.fill.gradient?.from || '#d1fe17'}, ${shapeElement.fill.gradient?.to || '#121417'})`
                          : shapeElement.fill.color,
                      opacity: shapeElement.fill.isVisible ? 1 : 0.35,
                    }}
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    title={isFa ? 'تغییر رنگ یا گرادیانت' : 'Change Fill Color'}
                  />

                  <input
                    type="text"
                    className="fill-hex-input"
                    value={shapeElement.fill.color.replace('#', '').toUpperCase()}
                    onChange={(e) => {
                      const hex = `#${e.target.value}`;
                      onChangeShape((p) => ({
                        ...p,
                        fill: { ...p.fill, color: hex },
                      }));
                    }}
                    spellCheck={false}
                  />

                  <div className="fill-opacity-col">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={shapeElement.fill.opacity}
                      onChange={(e) =>
                        onChangeShape((p) => ({
                          ...p,
                          fill: { ...p.fill, opacity: Number(e.target.value) },
                        }))
                      }
                    />
                    <span className="fill-pct-sign">%</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="fill-toggle-vis-btn"
                  onClick={() =>
                    onChangeShape((p) => ({
                      ...p,
                      fill: { ...p.fill, isVisible: !p.fill.isVisible },
                    }))
                  }
                  title={shapeElement.fill.isVisible ? (isFa ? 'مخفی‌سازی رنگ' : 'Hide Fill') : (isFa ? 'نمایش رنگ' : 'Show Fill')}
                >
                  {shapeElement.fill.isVisible ? (
                    <Eye size={14} strokeWidth={1.8} color="currentColor" />
                  ) : (
                    <EyeOff size={14} strokeWidth={1.8} color="rgba(255,255,255,0.4)" />
                  )}
                </button>
              </div>

              {/* Color / Gradient Popover */}
              {colorPickerOpen && (
                <div className="color-picker-popover-box">
                  <div className="gradient-mode-switcher">
                    <button
                      type="button"
                      className={`gradient-tab ${shapeElement.fill.type === 'solid' ? 'active' : ''}`}
                      onClick={() =>
                        onChangeShape((p) => ({
                          ...p,
                          fill: { ...p.fill, type: 'solid' },
                        }))
                      }
                    >
                      {isFa ? 'تک‌رنگ' : 'Solid'}
                    </button>
                    <button
                      type="button"
                      className={`gradient-tab ${shapeElement.fill.type === 'linear-gradient' ? 'active' : ''}`}
                      onClick={() =>
                        onChangeShape((p) => ({
                          ...p,
                          fill: {
                            ...p.fill,
                            type: 'linear-gradient',
                            gradient: { from: '#d1fe17', to: '#00c8ff', angle: 135 },
                          },
                        }))
                      }
                    >
                      {isFa ? 'گرادیانت خطی' : 'Linear'}
                    </button>
                    <button
                      type="button"
                      className={`gradient-tab ${shapeElement.fill.type === 'radial-gradient' ? 'active' : ''}`}
                      onClick={() =>
                        onChangeShape((p) => ({
                          ...p,
                          fill: {
                            ...p.fill,
                            type: 'radial-gradient',
                            gradient: { from: '#d1fe17', to: '#121417', angle: 0 },
                          },
                        }))
                      }
                    >
                      {isFa ? 'شعاعی' : 'Radial'}
                    </button>
                  </div>

                  <div className="palette-grid">
                    {LEMMO_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        className={`palette-swatch-btn ${
                          shapeElement.fill.color.toLowerCase() === preset.hex.toLowerCase() ? 'selected' : ''
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        onClick={() =>
                          onChangeShape((p) => ({
                            ...p,
                            fill: { ...p.fill, color: preset.hex, type: 'solid' },
                          }))
                        }
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* =================================================== */}
        {/* CONTEXT C: FRAME / ARTBOARD PROPERTIES              */}
        {/* =================================================== */}
        {activeTab === 'properties' && selectionType === 'frame' && (
          <div className="inspector-context-view">
            <div className="inspector-element-title-row">
              <div className="element-badge-and-name">
                <span className="element-type-icon">
                  <LayersThree size={16} strokeWidth={2} />
                </span>
                <input
                  type="text"
                  className="element-name-input"
                  value={frameElement.name}
                  onChange={(e) =>
                    onChangeFrame((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            </div>

            <section className="inspector-section" aria-label={isFa ? 'قالب‌های سوشال مدیا' : 'Presets'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'قالب‌های استاندارد' : 'Presets'}</span>
              </div>

              <div className="frame-presets-grid">
                <button
                  type="button"
                  className={`frame-preset-card ${frameElement.preset === 'instagram-square' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeFrame((prev) => ({
                      ...prev,
                      preset: 'instagram-square',
                      width: 1080,
                      height: 1080,
                      name: isFa ? 'پست اینستاگرام (1:1)' : 'Instagram Post (1:1)',
                    }))
                  }
                >
                  <span className="preset-name">{isFa ? 'پست ۱:۱' : 'Post 1:1'}</span>
                  <span className="preset-dim">1080 × 1080</span>
                </button>
                <button
                  type="button"
                  className={`frame-preset-card ${frameElement.preset === 'instagram-story' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeFrame((prev) => ({
                      ...prev,
                      preset: 'instagram-story',
                      width: 1080,
                      height: 1920,
                      name: isFa ? 'استوری / ریلز (9:16)' : 'Story / Reels (9:16)',
                    }))
                  }
                >
                  <span className="preset-name">{isFa ? 'ریلز ۹:۱۶' : 'Reels 9:16'}</span>
                  <span className="preset-dim">1080 × 1920</span>
                </button>
                <button
                  type="button"
                  className={`frame-preset-card ${frameElement.preset === 'youtube' ? 'active' : ''}`}
                  onClick={() =>
                    onChangeFrame((prev) => ({
                      ...prev,
                      preset: 'youtube',
                      width: 1920,
                      height: 1080,
                      name: isFa ? 'یوتیوب (16:9)' : 'YouTube (16:9)',
                    }))
                  }
                >
                  <span className="preset-name">{isFa ? 'ویدیو ۱۶:۹' : 'Video 16:9'}</span>
                  <span className="preset-dim">1920 × 1080</span>
                </button>
              </div>

              {/* Dimensions */}
              <div className="property-sublabel">{isFa ? 'ابعاد کادر فریم' : 'Frame Size'}</div>
              <div className="property-two-cols">
                <div className="property-input-field">
                  <span className="field-prefix">W</span>
                  <input
                    type="number"
                    value={frameElement.width}
                    onChange={(e) =>
                      onChangeFrame((p) => ({ ...p, width: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="property-input-field">
                  <span className="field-prefix">H</span>
                  <input
                    type="number"
                    value={frameElement.height}
                    onChange={(e) =>
                      onChangeFrame((p) => ({ ...p, height: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              {/* Clip Content Toggle */}
              <div className="inspector-toggle-row">
                <span>{isFa ? 'برش المان‌های بیرون از کادر' : 'Clip Content'}</span>
                <input
                  type="checkbox"
                  checked={frameElement.clipContent}
                  onChange={(e) =>
                    onChangeFrame((p) => ({ ...p, clipContent: e.target.checked }))
                  }
                />
              </div>
            </section>
          </div>
        )}

        {/* =================================================== */}
        {/* CONTEXT D: CANVAS GLOBAL WORKSPACE SETTINGS         */}
        {/* =================================================== */}
        {activeTab === 'properties' && selectionType === 'canvas' && (
          <div className="inspector-context-view">
            <div className="node-inspector-hero canvas-hero">
              <div className="node-hero-top">
                <span className="node-hero-icon">
                  <Sliders01 size={16} strokeWidth={2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
                </span>
                <span className="node-hero-title">{isFa ? 'بوم نامحدود پروژه' : 'Infinite Canvas'}</span>
              </div>
              <p className="canvas-meta-note">
                {isFa
                  ? 'محیط طراحی ۲ بعدی نامحدود با اتصال پایپ‌لاین هوش مصنوعی.'
                  : 'Unbounded 2D surface with connected AI workflow nodes.'}
              </p>
            </div>

            {/* Grid & Display Section */}
            <section className="inspector-section" aria-label={isFa ? 'نمایش گرید و خطوط راهنما' : 'Canvas Grid'}>
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'شبکه‌بندی بوم' : 'Grid Style'}</span>
              </div>

              <div className="ratio-chips-track">
                <button
                  type="button"
                  className={`ratio-chip ${canvasSettings.gridStyle === 'dots' ? 'active' : ''}`}
                  onClick={() => onChangeCanvasSettings((p) => ({ ...p, gridStyle: 'dots' }))}
                >
                  {isFa ? 'نقطه‌ای' : 'Dots'}
                </button>
                <button
                  type="button"
                  className={`ratio-chip ${canvasSettings.gridStyle === 'grid' ? 'active' : ''}`}
                  onClick={() => onChangeCanvasSettings((p) => ({ ...p, gridStyle: 'grid' }))}
                >
                  {isFa ? 'شطرنجی' : 'Lines'}
                </button>
                <button
                  type="button"
                  className={`ratio-chip ${canvasSettings.gridStyle === 'none' ? 'active' : ''}`}
                  onClick={() => onChangeCanvasSettings((p) => ({ ...p, gridStyle: 'none' }))}
                >
                  {isFa ? 'خاموش' : 'None'}
                </button>
              </div>

              <div className="inspector-toggle-row">
                <span>{isFa ? 'چسبیدن به خطوط راهنما (Snap to Grid)' : 'Snap to Grid'}</span>
                <input
                  type="checkbox"
                  checked={canvasSettings.snapToGrid}
                  onChange={(e) =>
                    onChangeCanvasSettings((p) => ({ ...p, snapToGrid: e.target.checked }))
                  }
                />
              </div>
            </section>

            {/* Global Pipeline Execution */}
            <section className="inspector-section node-exec-section">
              <div className="section-title-row">
                <span className="section-title">{isFa ? 'اجرای کل پایپ‌لاین بوم' : 'Run Entire Pipeline'}</span>
              </div>

              <button
                type="button"
                className="inspector-run-node-btn"
                disabled={isRunningPipeline}
                onClick={onRunGlobalPipeline}
              >
                <Sparks size={16} strokeWidth={2} />
                <span>
                  {isRunningPipeline
                    ? isFa
                      ? 'در حال پردازش پایپ‌لاین...'
                      : 'Running Flow...'
                    : isFa
                    ? 'اجرای کلیه نودهای بوم'
                    : 'Execute All Nodes'}
                </span>
                <span className="run-cost-badge">{isFa ? '۴ اعتبار' : '4 Cr'}</span>
              </button>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}
