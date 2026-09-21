/**
 * Canvas Project Card Component — /app/canvas
 * Clean, distraction-free realization of canvas workspace cards.
 * Displays only project cover, project title, and last updated date as requested.
 * Free from fixed dimension badges or confusing aspect ratios.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus01,
  Heart,
  Copy01,
  Trash01,
} from 'synthline/react';
import { CanvasProject } from '../types';

interface CanvasProjectCardProps {
  project?: CanvasProject;
  isCreateCard?: boolean;
  locale: string;
  isRtl: boolean;
  onCreateNew?: () => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onDuplicate?: (id: string, e: React.MouseEvent) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export function CanvasProjectCard({
  project,
  isCreateCard = false,
  locale,
  isRtl,
  onCreateNew,
  onToggleFavorite,
  onDuplicate,
  onDelete,
}: CanvasProjectCardProps) {
  const isFa = locale === 'fa';

  // 1. Create New Blank Canvas Card (Direct 1-Click Creation)
  if (isCreateCard || !project) {
    return (
      <div
        className="canvas-project-card create-card"
        onClick={onCreateNew}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCreateNew?.();
          }
        }}
        title={isFa ? 'افزودن پروژه بوم جدید' : 'Add New Canvas Project'}
        aria-label={isFa ? 'افزودن پروژه بوم جدید' : 'Add New Canvas Project'}
      >
        <div className="canvas-card-cover create-cover">
          <div className="canvas-plus-icon-circle">
            <Plus01 size={20} strokeWidth={2.4} color="currentColor" />
          </div>
          <span className="create-card-hint">
            {isFa ? 'شروع با بوم خالی' : 'Start with blank canvas'}
          </span>
        </div>

        <div className="canvas-card-meta">
          <h3 className="canvas-card-title create-title">
            {isFa ? 'افزودن پروژه جدید' : 'New Project'}
          </h3>
          <span className="canvas-card-time">
            {isFa ? 'ایجاد محیط کاری تازه' : 'Create fresh workspace'}
          </span>
        </div>
      </div>
    );
  }

  // 2. Regular Canvas Workspace Project Card
  const title = isFa ? project.titleFa : project.title;
  const updatedText = isFa ? project.updatedAtFa : project.updatedAt;

  return (
    <div className="canvas-project-card">
      {/* Workspace Preview Thumbnail */}
      <Link
        href={`/app/tools`}
        className="canvas-card-cover-link"
        title={title}
      >
        <div className="canvas-card-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={title}
            className="canvas-cover-image"
            loading="lazy"
          />

          {/* Hover Actions Bar */}
          <div
            className="canvas-cover-hover-toolbar"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Star / Favorite Button */}
            <button
              type="button"
              className={`cover-action-btn favorite-btn ${project.isStarred ? 'starred' : ''}`}
              onClick={(e) => onToggleFavorite?.(project.id, e)}
              title={
                project.isStarred
                  ? isFa
                    ? 'حذف از نشان‌شده‌ها'
                    : 'Unstar'
                  : isFa
                  ? 'افزودن به نشان‌شده‌ها'
                  : 'Star project'
              }
              aria-label={project.isStarred ? 'Unstar project' : 'Star project'}
            >
              <Heart
                size={14}
                strokeWidth={2}
                color={project.isStarred ? '#ff4b72' : 'currentColor'}
              />
            </button>

            {/* Duplicate Button */}
            <button
              type="button"
              className="cover-action-btn"
              onClick={(e) => onDuplicate?.(project.id, e)}
              title={isFa ? 'تکثیر پروژه' : 'Duplicate project'}
              aria-label="Duplicate project"
            >
              <Copy01 size={14} strokeWidth={2} color="currentColor" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              className="cover-action-btn delete-btn"
              onClick={(e) => onDelete?.(project.id, e)}
              title={isFa ? 'حذف پروژه' : 'Delete project'}
              aria-label="Delete project"
            >
              <Trash01 size={14} strokeWidth={2} color="currentColor" />
            </button>
          </div>
        </div>
      </Link>

      {/* Metadata Section: Only Project Title + Last Updated Date */}
      <div className="canvas-card-meta">
        <Link
          href={`/app/tools`}
          className="canvas-card-title-link"
          title={title}
        >
          <h3 className="canvas-card-title">{title}</h3>
        </Link>

        <div className="canvas-card-meta-line">
          <span className="canvas-card-time" data-numeric="true">
            {updatedText}
          </span>
        </div>
      </div>
    </div>
  );
}
