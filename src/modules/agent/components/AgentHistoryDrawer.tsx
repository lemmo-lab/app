'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Clock03,
  Search01,
  Plus01,
  DotsVertical,
  Edit01,
  Trash01,
  X01,
  Check01,
  ChatSquare02,
} from 'synthline/react';
import { sdk, Thread } from '@/sdk';
import { useOptionalStudioContext } from '@/shared/providers/StudioContextProvider';

interface AgentHistoryDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeThreadId?: string;
  locale: string;
  isRtl?: boolean;
}

interface GroupedThreads {
  today: Thread[];
  yesterday: Thread[];
  previous7Days: Thread[];
  older: Thread[];
}

/**
 * Parses timestamp value from either seconds, milliseconds, or ISO date string.
 */
function parseTimestamp(thread: Thread): number {
  const raw =
    thread.createdAt ||
    (thread as unknown as { created_at?: string | number }).created_at ||
    thread.updatedAt ||
    (thread as unknown as { updated_at?: string | number }).updated_at;

  if (!raw) return Date.now();
  if (typeof raw === 'number') {
    return raw < 10000000000 ? raw * 1000 : raw;
  }
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export function AgentHistoryDrawer({
  isOpen,
  onClose,
  activeThreadId,
  locale,
  isRtl,
}: AgentHistoryDrawerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const studioContext = useOptionalStudioContext();
  const activeWorkspaceId = studioContext?.activeWorkspace?.id || '';
  const studioState = studioContext?.state || 'loading';
  const isContextReady = studioState === 'ready' && Boolean(activeWorkspaceId);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [menuThreadId, setMenuThreadId] = useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Close context menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuThreadId(null);
      }
    }
    if (menuThreadId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuThreadId]);

  // Focus rename input when editing starts
  useEffect(() => {
    if (editingThreadId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingThreadId]);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !editingThreadId && !deletingThreadId) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, editingThreadId, deletingThreadId]);

  // Fetch threads for workspace (ADR-016: gated on 6-state machine ready)
  const { data: threads = [], isLoading, error: threadsError } = useQuery({
    queryKey: ['workspace', activeWorkspaceId, 'chat-threads'],
    queryFn: () => sdk.chat.getThreads(),
    enabled: isContextReady,
  });

  // Rename thread mutation
  const renameMutation = useMutation({
    mutationFn: async ({ threadId, title }: { threadId: string; title: string }) => {
      return await sdk.chat.renameThread(threadId, title);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workspace', activeWorkspaceId, 'chat-threads'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', activeWorkspaceId, 'chat-thread', variables.threadId],
      });
      setEditingThreadId(null);
    },
  });

  // Delete thread mutation
  const deleteMutation = useMutation({
    mutationFn: async (threadId: string) => {
      return await sdk.chat.deleteThread(threadId);
    },
    onSuccess: (_, deletedThreadId) => {
      queryClient.invalidateQueries({
        queryKey: ['workspace', activeWorkspaceId, 'chat-threads'],
      });
      setDeletingThreadId(null);
      if (activeThreadId === deletedThreadId) {
        router.push('/app/agent');
      }
    },
  });

  // Filter and group threads chronologically
  const groupedThreads: GroupedThreads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = threads.filter((t) => {
      if (!q) return true;
      return (t.title || '').toLowerCase().includes(q);
    });

    const sorted = [...filtered].sort((a, b) => parseTimestamp(b) - parseTimestamp(a));

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfPrevious7Days = startOfToday - 7 * 86400000;

    const groups: GroupedThreads = {
      today: [],
      yesterday: [],
      previous7Days: [],
      older: [],
    };

    for (const thread of sorted) {
      const time = parseTimestamp(thread);
      if (time >= startOfToday) {
        groups.today.push(thread);
      } else if (time >= startOfYesterday) {
        groups.yesterday.push(thread);
      } else if (time >= startOfPrevious7Days) {
        groups.previous7Days.push(thread);
      } else {
        groups.older.push(thread);
      }
    }

    return groups;
  }, [threads, searchQuery]);

  const handleStartRename = (thread: Thread) => {
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title || '');
    setMenuThreadId(null);
  };

  const handleConfirmRename = (threadId: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setEditingThreadId(null);
      return;
    }
    renameMutation.mutate({ threadId, title: trimmed });
  };

  const handleStartDelete = (threadId: string) => {
    setDeletingThreadId(threadId);
    setMenuThreadId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingThreadId) {
      deleteMutation.mutate(deletingThreadId);
    }
  };

  const renderThreadItem = (thread: Thread) => {
    const isActive = thread.id === activeThreadId;
    const isEditing = editingThreadId === thread.id;
    const isMenuOpen = menuThreadId === thread.id;

    if (isEditing) {
      return (
        <li key={thread.id} className="history-thread-item editing">
          <div className="history-rename-box">
            <input
              ref={editInputRef}
              type="text"
              className="history-rename-input"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmRename(thread.id);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setEditingThreadId(null);
                }
              }}
              disabled={renameMutation.isPending}
              maxLength={255}
            />
            <div className="history-rename-actions">
              <button
                type="button"
                className="history-rename-confirm-btn"
                onClick={() => handleConfirmRename(thread.id)}
                disabled={renameMutation.isPending}
                aria-label={locale === 'fa' ? 'تایید تغییر نام' : 'Confirm rename'}
              >
                <Check01 size={14} strokeWidth={1.5} color="currentColor" />
              </button>
              <button
                type="button"
                className="history-rename-cancel-btn"
                onClick={() => setEditingThreadId(null)}
                disabled={renameMutation.isPending}
                aria-label={locale === 'fa' ? 'انصراف' : 'Cancel'}
              >
                <X01 size={14} strokeWidth={1.5} color="currentColor" />
              </button>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li
        key={thread.id}
        className={`history-thread-item ${isActive ? 'active' : ''}`}
      >
        <Link
          href={`/app/agent/${thread.id}`}
          className="history-thread-link"
          onClick={() => onClose()}
        >
          <span className="history-thread-icon">
            <ChatSquare02 size={16} strokeWidth={1.5} color="currentColor" />
          </span>
          <span className="history-thread-title" title={thread.title || ''}>
            {thread.title || (locale === 'fa' ? 'گفتگوی بدون عنوان' : 'Untitled thread')}
          </span>
        </Link>

        <div className="history-item-menu-container">
          <button
            type="button"
            className={`history-item-menu-trigger ${isMenuOpen ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuThreadId(isMenuOpen ? null : thread.id);
            }}
            aria-label={locale === 'fa' ? 'عملیات گفتگو' : 'Thread actions'}
          >
            <DotsVertical size={16} strokeWidth={1.5} color="currentColor" />
          </button>

          {isMenuOpen && (
            <div ref={menuRef} className="history-item-dropdown" dir={isRtl ? 'rtl' : 'ltr'}>
              <button
                type="button"
                className="history-dropdown-item"
                onClick={() => handleStartRename(thread)}
              >
                <Edit01 size={14} strokeWidth={1.5} color="currentColor" />
                <span>{locale === 'fa' ? 'تغییر نام' : 'Rename'}</span>
              </button>
              <button
                type="button"
                className="history-dropdown-item delete"
                onClick={() => handleStartDelete(thread.id)}
              >
                <Trash01 size={14} strokeWidth={1.5} color="currentColor" />
                <span>{locale === 'fa' ? 'حذف گفتگو' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  const renderGroup = (label: string, items: Thread[]) => {
    if (items.length === 0) return null;
    return (
      <div key={label} className="history-group">
        <div className="history-group-header">{label}</div>
        <ul className="history-thread-list">
          {items.map((thread) => renderThreadItem(thread))}
        </ul>
      </div>
    );
  };

  const totalFilteredCount =
    groupedThreads.today.length +
    groupedThreads.yesterday.length +
    groupedThreads.previous7Days.length +
    groupedThreads.older.length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="history-drawer-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Collapsible Drawer Container */}
      <aside
        className={`agent-history-drawer ${isOpen ? 'open' : 'closed'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-label={locale === 'fa' ? 'تاریخچه گفتگوهای استودیو' : 'Studio Chat History'}
      >
        <div className="history-drawer-inner">
          {/* Header section */}
          <div className="history-drawer-header">
            <div className="history-header-title-row">
              <div className="history-header-title">
                <Clock03 size={18} strokeWidth={1.5} color="currentColor" />
                <span>{locale === 'fa' ? 'تاریخچه گفتگوها' : 'Recents'}</span>
              </div>
              <button
                type="button"
                className="history-close-btn"
                onClick={onClose}
                aria-label={locale === 'fa' ? 'بستن پنل تاریخچه' : 'Close history panel'}
              >
                <X01 size={16} strokeWidth={1.5} color="currentColor" />
              </button>
            </div>

            {/* New Conversation Button */}
            <Link
              href="/app/agent"
              className="history-new-chat-btn"
              onClick={() => onClose()}
            >
              <Plus01 size={16} strokeWidth={1.5} color="currentColor" />
              <span>{locale === 'fa' ? 'مکالمه جدید' : 'New Conversation'}</span>
            </Link>

            {/* Search Bar */}
            <div className="history-search-wrapper">
              <span className="history-search-icon">
                <Search01 size={14} strokeWidth={1.5} color="currentColor" />
              </span>
              <input
                type="text"
                className="history-search-input"
                placeholder={locale === 'fa' ? 'جستجوی گفتگوها...' : 'Search threads...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="history-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label={locale === 'fa' ? 'پاک کردن جستجو' : 'Clear search'}
                >
                  <X01 size={12} strokeWidth={1.5} color="currentColor" />
                </button>
              )}
            </div>
          </div>

          {/* Thread List Body */}
          <div className="history-drawer-content">
            {(isLoading || studioState === 'loading') && (
              <div className="history-status-message">
                <span>{locale === 'fa' ? 'در حال بارگذاری...' : 'Loading history...'}</span>
              </div>
            )}

            {studioState === 'signed-out' && (
              <div className="history-status-message empty">
                <span>{locale === 'fa' ? 'لطفاً برای مشاهده تاریخچه وارد شوید.' : 'Please sign in to view history.'}</span>
              </div>
            )}

            {studioState === 'no-workspace' && (
              <div className="history-status-message empty">
                <span>{locale === 'fa' ? 'فضای کاری فعالی یافت نشد.' : 'No active workspace selected.'}</span>
              </div>
            )}

            {(studioState === 'error' || Boolean(threadsError)) && (
              <div className="history-status-message error">
                <span>{locale === 'fa' ? 'خطا در بارگذاری تاریخچه گفتگوها.' : 'Failed to load conversation history.'}</span>
              </div>
            )}

            {isContextReady && !isLoading && !threadsError && totalFilteredCount === 0 && (
              <div className="history-status-message empty">
                <span>
                  {searchQuery
                    ? locale === 'fa'
                      ? 'هیچ گفتگویی یافت نشد.'
                      : 'No threads match your search.'
                    : locale === 'fa'
                    ? 'هنوز گفتگویی ثبت نشده است.'
                    : 'No conversation history yet.'}
                </span>
              </div>
            )}

            {!isLoading && totalFilteredCount > 0 && (
              <div className="history-groups-wrapper">
                {renderGroup(locale === 'fa' ? 'امروز' : 'Today', groupedThreads.today)}
                {renderGroup(locale === 'fa' ? 'دیروز' : 'Yesterday', groupedThreads.yesterday)}
                {renderGroup(
                  locale === 'fa' ? '۷ روز گذشته' : 'Previous 7 Days',
                  groupedThreads.previous7Days
                )}
                {renderGroup(locale === 'fa' ? 'قدیمی‌تر' : 'Older', groupedThreads.older)}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {deletingThreadId && (
        <div className="history-confirm-overlay" role="dialog" aria-modal="true">
          <div className="history-confirm-card" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="history-confirm-header">
              <Trash01 size={20} strokeWidth={1.5} color="#ef4444" />
              <h3>{locale === 'fa' ? 'حذف گفتگو' : 'Delete Conversation'}</h3>
            </div>
            <p className="history-confirm-body">
              {locale === 'fa'
                ? 'آیا از حذف این گفتگو اطمینان دارید؟ پیام‌ها و محتواهای تولیدشده در این رشته حذف خواهند شد.'
                : 'Are you sure you want to delete this conversation? This will permanently remove the thread from your history.'}
            </p>
            <div className="history-confirm-actions">
              <button
                type="button"
                className="history-confirm-cancel-btn"
                onClick={() => setDeletingThreadId(null)}
                disabled={deleteMutation.isPending}
              >
                {locale === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                className="history-confirm-delete-btn"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending
                  ? locale === 'fa'
                    ? 'در حال حذف...'
                    : 'Deleting...'
                  : locale === 'fa'
                  ? 'حذف'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
