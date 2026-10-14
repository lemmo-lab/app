'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, RefreshCw, Clock03 } from 'synthline/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk, Message, PlatformApiError } from '@/sdk';
import { useOptionalStudioContext } from '@/shared/providers/StudioContextProvider';
import {
  AgentChatMessageItem,
  AgentGenerationConfig,
  AgentReferenceItem,
  AgentAspectRatio,
} from '../types';
import { AgentChatMessage } from './AgentChatMessage';
import { AgentInputBar } from './AgentInputBar';
import { formatAgentErrorMessage } from '../utils/errorMapping';

interface AgentChatViewProps {
  currentId?: string;
  initialPrompt?: string;
  locale: string;
  isRtl: boolean;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
}

/**
 * Maps SDK Message domain model to AgentChatMessageItem UI presentation model.
 * Fully supports both snake_case (PostgreSQL DB/REST) and camelCase (Proto/SDK) models.
 */
function mapSdkMessageToAgentMessage(
  msg: Message,
  config?: AgentGenerationConfig
): AgentChatMessageItem {
  const rawMsg = msg as unknown as Record<string, unknown>;
  const rawCreatedAt =
    msg.createdAt ||
    (rawMsg.created_at as string | number) ||
    Date.now();
  const timestampDate = new Date(
    typeof rawCreatedAt === 'number' && rawCreatedAt < 10000000000
      ? rawCreatedAt * 1000
      : rawCreatedAt
  );
  const formattedTime = !isNaN(timestampDate.getTime())
    ? timestampDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (msg.role === 'user') {
    const refs: AgentReferenceItem[] = (msg.attachments || []).map((att) => ({
      id: att.id,
      url: att.url,
      name: att.name,
    }));
    return {
      id: msg.id,
      sender: 'user',
      timestamp: formattedTime,
      prompt: msg.content,
      references: refs.length > 0 ? refs : undefined,
    };
  }

  // Assistant response
  let mediaUrl = msg.attachments?.[0]?.url;

  // Extract media URL directly from parts array if present
  const rawParts = (msg.parts || (rawMsg.parts as Array<Record<string, unknown>>)) as
    | Array<Record<string, unknown>>
    | undefined;

  if (!mediaUrl && Array.isArray(rawParts)) {
    for (const part of rawParts) {
      if (typeof part.url === 'string' && part.url) {
        mediaUrl = part.url;
        break;
      }
      if (typeof part.output_url === 'string' && part.output_url) {
        mediaUrl = part.output_url;
        break;
      }
      if (typeof part.preview_url === 'string' && part.preview_url) {
        mediaUrl = part.preview_url;
        break;
      }
    }
  }

  if (mediaUrl && mediaUrl.includes('minio:9000')) {
    mediaUrl = mediaUrl.replace('minio:9000', 'localhost:9000');
  }

  const aspect =
    (msg.attachments?.[0]?.aspectRatio as AgentAspectRatio) ||
    config?.aspectRatio ||
    '3:4';

  // Extract jobId supporting both camelCase and snake_case from jobs array and parts
  const rawJobs = (msg.jobs || (rawMsg.jobs as Array<Record<string, unknown>>)) as
    | Array<Record<string, unknown>>
    | undefined;
  const firstJob = rawJobs?.[0];
  const jobRefPart = Array.isArray(rawParts)
    ? rawParts.find((p) => p.type === 'job_ref' || p.job_id || p.jobId)
    : undefined;

  const resolvedJobId =
    (firstJob?.jobId as string) ||
    (firstJob?.job_id as string) ||
    (jobRefPart?.job_id as string) ||
    (jobRefPart?.jobId as string) ||
    msg.jobId ||
    (rawMsg.job_id as string);

  const resolvedToolId =
    (firstJob?.toolId as string) ||
    (firstJob?.tool_id as string) ||
    (jobRefPart?.tool_id as string) ||
    (jobRefPart?.toolId as string);

  return {
    id: msg.id,
    sender: 'assistant',
    timestamp: formattedTime,
    text: msg.content,
    resultMediaUrl: mediaUrl,
    contentType: config?.contentType || 'image',
    aspectRatio: aspect,
    modelUsed: config?.modelId === 'flux-1-dev' ? 'FLUX.1 [dev]' : 'Lemmo Realism v2',
    seed: Math.floor(Math.random() * 900000000) + 100000000,
    generationDurationSec: 2.8,
    creditsUsed: (config?.batchCount || 1) * 5,
    isFavorite: false,
    status: (msg.status as AgentChatMessageItem['status']) || 'completed',
    jobId: resolvedJobId,
    toolId: resolvedToolId,
  };
}

export function AgentChatView({
  currentId,
  initialPrompt,
  locale,
  isRtl,
  isHistoryOpen,
  onToggleHistory,
}: AgentChatViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const studioContext = useOptionalStudioContext();
  const userId = studioContext?.user?.id || '';
  const activeWorkspaceId = studioContext?.activeWorkspace?.id || '';
  const studioState = studioContext?.state || 'loading';
  const isContextReady = studioState === 'ready' && Boolean(userId) && Boolean(activeWorkspaceId);

  // 1. Fetch available chat threads to identify active thread ID (SEC-23: workspace-scoped & user-scoped)
  const { data: threads = [] } = useQuery({
    queryKey: ['user', userId, 'workspace', activeWorkspaceId, 'chat-threads'],
    queryFn: () => sdk.chat.getThreads(),
    enabled: isContextReady,
  });

  const [createdThreadId, setCreatedThreadId] = useState<string | null>(null);

  const existingThread = currentId
    ? threads.find((t) => t.id === currentId)
    : (createdThreadId ? threads.find((t) => t.id === createdThreadId) : undefined);
  const activeThreadId = existingThread
    ? existingThread.id
    : (currentId || createdThreadId || threads[0]?.id || '');
  const isServerThread = Boolean(threads.some((t) => t.id === activeThreadId));
  const shouldFetchThread = Boolean(activeThreadId) && (isServerThread || Boolean(currentId) || Boolean(createdThreadId));

  // 2. Fetch messages for active thread from SDK (SEC-23: workspace-scoped & user-scoped)
  const { data: threadData, isLoading: isLoadingThread } = useQuery({
    queryKey: ['user', userId, 'workspace', activeWorkspaceId, 'chat-thread', activeThreadId],
    queryFn: () => sdk.chat.getThread(activeThreadId),
    enabled: isContextReady && shouldFetchThread,
  });

  // Local session messages per thread
  const [localMessages, setLocalMessages] = useState<Record<string, AgentChatMessageItem[]>>({});
  const sessionMessages = useMemo(
    () => localMessages[activeThreadId] || localMessages['pending-thread'] || [],
    [localMessages, activeThreadId]
  );

  // Messages loaded from SDK query
  const initialMessages = useMemo(() => {
    if (!threadData?.messages || threadData.messages.length === 0) return [];
    return threadData.messages.map((m) => mapSdkMessageToAgentMessage(m));
  }, [threadData]);

  // Combined messages sequence (server history + session messages with deduplication by ID)
  const messages: AgentChatMessageItem[] = useMemo(() => {
    const map = new Map<string, AgentChatMessageItem>();
    for (const m of initialMessages) {
      map.set(m.id, m);
    }
    for (const m of sessionMessages) {
      const existing = map.get(m.id);
      if (existing) {
        map.set(m.id, {
          ...existing,
          ...m,
          text: m.text || existing.text,
          status: m.status || existing.status,
          resultMediaUrl: m.resultMediaUrl || existing.resultMediaUrl,
          jobId: m.jobId || existing.jobId,
        });
      } else {
        map.set(m.id, m);
      }
    }
    return Array.from(map.values());
  }, [initialMessages, sessionMessages]);

  const [prompt, setPrompt] = useState(() => initialPrompt?.trim() ?? '');
  const [references, setReferences] = useState<AgentReferenceItem[]>([]);
  const [config, setConfig] = useState<AgentGenerationConfig>({
    contentType: 'image',
    aspectRatio: '1:1',
    modelId: 'gpt-image-2',
    batchCount: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddReference = (ref: AgentReferenceItem) => {
    setReferences((prev) => [...prev, ref]);
  };

  const handleRemoveReference = (id: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const activeSubscriptionRef = useRef<{ threadId: string; messageId: string; unsubscribe: () => void } | null>(null);

  const subscribeToStream = useCallback((tid: string, mid: string) => {
    if (!tid || !mid) return;
    if (
      activeSubscriptionRef.current &&
      activeSubscriptionRef.current.threadId === tid &&
      activeSubscriptionRef.current.messageId === mid
    ) {
      return;
    }

    if (activeSubscriptionRef.current) {
      activeSubscriptionRef.current.unsubscribe();
      activeSubscriptionRef.current = null;
    }

    const unsubscribe = sdk.chat.subscribe(tid, mid, (event) => {
      if (event.type === 'token') {
        setLocalMessages((prev) => {
          const currentList = prev[tid] || prev['pending-thread'] || [];
          const updated = currentList.map((m) => {
            if (m.id === mid) {
              return { ...m, text: (m.text || '') + (event.token || ''), status: 'streaming' as const };
            }
            return m;
          });
          return { ...prev, [tid]: updated };
        });
      } else if (event.type === 'job_dispatched') {
        setLocalMessages((prev) => {
          const currentList = prev[tid] || prev['pending-thread'] || [];
          const updated = currentList.map((m) => {
            if (m.id === mid) {
              return { ...m, jobId: event.jobId, toolId: event.toolId };
            }
            return m;
          });
          return { ...prev, [tid]: updated };
        });
      } else if (event.type === 'message_done') {
        setLocalMessages((prev) => {
          const currentList = prev[tid] || prev['pending-thread'] || [];
          const updated = currentList.map((m) => {
            if (m.id === mid) {
              return { ...m, status: 'completed' as const };
            }
            return m;
          });
          return { ...prev, [tid]: updated };
        });
        if (activeSubscriptionRef.current?.messageId === mid) {
          activeSubscriptionRef.current = null;
        }
        queryClient.invalidateQueries({
          queryKey: ['user', userId, 'workspace', activeWorkspaceId, 'chat-thread', tid],
        });
        queryClient.invalidateQueries({
          queryKey: ['user', userId, 'workspace', activeWorkspaceId, 'chat-threads'],
        });
      } else if (event.type === 'message_failed') {
        setLocalMessages((prev) => {
          const currentList = prev[tid] || prev['pending-thread'] || [];
          const rawError =
            event.error ||
            (event.data as { reason?: string })?.reason ||
            (typeof event.data === 'string' ? event.data : undefined);
          const errorMsg = formatAgentErrorMessage(rawError, locale);
          const updated = currentList.map((m) => {
            if (m.id === mid) {
              return { ...m, status: 'failed' as const, text: errorMsg };
            }
            return m;
          });
          return { ...prev, [tid]: updated };
        });
        if (activeSubscriptionRef.current?.messageId === mid) {
          activeSubscriptionRef.current = null;
        }
      } else if (event.type === 'message_cancelled') {
        setLocalMessages((prev) => {
          const currentList = prev[tid] || prev['pending-thread'] || [];
          const updated = currentList.map((m) => {
            if (m.id === mid) {
              return { ...m, status: 'cancelled' as const };
            }
            return m;
          });
          return { ...prev, [tid]: updated };
        });
        if (activeSubscriptionRef.current?.messageId === mid) {
          activeSubscriptionRef.current = null;
        }
      }
    });

    activeSubscriptionRef.current = { threadId: tid, messageId: mid, unsubscribe };
  }, [locale, queryClient, userId, activeWorkspaceId]);

  useEffect(() => {
    return () => {
      if (activeSubscriptionRef.current) {
        activeSubscriptionRef.current.unsubscribe();
        activeSubscriptionRef.current = null;
      }
    };
  }, []);

  // Centralized stream listener: detects any in-flight streaming assistant message (F5 refresh or newly mounted)
  useEffect(() => {
    if (!activeThreadId) return;
    const streamingMsg = messages.find(
      (m) =>
        m.sender === 'assistant' &&
        (m.status === 'streaming' || (m as unknown as { status: string }).status === 'pending')
    );
    if (
      streamingMsg &&
      (!activeSubscriptionRef.current ||
        activeSubscriptionRef.current.threadId !== activeThreadId ||
        activeSubscriptionRef.current.messageId !== streamingMsg.id)
    ) {
      subscribeToStream(activeThreadId, streamingMsg.id);
    }
  }, [messages, activeThreadId, subscribeToStream]);

  // 3. Send message mutation via sdk.chat.sendMessage
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      threadId,
      content,
      expectedCost,
    }: {
      threadId: string | null;
      content: string;
      expectedCost?: number;
    }) => {
      return sdk.chat.sendMessage(threadId, content, {
        model: config.modelId,
        aspectRatio: config.aspectRatio,
        numOutputs: config.batchCount,
        expectedCost,
      });
    },
    onMutate: (variables) => {
      const userMsg: AgentChatMessageItem = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prompt: variables.content,
      };
      const keyForLocal = variables.threadId || activeThreadId || 'pending-thread';
      setLocalMessages((prev) => ({
        ...prev,
        [keyForLocal]: [...(prev[keyForLocal] || []), userMsg],
      }));
    },
    onSuccess: (res, variables) => {
      const { threadId, assistantMessageId } = res;
      const tid = threadId || activeThreadId || 'pending-thread';

      if (threadId && threadId !== activeThreadId) {
        setCreatedThreadId(threadId);
        queryClient.setQueryData(
          ['user', userId, 'workspace', activeWorkspaceId, 'chat-thread', threadId],
          (old: unknown) => {
            const existing = (old as { messages?: Message[] })?.messages || [];
            return {
              id: threadId,
              title: variables.content.slice(0, 30),
              messages: [
                ...existing,
                {
                  id: `user-${Date.now()}`,
                  role: 'user',
                  content: variables.content,
                  createdAt: Date.now(),
                },
                {
                  id: assistantMessageId,
                  role: 'assistant',
                  content: '',
                  status: 'streaming',
                  createdAt: Date.now(),
                },
              ],
            };
          }
        );
        queryClient.invalidateQueries({
          queryKey: ['user', userId, 'workspace', activeWorkspaceId, 'chat-threads'],
        });
        router.replace(`/app/agent/${threadId}`);
      }

      // Clear searchParams from browser URL if present
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      const assistantItem: AgentChatMessageItem = {
        id: assistantMessageId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '',
        status: 'streaming',
        contentType: config.contentType,
        aspectRatio: config.aspectRatio,
        modelUsed: config.modelId,
        seed: Math.floor(Math.random() * 900000000) + 100000000,
        generationDurationSec: 2.8,
        creditsUsed: (config.batchCount || 1) * 5,
        isFavorite: false,
        prompt: variables?.content,
      };

      setLocalMessages((prev) => {
        const pending = prev['pending-thread'] || [];
        const existing = prev[tid] || [];
        const combined = [...existing, ...pending.filter((p) => !existing.some((e) => e.id === p.id)), assistantItem];
        return {
          ...prev,
          [tid]: combined,
        };
      });

      subscribeToStream(tid, assistantMessageId);
    },
    onError: (err: unknown, variables) => {
      const rawError = err instanceof Error ? err.message : 'Failed to send message';
      const errorMsg = formatAgentErrorMessage(rawError, locale);
      const keyForLocal = activeThreadId || 'pending-thread';

      if (variables?.content) {
        setPrompt(variables.content);
      }

      const assistantErrorItem: AgentChatMessageItem = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: errorMsg,
        status: 'failed',
        prompt: variables?.content,
      };

      setLocalMessages((prev) => {
        const currentList = prev[keyForLocal] || [];
        const filtered = currentList.filter((m) => m.status !== 'streaming');
        return {
          ...prev,
          [keyForLocal]: [...filtered, assistantErrorItem],
        };
      });
    },
  });

  // P08 Requirement 1: initialPrompt is displayed EXCLUSIVELY as a draft in the
  // prompt input (seeded via the lazy useState initializer above). Auto-send on
  // login, refresh, hydration, or strict mode is completely eradicated.
  //
  // The search query is intentionally NOT stripped from the URL here: doing so
  // mutates the route that the Agent page derives `viewMode` from, which would
  // unmount this view and discard the seeded draft. The query is cleared
  // naturally when a thread is created (see `router.replace` on submit).

  const buildError = sendMessageMutation.error;
  const buildReason = buildError instanceof PlatformApiError ? buildError.reason : undefined;
  // Degraded when the finance/quota service is unavailable (context reports
  // `degraded`), or when a send attempt itself was rejected as degraded.
  const isDegraded =
    studioContext?.financeDegraded === true ||
    buildReason === 'ERROR_REASON_SERVICE_DEGRADED' ||
    buildReason === 'SERVICE_DEGRADED' ||
    (buildError instanceof PlatformApiError && buildError.status === 503) ||
    (buildError instanceof Error && /SERVICE_DEGRADED|DEGRADED/.test(buildError.message));

  const isSubmitting = sendMessageMutation.isPending;

  const handleSubmit = (expectedCost?: number) => {
    if (!prompt.trim() && references.length === 0) return;

    const newPromptText = prompt.trim();
    setPrompt('');
    setReferences([]);

    const threadIdToSend = isServerThread ? activeThreadId : null;

    sendMessageMutation.mutate({
      threadId: threadIdToSend,
      content: newPromptText,
      expectedCost,
    });
  };

  const threadTitle =
    threadData?.title ||
    (locale === 'fa' ? 'مکالمه جاری ایجنت استودیو' : 'Studio Creative Thread');

  return (
    <div className="agent-chat-view-root">
      {/* Header bar */}
      <header className="chat-thread-header">
        <div className="chat-title-group">
          {onToggleHistory && (
            <button
              type="button"
              className={`history-toggle-btn ${isHistoryOpen ? 'active' : ''}`}
              onClick={onToggleHistory}
              aria-label={locale === 'fa' ? 'تاریخچه گفتگوها' : 'Chat History'}
              title={locale === 'fa' ? 'تاریخچه گفتگوها' : 'Chat History'}
            >
              <Clock03 size={16} strokeWidth={1.5} color="currentColor" />
            </button>
          )}
          <Link
            href="/app/agent"
            className="back-to-empty-btn"
            title={locale === 'fa' ? 'مکالمه جدید' : 'New conversation'}
          >
            {isRtl ? (
              <ArrowRight size={16} strokeWidth={2.2} color="currentColor" />
            ) : (
              <ArrowLeft size={16} strokeWidth={2.2} color="currentColor" />
            )}
            <span>{locale === 'fa' ? 'ایجنت استودیو' : 'Agent Studio'}</span>
          </Link>
          <span className="chat-thread-badge">
            {threadTitle}
          </span>
        </div>

        <div className="chat-header-actions">
          <Link
            href="/app/agent/file-01"
            className="btn-switch-to-single"
            title={locale === 'fa' ? 'نمای تک‌محتوا' : 'Single Content View'}
          >
            <Eye size={15} strokeWidth={2} color="currentColor" />
            <span>{locale === 'fa' ? 'نمای تک‌محتوا' : 'Single View'}</span>
          </Link>
        </div>
      </header>

      {/* Scrollable Conversation Thread */}
      <div className="chat-messages-container">
        <div className="chat-messages-inner">
          {messages.length === 0 && !isSubmitting && !isLoadingThread && (
            <div className="agent-empty-thread-notice">
              <p>
                {locale === 'fa'
                  ? 'مکالمه جدید آماده است. پرامپت یا دستور مد نظرتان را در کادر زیر وارد کنید.'
                  : 'New thread ready. Enter your prompt or creative command below.'}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <AgentChatMessage
              key={msg.id}
              message={msg}
              onRemix={(p) => setPrompt(p)}
              locale={locale}
              isRtl={isRtl}
            />
          ))}

          {isSubmitting && (
            <div className="agent-chat-row assistant-row generating">
              <div className="generating-indicator-card">
                <RefreshCw
                  size={18}
                  strokeWidth={2.2}
                  className="spin-animation"
                  color="var(--lemmo-surface-brand-background, #d1fe17)"
                />
                <span>
                  {locale === 'fa'
                    ? 'در حال پردازش پرامپت و تولید رسانه از طریق SDK...'
                    : 'Synthesizing creative output via neural pipeline...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Docked Bottom Floating Prompt Bar */}
      <AgentInputBar
        prompt={prompt}
        onChangePrompt={setPrompt}
        references={references}
        onAddReference={handleAddReference}
        onRemoveReference={handleRemoveReference}
        config={config}
        onChangeConfig={setConfig}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDegraded={isDegraded}
        locale={locale}
        isRtl={isRtl}
        placeholder={
          locale === 'fa'
            ? 'تغییرات مورد نظر یا پرامپت جدید را ارسال کنید...'
            : 'Iterate on this result or send a follow-up prompt...'
        }
      />
    </div>
  );
}
