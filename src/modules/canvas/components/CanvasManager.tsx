'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '@/stores/uiStore';
import { sdk, Project } from '@/sdk';
import {
  CanvasProject,
  CanvasTab,
  CanvasSortOption,
  CanvasStarterTemplate,
} from '../types';
import { CANVAS_STARTER_TEMPLATES } from '../constants/starterTemplates';
import { CanvasHeroBanner } from './CanvasHeroBanner';
import { CanvasStarterTemplates } from './CanvasStarterTemplates';
import { CanvasActionBar } from './CanvasActionBar';
import { CanvasProjectCard } from './CanvasProjectCard';
import { CanvasEmptyState } from './CanvasEmptyState';
import { CanvasVideoModal } from './CanvasVideoModal';

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';

function projectToCanvasProject(p: Project): CanvasProject {
  return {
    id: p.id,
    title: p.name,
    titleFa: p.name,
    description: p.description || 'Clean infinite workspace ready for nodes.',
    descriptionFa: p.description || 'محیط کاری نامحدود و آماده اتصال نودها.',
    thumbnail: FALLBACK_THUMBNAIL,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Just now',
    updatedAtFa: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('fa-IR') : 'همین الان',
    createdAt: p.createdAt
      ? new Date(p.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    isStarred: false,
    tags: ['Workspace'],
  };
}

export default function CanvasManager() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { dir, locale } = useUiStore();
  const isRtl = dir === 'rtl';
  const isFa = locale === 'fa';

  // Hydration guard
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // TanStack Query for backend projects via SDK
  const { data: serverProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => sdk.projects.list(),
  });

  // Client mutations
  const createProjectMutation = useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      sdk.projects.create(input),
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setToastMessage(
        isFa
          ? 'پروژه بوم جدید ایجاد شد و آماده کار است'
          : 'New canvas project created successfully'
      );
      router.push(`/app/canvas/${newProj.id}`);
    },
  });

  // Local overrides & modifications
  const [localProjects, setLocalProjects] = useState<CanvasProject[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  // Merge server projects and local creations
  const projects = useMemo(() => {
    const serverMapped = serverProjects.map(projectToCanvasProject);
    const combined = [...localProjects, ...serverMapped].filter(
      (p) => !deletedIds.has(p.id)
    );

    // Deduplicate by ID
    const seen = new Set<string>();
    const deduplicated: CanvasProject[] = [];
    for (const p of combined) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        deduplicated.push({
          ...p,
          isStarred: starredIds.has(p.id) || p.isStarred,
        });
      }
    }
    return deduplicated;
  }, [serverProjects, localProjects, deletedIds, starredIds]);

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
    const templates =
      projects.filter((p) => p.isTemplate).length +
      CANVAS_STARTER_TEMPLATES.length;
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
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.titleFa?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.descriptionFa?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortOption === 'name') {
        const titleA = isFa ? (a.titleFa || a.title) : a.title;
        const titleB = isFa ? (b.titleFa || b.title) : b.title;
        return titleA.localeCompare(titleB);
      }
      if (sortOption === 'created') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });

    return list;
  }, [projects, activeTab, searchQuery, sortOption, isFa]);

  // 1-Click Instant Add Blank Project
  const handleAddBlankProject = () => {
    createProjectMutation.mutate({
      name: isFa ? 'پروژه بوم جدید' : 'Untitled Canvas',
      description: 'Clean infinite workspace ready for nodes.',
    });
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

    setLocalProjects((prev) => [templateProject, ...prev]);
    setToastMessage(
      isFa
        ? `قالب «${template.titleFa}» به پروژه‌های شما اضافه شد`
        : `Template "${template.title}" initialized as active workspace`
    );
    router.push(`/app/canvas/${templateProject.id}`);
  };

  // Action Handlers
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      const isStarredNow = !next.has(id);
      if (isStarredNow) {
        next.add(id);
        setToastMessage(
          isFa ? 'پروژه به نشان‌شده‌ها افزوده شد' : 'Project added to Starred'
        );
      } else {
        next.delete(id);
        setToastMessage(
          isFa ? 'پروژه از نشان‌شده‌ها حذف شد' : 'Project removed from Starred'
        );
      }
      return next;
    });
  };

  const handleDuplicate = useCallback(
    (id: string, e: React.MouseEvent) => {
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

      setLocalProjects((prev) => [newProject, ...prev]);
      setToastMessage(
        isFa ? 'پروژه با موفقیت تکثیر گردید' : 'Project duplicated successfully'
      );
    },
    [projects, isFa]
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletedIds((prev) => new Set(prev).add(id));
    setToastMessage(
      isFa ? 'پروژه با موفقیت حذف شد' : 'Project removed successfully'
    );
  };

  if (!mounted) {
    return (
      <div className="canvas-loading-skeleton" aria-busy="true">
        <div className="skeleton-hero" />
        <div className="skeleton-grid" />
      </div>
    );
  }

  return (
    <div className="canvas-dashboard-root" dir={dir}>
      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="canvas-toast-banner" role="status" aria-live="polite">
          <span className="toast-dot" />
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Top Hero Banner */}
      <CanvasHeroBanner
        locale={locale}
        isRtl={isRtl}
        onAddProject={handleAddBlankProject}
        onWatchVideo={() => setIsVideoModalOpen(true)}
      />

      {/* Recommended Starter Templates Section */}
      {showStarterTemplates && (
        <CanvasStarterTemplates
          locale={locale}
          isRtl={isRtl}
          templates={CANVAS_STARTER_TEMPLATES}
          onSelectTemplate={handleUseTemplate}
          onDismiss={() => setShowStarterTemplates(false)}
        />
      )}

      {/* Filter / Search / Action Toolstrip */}
      <CanvasActionBar
        locale={locale}
        isRtl={isRtl}
        activeTab={activeTab}
        tabCounts={tabCounts}
        searchQuery={searchQuery}
        sortOption={sortOption}
        onChangeTab={setActiveTab}
        onChangeSearch={setSearchQuery}
        onChangeSort={setSortOption}
      />

      {/* Main Grid View */}
      {filteredProjects.length > 0 ? (
        <main
          className="canvas-projects-grid"
          aria-label={isFa ? 'لیست پروژه‌های بوم' : 'Canvas projects list'}
        >
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
        </main>
      ) : (
        <CanvasEmptyState
          locale={locale}
          isRtl={isRtl}
          isSearchEmpty={Boolean(searchQuery.trim())}
          searchQuery={searchQuery}
          onResetSearch={() => setSearchQuery('')}
          onCreateNew={handleAddBlankProject}
        />
      )}

      {/* Video Modal Walkthrough */}
      <CanvasVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        locale={locale}
        isRtl={isRtl}
      />
    </div>
  );
}
