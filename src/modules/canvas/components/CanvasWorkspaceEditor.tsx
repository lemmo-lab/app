/**
 * Canvas Workspace Editor Component — /app/canvas/[id]
 *
 * Master orchestrator for the active canvas creative environment.
 * Connects:
 * 1. Side Panel: Project title, layers manager, and credit usage.
 * 2. Top Switcher: Solo vs Team collaborative mode.
 * 3. Board Surface: Infinite 2D pan/zoom matrix with interactive nodes & wires.
 * 4. Bottom Toolbar: Tool selection, node spawning, zoom controls, and flow execution.
 *
 * Conforms strictly to:
 * - DOC-FE-001 (Workspace Architecture)
 * - DOC-MOD-000 (Workspace Domain Modules)
 * - canvas-01.html wireframe layout
 * - 100% token coverage from @lemmo-lab/tokens
 */

'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useUiStore } from '@/stores/uiStore';
import {
  CanvasLayer,
  CanvasNode,
  CanvasDockMode,
  CanvasActiveTool,
  CanvasViewport,
} from '../types';
import { MOCK_CANVAS_PROJECTS } from '../data/mockCanvasProjects';
import { CanvasWorkspaceSidePanel } from './CanvasWorkspaceSidePanel';
import { CanvasZoomWidget } from './CanvasZoomWidget';
import { CanvasBottomToolbar } from './CanvasBottomToolbar';
import { CanvasBoardSurface } from './CanvasBoardSurface';
import {
  CanvasPropertiesPanel,
  InspectorSelectionType,
  CanvasShapeElement,
  CanvasFrameElement,
  CanvasWorkspaceSettings,
} from './CanvasPropertiesPanel';

interface CanvasWorkspaceEditorProps {
  projectId: string;
}

export default function CanvasWorkspaceEditor({ projectId }: CanvasWorkspaceEditorProps) {
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';
  const isFa = locale === 'fa';

  // Find project details from mock or provide fallback
  const existingProject = useMemo(() => {
    return MOCK_CANVAS_PROJECTS.find((p) => p.id === projectId);
  }, [projectId]);

  const [projectTitle, setProjectTitle] = useState(() => {
    if (existingProject) {
      return isFa ? existingProject.titleFa : existingProject.title;
    }
    return isFa ? 'بوم جدید نامحدود' : 'Untitled Infinite Canvas';
  });

  // Hydration safety using React 19 recommended useSyncExternalStore
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // State Management
  const [sideWidth, setSideWidth] = useState(286);
  const [dockMode, setDockMode] = useState<CanvasDockMode>('workflow');
  const [activeTool, setActiveTool] = useState<CanvasActiveTool>('select');

  const handleDockModeChange = (newMode: CanvasDockMode) => {
    setDockMode(newMode);
    if (newMode === 'design' && (activeTool === 'node' || activeTool === 'media')) {
      setActiveTool('select');
    } else if (newMode === 'workflow' && (activeTool === 'shape' || activeTool === 'comment')) {
      setActiveTool('select');
    }
  };
  const [viewport, setViewport] = useState<CanvasViewport>({ x: 60, y: 80, zoom: 1 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1');
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-1');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Engineered Canvas Properties Inspector State
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [selectionType, setSelectionType] = useState<InspectorSelectionType>('node');

  const [shapeElement, setShapeElement] = useState<CanvasShapeElement>({
    id: 'shape-poly-1',
    name: isFa ? 'چندضلعی و ستاره' : 'Polygon 1',
    type: 'polygon',
    x: 180,
    y: 140,
    rotation: 0,
    isFlippedH: false,
    isFlippedV: false,
    width: 240,
    height: 240,
    isAspectLocked: true,
    opacity: 100,
    cornerRadius: 8,
    sides: 5,
    starInset: 48,
    fill: {
      type: 'linear-gradient',
      color: '#d1fe17',
      opacity: 100,
      isVisible: true,
      gradient: {
        from: '#d1fe17',
        to: '#00c8ff',
        angle: 135,
      },
    },
    stroke: {
      enabled: true,
      color: '#ffffff',
      width: 2,
      style: 'solid',
      position: 'inside',
    },
    effects: [
      {
        id: 'fx-1',
        type: 'neon-glow',
        blur: 24,
        x: 0,
        y: 8,
        color: 'rgba(209, 254, 23, 0.28)',
        enabled: true,
      },
    ],
  });

  const [frameElement, setFrameElement] = useState<CanvasFrameElement>({
    id: 'frame-1',
    name: isFa ? 'پست اینستاگرام (1:1)' : 'Instagram Post (1:1)',
    preset: 'instagram-square',
    width: 1080,
    height: 1080,
    x: 80,
    y: 80,
    bgColor: '#181b1e',
    clipContent: true,
    fillOpacity: 100,
  });

  const [canvasSettings, setCanvasSettings] = useState<CanvasWorkspaceSettings>({
    gridStyle: 'dots',
    snapToGrid: true,
    bgColor: '#131517',
    renderEngine: 'FLUX.1 [dev]',
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Initial Sample Nodes for this project
  const [nodes, setNodes] = useState<CanvasNode[]>(() => {
    const defaultThumbnail = existingProject?.thumbnail || '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp';

    return [
      {
        id: 'node-1',
        title: 'FLUX.1 [dev] Generator',
        titleFa: 'تولید تصویر FLUX.1',
        toolType: 'flux-dev',
        x: 80,
        y: 80,
        status: 'success',
        prompt: existingProject
          ? isFa
            ? existingProject.descriptionFa
            : existingProject.description
          : 'Cinematic portrait, dramatic volumetric lighting, 8k render',
        aspectRatio: '16:9',
        steps: 28,
        previewUrl: defaultThumbnail,
      },
      {
        id: 'node-2',
        title: 'Alpha Background Remover',
        titleFa: 'حذف خودکار پس‌زمینه',
        toolType: 'remove-bg',
        x: 480,
        y: 80,
        status: 'idle',
        aspectRatio: '1:1',
      },
    ];
  });

  // Selected Node (Memoized & Synced with Inspector)
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  }, [nodes, selectedNodeId]);

  const handleUpdateNode = (nodeId: string, updates: Partial<CanvasNode>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
    );
  };

  const handleRunSingleNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n))
    );
    setToastMessage(isFa ? 'پردازش هوش مصنوعی نود آغاز گردید...' : 'Generating node with AI...');
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'success',
                previewUrl:
                  n.previewUrl ||
                  '/images/feed/kneeling-knight-in-full-plate-armor-holding-glowing-sword.webp',
              }
            : n
        )
      );
      setToastMessage(isFa ? 'نود با موفقیت تولید شد' : 'Node generated successfully');
    }, 1400);
  };

  const handleSelectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setSelectionType('node');
    } else {
      setSelectionType('canvas');
    }
  };

  // Initial Hierarchical Layers (Figma-Style folders + stacking order: Foreground at top, Background at bottom)
  const [layers, setLayers] = useState<CanvasLayer[]>(() => {
    const defaultThumbnail = existingProject?.thumbnail || '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp';

    return [
      {
        id: 'group-fg',
        name: 'Foreground & Cutouts',
        nameFa: 'پیش‌زمینه و سوژه‌ها',
        type: 'group',
        isVisible: true,
        isExpanded: true,
        children: [
          {
            id: 'layer-1',
            name: 'Hero Character Composite',
            nameFa: 'سوژه اصلی کاراکتر',
            type: 'image',
            isVisible: true,
            nodeId: 'node-1',
          },
          {
            id: 'layer-2',
            name: 'Alpha Silhouette Mask',
            nameFa: 'ماسک ترنسپرنت آلفا',
            type: 'mask',
            isVisible: true,
            nodeId: 'node-2',
          },
        ],
      },
      {
        id: 'group-fx',
        name: 'Atmospheric Effects',
        nameFa: 'افکت‌های اتمسفریک',
        type: 'group',
        isVisible: true,
        isExpanded: true,
        children: [
          {
            id: 'layer-3',
            name: 'Neon Rim Lighting',
            nameFa: 'نورپردازی لبه‌های نئونی',
            type: 'tool',
            isVisible: true,
          },
          {
            id: 'layer-4',
            name: 'Volumetric Depth Fog',
            nameFa: 'مه عمقی و پرتوهای نور',
            type: 'tool',
            isVisible: true,
          },
        ],
      },
      {
        id: 'layer-bg',
        name: 'Cyberpunk Tokyo Backdrop',
        nameFa: 'تصویر پس‌زمینه شهر',
        type: 'image',
        isVisible: true,
        thumbnail: defaultThumbnail,
      },
    ];
  });

  // Layer Tree Operations: Add Layer (Leaf)
  const handleAddLayer = () => {
    const newId = `layer-${Date.now()}`;
    const newLayer: CanvasLayer = {
      id: newId,
      name: `New Layer ${layers.length + 1}`,
      nameFa: `لایه جدید ${layers.length + 1}`,
      type: 'image',
      isVisible: true,
    };
    setLayers((prev) => [newLayer, ...prev]);
    setActiveLayerId(newId);
    setToastMessage(isFa ? 'لایه جدید اضافه شد' : 'New layer added');
  };

  // Layer Tree Operations: Add Group (Folder)
  const handleAddGroup = () => {
    const newId = `group-${Date.now()}`;
    const newGroup: CanvasLayer = {
      id: newId,
      name: `New Group ${layers.length + 1}`,
      nameFa: `پوشه جدید ${layers.length + 1}`,
      type: 'group',
      isVisible: true,
      isExpanded: true,
      children: [],
    };
    setLayers((prev) => [newGroup, ...prev]);
    setActiveLayerId(newId);
    setToastMessage(isFa ? 'پوشه جدید ایجاد شد' : 'New group created');
  };

  // Layer Tree Operations: Toggle Visibility
  const handleToggleLayerVisibility = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) => {
      const toggle = (list: CanvasLayer[]): CanvasLayer[] => {
        return list.map((item) => {
          if (item.id === layerId) {
            return { ...item, isVisible: !item.isVisible };
          }
          if (item.children) {
            return { ...item, children: toggle(item.children) };
          }
          return item;
        });
      };
      return toggle(prev);
    });
  };

  // Layer Tree Operations: Toggle Expand/Collapse
  const handleToggleLayerExpand = (layerId: string) => {
    setLayers((prev) => {
      const toggle = (list: CanvasLayer[]): CanvasLayer[] => {
        return list.map((item) => {
          if (item.id === layerId) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          if (item.children) {
            return { ...item, children: toggle(item.children) };
          }
          return item;
        });
      };
      return toggle(prev);
    });
  };

  // Layer Tree Operations: Rename Layer
  const handleUpdateLayerName = (layerId: string, newName: string) => {
    setLayers((prev) => {
      const update = (list: CanvasLayer[]): CanvasLayer[] => {
        return list.map((item) => {
          if (item.id === layerId) {
            return { ...item, name: newName, nameFa: newName };
          }
          if (item.children) {
            return { ...item, children: update(item.children) };
          }
          return item;
        });
      };
      return update(prev);
    });
  };

  // Layer Tree Operations: Drag & Drop Reorder (Recursive)
  const handleReorderLayers = (draggedId: string, targetId: string, position: 'top' | 'bottom') => {
    setLayers((prev) => {
      let extractedItem: CanvasLayer | null = null;

      const removeItem = (list: CanvasLayer[]): CanvasLayer[] => {
        const result: CanvasLayer[] = [];
        for (const item of list) {
          if (item.id === draggedId) {
            extractedItem = item;
          } else if (item.children) {
            result.push({ ...item, children: removeItem(item.children) });
          } else {
            result.push(item);
          }
        }
        return result;
      };

      const treeWithoutItem = removeItem(prev);
      if (!extractedItem) return prev;

      const itemToInsert = extractedItem as CanvasLayer;

      const insertItem = (list: CanvasLayer[]): CanvasLayer[] => {
        const result: CanvasLayer[] = [];
        for (const item of list) {
          if (item.id === targetId) {
            if (position === 'top') {
              result.push(itemToInsert);
              result.push(item);
            } else {
              result.push(item);
              result.push(itemToInsert);
            }
          } else if (item.children) {
            result.push({ ...item, children: insertItem(item.children) });
          } else {
            result.push(item);
          }
        }
        return result;
      };

      return insertItem(treeWithoutItem);
    });
  };

  // Node Action Handlers
  const handleAddToolNode = (toolType: 'flux-dev' | 'remove-bg' | 'upscale') => {
    const newId = `node-${Date.now()}`;
    const titles = {
      'flux-dev': { en: 'FLUX.1 Generator', fa: 'تولید تصویر FLUX.1' },
      'remove-bg': { en: 'Background Remover', fa: 'حذف پس‌زمینه' },
      'upscale': { en: 'Upscale Ultra 4K', fa: 'افزایش رزولوشن ۴K' },
    };

    // Calculate spawn position relative to center of view
    const spawnX = Math.round(-viewport.x / viewport.zoom + 200 + nodes.length * 40);
    const spawnY = Math.round(-viewport.y / viewport.zoom + 120 + nodes.length * 30);

    const newNode: CanvasNode = {
      id: newId,
      title: titles[toolType].en,
      titleFa: titles[toolType].fa,
      toolType,
      x: Math.max(40, spawnX),
      y: Math.max(40, spawnY),
      status: 'idle',
      aspectRatio: '1:1',
      prompt: toolType === 'flux-dev' ? 'Vibrant colorful artistic composition' : undefined,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);

    // Also register a layer for this node
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name: titles[toolType].en,
      nameFa: titles[toolType].fa,
      type: 'tool',
      isVisible: true,
      isLocked: false,
      nodeId: newId,
    };
    setLayers((prev) => [newLayer, ...prev]);

    setToastMessage(
      isFa
        ? `نود «${titles[toolType].fa}» به بوم افزوده شد`
        : `Node "${titles[toolType].en}" added to canvas`
    );
  };

  const handleDeleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    setToastMessage(isFa ? 'نود حذف شد' : 'Node removed');
  };

  const handleUpdateNodePosition = (nodeId: string, newX: number, newY: number) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, x: newX, y: newY } : node
      )
    );
  };

  const handleUpdatePrompt = (nodeId: string, prompt: string) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, prompt } : node))
    );
  };

  const handleUploadImage = () => {
    // Spawns a mock media node
    const newId = `node-img-${Date.now()}`;
    const newNode: CanvasNode = {
      id: newId,
      title: 'Imported Reference Image',
      titleFa: 'تصویر ورودی مرجع',
      toolType: 'image',
      x: Math.round(-viewport.x / viewport.zoom + 120),
      y: Math.round(-viewport.y / viewport.zoom + 220),
      status: 'success',
      previewUrl: '/images/feed/futuristic-solarpunk-city-towering-mushroom-shaped.webp',
      aspectRatio: '16:9',
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setToastMessage(isFa ? 'تصویر با موفقیت وارد بوم شد' : 'Image imported to canvas');
  };

  // Zoom Helpers
  const handleZoomIn = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(2.0, parseFloat((prev.zoom + 0.15).toFixed(2))),
    }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.max(0.25, parseFloat((prev.zoom - 0.15).toFixed(2))),
    }));
  };

  const handleResetZoom = () => {
    setViewport({ x: 60, y: 80, zoom: 1 });
  };

  // Flow Execution Simulator (Zero-Leakage Mock Job Lifecycle)
  const handleRunPipeline = () => {
    if (isRunningPipeline) return;

    setIsRunningPipeline(true);
    setToastMessage(isFa ? 'پردازش پایپ‌لاین بوم آغاز گردید...' : 'Pipeline execution started...');

    // Set idle nodes to running
    setNodes((prev) =>
      prev.map((node) => (node.status === 'idle' ? { ...node, status: 'running' } : node))
    );

    // Simulate async job completion
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.status === 'running') {
            return {
              ...node,
              status: 'success',
              previewUrl:
                node.previewUrl ||
                '/images/feed/kneeling-knight-in-full-plate-armor-holding-glowing-sword.webp',
            };
          }
          return node;
        })
      );
      setIsRunningPipeline(false);
      setToastMessage(
        isFa
          ? 'پردازش پایپ‌لاین بوم با موفقیت به پایان رسید'
          : 'Pipeline execution finished successfully'
      );
    }, 1800);
  };

  if (!mounted) {
    return (
      <div className="canvas-workspace-shell" dir={dir}>
        <div className="canvas-workspace-loading" />
      </div>
    );
  }

  return (
    <div className="canvas-workspace-shell" dir={dir}>
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="canvas-toast-alert" role="status" aria-live="polite">
          <span className="toast-dot" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Left-hand / Inline-Start Workspace Side Panel (Layers & Project Config) */}
      <CanvasWorkspaceSidePanel
        sideWidth={sideWidth}
        onChangeSideWidth={setSideWidth}
        projectTitle={projectTitle}
        onChangeTitle={setProjectTitle}
        layers={layers}
        activeLayerId={activeLayerId}
        onSelectLayer={setActiveLayerId}
        onAddLayer={handleAddLayer}
        onAddGroup={handleAddGroup}
        onToggleVisibility={handleToggleLayerVisibility}
        onToggleExpand={handleToggleLayerExpand}
        onUpdateLayerName={handleUpdateLayerName}
        onReorderLayers={handleReorderLayers}
        locale={locale}
        isRtl={isRtl}
      />

      {/* 2. Main Canvas Viewport Container */}
      <div className="canvas-viewport-container">
        {/* Top Center: Viewport Zoom Controls (Replaces solo/team) */}
        <CanvasZoomWidget
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          locale={locale}
        />

        {/* Central Infinite 2D Board Surface (.canvas-area) */}
        <CanvasBoardSurface
          nodes={nodes}
          viewport={viewport}
          onChangeViewport={setViewport}
          activeTool={activeTool}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onDeleteNode={handleDeleteNode}
          onUpdateNodePosition={handleUpdateNodePosition}
          onUpdatePrompt={handleUpdatePrompt}
          onAddToolNode={handleAddToolNode}
          onUploadImage={handleUploadImage}
          locale={locale}
          isRtl={isRtl}
        />

        {/* Bottom Center: Floating Action Toolbar (.canvas-bottom-dock) */}
        <CanvasBottomToolbar
          dockMode={dockMode}
          onChangeDockMode={handleDockModeChange}
          activeTool={activeTool}
          onChangeTool={setActiveTool}
          onAddToolNode={handleAddToolNode}
          onUploadImage={handleUploadImage}
          onRunPipeline={handleRunPipeline}
          isRunningPipeline={isRunningPipeline}
          locale={locale}
        />
      </div>

      {/* 3. Inline-End Canvas Properties Inspector (Engineered for Lemmo Studio) */}
      <CanvasPropertiesPanel
        selectionType={selectionType}
        onChangeSelectionType={setSelectionType}
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onRunNode={handleRunSingleNode}
        shapeElement={shapeElement}
        onChangeShape={setShapeElement}
        frameElement={frameElement}
        onChangeFrame={setFrameElement}
        canvasSettings={canvasSettings}
        onChangeCanvasSettings={setCanvasSettings}
        onRunGlobalPipeline={handleRunPipeline}
        isRunningPipeline={isRunningPipeline}
        isOpen={isInspectorOpen}
        onToggleOpen={() => setIsInspectorOpen((prev) => !prev)}
        locale={locale}
        isRtl={isRtl}
      />
    </div>
  );
}
