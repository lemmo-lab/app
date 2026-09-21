/**
 * Canvas Module Types — /app/canvas
 * Type definitions for Canvas Index, Workspaces & Starter Templates.
 * Conforms to Lemmo Design System and unbounded workspace architecture.
 */

export type CanvasTab = 'all' | 'recent' | 'starred' | 'templates';

export type CanvasSortOption = 'updated' | 'name' | 'created';

export interface CanvasProject {
  id: string;
  title: string;
  titleFa: string;
  description?: string;
  descriptionFa?: string;
  thumbnail: string;
  updatedAt: string;
  updatedAtFa: string;
  createdAt: string;
  isStarred: boolean;
  isTemplate?: boolean;
  tags?: string[];
}

export interface CanvasStarterTemplate {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  thumbnail: string;
  tag: string;
  tagFa: string;
}

export type CanvasMode = 'solo' | 'team';

export type CanvasActiveTool =
  | 'select'
  | 'hand'
  | 'node'
  | 'media'
  | 'frame'
  | 'text';

export interface CanvasLayer {
  id: string;
  name: string;
  nameFa: string;
  type: 'image' | 'prompt' | 'tool' | 'mask' | 'group' | 'text';
  isVisible: boolean;
  isLocked?: boolean;
  isExpanded?: boolean;
  children?: CanvasLayer[];
  nodeId?: string;
  thumbnail?: string;
}

export interface CanvasNodeSocket {
  id: string;
  name: string;
  nameFa: string;
  type: 'image' | 'text' | 'mask' | 'model';
}

export interface CanvasNode {
  id: string;
  title: string;
  titleFa: string;
  toolType: 'flux-dev' | 'remove-bg' | 'upscale' | 'prompt' | 'image' | 'relight';
  x: number;
  y: number;
  width?: number;
  height?: number;
  status: 'idle' | 'running' | 'success' | 'error';
  prompt?: string;
  aspectRatio?: string;
  steps?: number;
  previewUrl?: string;
  inputs?: CanvasNodeSocket[];
  outputs?: CanvasNodeSocket[];
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

