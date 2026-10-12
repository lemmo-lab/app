'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, RefreshCw, Clock03 } from 'synthline/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk, Message } from '@/sdk';
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
  const queryClient = useQueryClient();
  const studioContext = useOptionalStudioContext();
  const activeWorkspaceId = studioContext?.activeWorkspace?.id || '';
  const studioState = studioContext?.state || 'loading';
  const isContextReady = studioState === 'ready' && Boolean(activeWorkspaceId);

  // 1. Fetch available chat threads to identify active thread ID (SEC-23: workspace-scoped)
  const { data: threads = [] } = useQuery({
    queryKey: ['workspace', activeWorkspaceId, 'chat-threads'],
    queryFn: () => sdk.chat.getThreads(),
    enabled: isContextReady,
  });

  const activeThreadId = currentId || threads[0]?.id || '';

  // 2. Fetch messages for active thread from SDK (SEC-23: workspace-scoped)
  const { data: threadData } = useQuery({
    queryKey: ['workspace', activeWorkspaceId, 'chat-thread', activeThreadId],
    queryFn: () => sdk.chat.getThread(activeThreadId),
    enabled: isContextReady && Boolean(activeThreadId),
  });

  // Local session messages per thread
  const [localMessages, setLocalMessages] = useState<Record<string, AgentChatMessageItem[]>>({});
  const sessionMessages = useMemo(() => localMessages[activeThreadId] || [], [localMessages, activeThreadId]);

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

  const [prompt, setPrompt] = useState('');
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

  const [activeSubscription, setActiveSubscription] = useState<(() => void) | null>(null);

  // Cleanup active SSE subscription on unmount
  useEffect(() => {
    return () => {
      if (activeSubscription) {
        activeSubscription();
      }
    };
  }, [activeSubscription]);

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
    onSuccess: (res) => {
      const { threadId, assistantMessageId } = res;
      const tid = threadId || activeThreadId;

      // Add placeholder assistant message in local state
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
      };

      setLocalMessages((prev) => ({
        ...prev,
        [tid]: [...(prev[tid] || []), assistantItem],
      }));

      // Connect to SSE stream
      const unsubscribe = sdk.chat.subscribe(tid, assistantMessageId, (event) => {
        if (event.type === 'token') {
          setLocalMessages((prev) => {
            const currentList = prev[tid] || [];
            const updated = currentList.map((m) => {
              if (m.id === assistantMessageId) {
                return { ...m, text: (m.text || '') + (event.token || ''), status: 'streaming' as const };
              }
              return m;
            });
            return { ...prev, [tid]: updated };
          });
        } else if (event.type === 'job_dispatched') {
          setLocalMessages((prev) => {
            const currentList = prev[tid] || [];
            const updated = currentList.map((m) => {
              if (m.id === assistantMessageId) {
                return { ...m, jobId: event.jobId, toolId: event.toolId };
              }
              return m;
            });
            return { ...prev, [tid]: updated };
          });
        } else if (event.type === 'message_done') {
          setLocalMessages((prev) => {
            const currentList = prev[tid] || [];
            const updated = currentList.map((m) => {
              if (m.id === assistantMessageId) {
                return { ...m, status: 'completed' as const };
              }
              return m;
            });
            return { ...prev, [tid]: updated };
          });
          queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId, 'chat-thread', tid] });
          queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId, 'chat-threads'] });
        } else if (event.type === 'message_failed') {
          setLocalMessages((prev) => {
            const currentList = prev[tid] || [];
            const rawError = event.error || (event.data as { reason?: string })?.reason || (typeof event.data === 'string' ? event.data : undefined);
            const errorMsg = formatAgentErrorMessage(rawError, locale);
            const updated = currentList.map((m) => {
              if (m.id === assistantMessageId) {
                return { ...m, status: 'failed' as const, text: errorMsg };
              }
              return m;
            });
            return { ...prev, [tid]: updated };
          });
        } else if (event.type === 'message_cancelled') {
          setLocalMessages((prev) => {
            const currentList = prev[tid] || [];
            const updated = currentList.map((m) => {
              if (m.id === assistantMessageId) {
                return { ...m, status: 'cancelled' as const };
              }
              return m;
            });
            return { ...prev, [tid]: updated };
          });
        }
      });

      setActiveSubscription(() => unsubscribe);
    },
    onError: (err: unknown) => {
      const rawError = err instanceof Error ? err.message : 'Failed to send message';
      const errorMsg = formatAgentErrorMessage(rawError, locale);
      setLocalMessages((prev) => {
        const currentList = prev[activeThreadId] || [];
        const updated = currentList.map((m) => {
          if (m.status === 'streaming') {
            return { ...m, status: 'failed' as const, text: errorMsg };
          }
          return m;
        });
        return { ...prev, [activeThreadId]: updated };
      });
    },
  });

  const hasAutoSubmittedRef = useRef(false);

  useEffect(() => {
    if (initialPrompt && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      const cleanPrompt = initialPrompt.trim();
      if (!cleanPrompt) return;

      const userMsg: AgentChatMessageItem = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prompt: cleanPrompt,
      };

      const timer = setTimeout(() => {
        setLocalMessages((prev) => ({
          ...prev,
          [activeThreadId]: [...(prev[activeThreadId] || []), userMsg],
        }));

        sendMessageMutation.mutate({
          threadId: activeThreadId,
          content: cleanPrompt,
        });

        // Remove searchParams from browser URL AFTER dispatching to avoid canceling the initial render
        if (typeof window !== 'undefined' && window.location.search) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [initialPrompt, activeThreadId, sendMessageMutation]);

  const isSubmitting = sendMessageMutation.isPending;

  const handleSubmit = (expectedCost?: number) => {
    if (!prompt.trim() && references.length === 0) return;

    const newPromptText = prompt.trim();
    const currentRefs = [...references];

    // Optimistically add user message to conversation list
    const userMsg: AgentChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prompt: newPromptText,
      references: currentRefs,
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), userMsg],
    }));
    setPrompt('');
    setReferences([]);

    // Dispatch via SDK chat client
    sendMessageMutation.mutate({
      threadId: activeThreadId,
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
          {messages.length === 0 && !isSubmitting && (
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
