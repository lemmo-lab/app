/**
 * Canvas Module Entry Point — /app/canvas
 * Conforms to DOC-FE-001 (Workspace Frontend Architecture).
 */

export { default as CanvasManager } from './components/CanvasManager';
export { default as CanvasWorkspaceEditor } from './components/CanvasWorkspaceEditor';
export { CanvasWorkspaceSidePanel } from './components/CanvasWorkspaceSidePanel';
export { CanvasTopModeSwitcher } from './components/CanvasTopModeSwitcher';
export { CanvasBottomToolbar } from './components/CanvasBottomToolbar';
export { CanvasBoardSurface } from './components/CanvasBoardSurface';
export { CanvasNodeCard } from './components/CanvasNodeCard';
export * from './types';
export * from './data/mockCanvasProjects';

