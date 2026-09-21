/**
 * Canvas Manager Component — /app/canvas
 * Master orchestrator for the redesigned Lemmo Generative Canvas Index.
 *
 * Implements:
 * 1. Atmospheric banner with background cinematic art and high-contrast overlays.
 * 2. Minimal and dynamic quick-start templates rail (row 2).
 * 3. Minimalist project cards: Only project title and last updated date.
 * 4. 1-click project addition without complex creation forms.
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';
import {
  CanvasProject,
  CanvasTab,
  CanvasSortOption,
  CanvasStarterTemplate,
} from '../types';
import {
  MOCK_CANVAS_PROJECTS,
  MOCK_CANVAS_STARTER_TEMPLATES,
} from '../data/mockCanvasProjects';
import { CanvasHeroBanner } from './CanvasHeroBanner';
import { CanvasStarterTemplates } from './CanvasStarterTemplates';
import { CanvasActionBar } from './CanvasActionBar';
import { CanvasProjectCard } from './CanvasProjectCard';
import { CanvasEmptyState } from './CanvasEmptyState';
import { CanvasVideoModal } from './CanvasVideoModal';

export default function CanvasManager() {
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';
  const isFa = locale === 'fa';

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Main State
  const [projects, setProjects] = useState<CanvasProject[]>(MOCK_CANVAS_PROJECTS);
  const [activeTab, setActiveTab] = useState<CanvasTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<CanvasSortOption>('updated');
  const [showStarterTemplates, setShowStarterTemplates] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Tab counts
  const tabCounts = useMemo<Record<CanvasTab, number>>(() => {
    const all = projects.length;
    const starred = projects.filter((p) => p.isStarred).length;
    const recent = projects.filter((p) => !p.isTemplate).length;
    const templates = projects.filter((p) => p.isTemplate).length + MOCK_CANVAS_STARTER_TEMPLATES.length;
    return { all, recent, starred, templates };
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Filter by Tab
    if (activeTab === 'templates') {
      list = list.filter((p) => p.isTemplate);
    } else if (activeTab === 'starred') {
      list = list.filter((p) => p.isStarred);
    } else if (activeTab === 'recent') {
      list = list.filter((p) => !p.isTemplate);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleFa.toLowerCase().includes(q) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          p.description?.toLowerCase().includes(q) ||
          p.descriptionFa?.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortOption === 'name') {
        const titleA = isFa ? a.titleFa : a.title;
        const titleB = isFa ? b.titleFa : b.title;
        return titleA.localeCompare(titleB);
      }
      if (sortOption === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // default: updated
      return 0; // maintain relative recency
    });

    return list;
  }, [projects, activeTab, searchQuery, sortOption, isFa]);

  // 1-Click Instant Add Blank Project
  const handleAddBlankProject = () => {
    const newProject: CanvasProject = {
      id: `canvas-${Date.now()}`,
      title: 'Untitled Canvas',
      titleFa: 'پروژه بوم جدید',
      description: 'Clean infinite workspace ready for nodes.',
      descriptionFa: 'محیط کاری نامحدود و آماده اتصال نودها.',
      thumbnail: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
      updatedAt: 'Just now',
      updatedAtFa: 'همین الان',
      createdAt: new Date().toISOString().split('T')[0],
      isStarred: false,
      tags: ['Workspace'],
    };

    setProjects((prev) => [newProject, ...prev]);
    setToastMessage(
      isFa
        ? 'پروژه بوم جدید ایجاد شد و آماده کار است'
        : 'New canvas project created successfully'
    );
  };

  // 1-Click Instant Clone from Starter Template
  const handleUseTemplate = (template: CanvasStarterTemplate) => {
    const templateProject: CanvasProject = {
      id: `canvas-tpl-${Date.now()}`,
      title: `${template.title} (Workflow)`,
      titleFa: `${template.titleFa} (ورک‌فلو)`,
      description: template.description,
      descriptionFa: template.descriptionFa,
      thumbnail: template.thumbnail,
      updatedAt: 'Just now',
      updatedAtFa: 'همین الان',
      createdAt: new Date().toISOString().split('T')[0],
      isStarred: false,
      isTemplate: false,
      tags: [template.tag, 'Template'],
    };

    setProjects((prev) => [templateProject, ...prev]);
    setToastMessage(
      isFa
        ? `قالب «${template.titleFa}» به پروژه‌های شما اضافه شد`
        : `Template "${template.title}" initialized as active workspace`
    );
  };

  // Action Handlers
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isStarred;
          setToastMessage(
            next
              ? isFa
                ? 'پروژه به نشان‌شده‌ها افزوده شد'
                : 'Project added to Starred'
              : isFa
              ? 'پروژه از نشان‌شده‌ها حذف شد'
              : 'Project removed from Starred'
          );
          return { ...p, isStarred: next };
        }
        return p;
      })
    );
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const source = projects.find((p) => p.id === id);
    if (!source) return;

    const newProject: CanvasProject = {
      ...source,
      id: `canvas-${Date.now()}`,
      title: `${source.title} (Copy)`,
      titleFa: `${source.titleFa} (نسخه کپی)`,
      updatedAt: 'Just now',
      updatedAtFa: 'همین الان',
      createdAt: new Date().toISOString().split('T')[0],
      isStarred: false,
    };

    setProjects((prev) => [newProject, ...prev]);
    setToastMessage(
      isFa ? 'پروژه با موفقیت تکثیر گردید' : 'Project duplicated successfully'
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setToastMessage(
      isFa ? 'پروژه با موفقیت حذف شد' : 'Project removed successfully'
    );
  };

  if (!mounted) {
    return (
      <div className="canvas-index-root" dir={dir}>
        <div className="canvas-main-body">
          <div className="canvas-skeleton-banner" />
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-index-root" dir={dir}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="canvas-toast-alert" role="status" aria-live="polite">
          <span className="toast-dot" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="canvas-main-body">
        {/* 1. Atmospheric Hero Banner with Background Image */}
        <CanvasHeroBanner
          locale={locale}
          isRtl={isRtl}
          onAddProject={handleAddBlankProject}
          onWatchVideo={() => setIsVideoModalOpen(true)}
        />

        {/* 2. Compact & Dynamic Quick-Start Templates Rail */}
        {showStarterTemplates && (
          <CanvasStarterTemplates
            templates={MOCK_CANVAS_STARTER_TEMPLATES}
            onSelectTemplate={handleUseTemplate}
            onDismiss={() => setShowStarterTemplates(false)}
            locale={locale}
            isRtl={isRtl}
          />
        )}

        {/* 3. Action Bar (Tabs, Search & Sort) */}
        <section className="canvas-workflow-section">
          <CanvasActionBar
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            tabCounts={tabCounts}
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            sortOption={sortOption}
            onChangeSort={setSortOption}
            locale={locale}
            isRtl={isRtl}
          />

          {/* 4. Projects Grid */}
          {filteredProjects.length === 0 ? (
            <CanvasEmptyState
              isSearchEmpty={searchQuery.trim().length > 0}
              searchQuery={searchQuery}
              onResetSearch={() => setSearchQuery('')}
              onCreateNew={handleAddBlankProject}
              locale={locale}
              isRtl={isRtl}
            />
          ) : (
            <div className="canvas-projects-grid">
              {/* 'Add Blank Canvas' card shown when viewing all or recent projects without search */}
              {(activeTab === 'all' || activeTab === 'recent') && !searchQuery.trim() && (
                <CanvasProjectCard
                  isCreateCard={true}
                  locale={locale}
                  isRtl={isRtl}
                  onCreateNew={handleAddBlankProject}
                />
              )}

              {/* Populated Project Cards: Only Title + Updated Date */}
              {filteredProjects.map((project) => (
                <CanvasProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  isRtl={isRtl}
                  onToggleFavorite={handleToggleFavorite}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Intro Video Walkthrough Modal */}
      <CanvasVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        locale={locale}
        isRtl={isRtl}
      />
    </div>
  );
}
