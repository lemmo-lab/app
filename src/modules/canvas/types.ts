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
