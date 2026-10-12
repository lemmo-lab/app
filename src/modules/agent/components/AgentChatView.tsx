'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, RefreshCw } from 'synthline/react';
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
}

/**
 * Maps SDK Message domain model to AgentChatMessageItem UI presentation model.
 */
function mapSdkMessageToAgentMessage(
  msg: Message,
  config?: AgentGenerationConfig
): AgentChatMessageItem {
  if (msg.role === 'user') {
    const refs: AgentReferenceItem[] = (msg.attachments || []).map((att) => ({
      id: att.id,
      url: att.url,
      name: att.name,
    }));
    return {
      id: msg.id,
      sender: 'user',
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prompt: msg.content,
      references: refs.length > 0 ? refs : undefined,
    };
  }

  // Assistant response
  let mediaUrl = msg.attachments?.[0]?.url;
  if (mediaUrl && mediaUrl.includes('minio:9000')) {
    mediaUrl = mediaUrl.replace('minio:9000', 'localhost:9000');
  }
  const aspect =
    (msg.attachments?.[0]?.aspectRatio as AgentAspectRatio) ||
    config?.aspectRatio ||
    '3:4';
  const firstJob = msg.jobs?.[0];

  return {
    id: msg.id,
    sender: 'assistant',
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    jobId: firstJob?.jobId || msg.jobId,
    toolId: firstJob?.toolId,
  };
}

export function AgentChatView({
  currentId,
  initialPrompt,
  locale,
  isRtl,
}: AgentChatViewProps) {
  const queryClient = useQueryClient();
  const studioContext = useOptionalStudioContext();
  const activeWorkspaceId = studioContext?.activeWorkspace?.id || '';

  // 1. Fetch available chat threads to identify active thread ID (SEC-23: workspace-scoped)
  const { data: threads = [] } = useQuery({
    queryKey: ['workspace', activeWorkspaceId, 'chat-threads'],
    queryFn: () => sdk.chat.getThreads(),
    enabled: Boolean(activeWorkspaceId),
  });

  const activeThreadId = currentId || threads[0]?.id || 'thread-001';

  // 2. Fetch messages for active thread from SDK (SEC-23: workspace-scoped)
  const { data: threadData } = useQuery({
    queryKey: ['workspace', activeWorkspaceId, 'chat-thread', activeThreadId],
    queryFn: () => sdk.chat.getThread(activeThreadId),
    enabled: Boolean(activeThreadId && activeWorkspaceId),
  });

  // Local session messages per thread
  const [localMessages, setLocalMessages] = useState<Record<string, AgentChatMessageItem[]>>({});
  const sessionMessages = useMemo(() => localMessages[activeThreadId] || [], [localMessages, activeThreadId]);

  // Messages loaded from SDK query
  const initialMessages = useMemo(() => {
    if (!threadData?.messages || threadData.messages.length === 0) return [];
    return threadData.messages.map((m) => mapSdkMessageToAgentMessage(m));
  }, [threadData]);

  // Combined messages sequence (server history + session messages)
  const messages: AgentChatMessageItem[] = useMemo(() => {
    return [...initialMessages, ...sessionMessages];
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

      // Remove searchParams from browser URL to prevent re-submission on refresh (F5)
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      const userMsg: AgentChatMessageItem = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prompt: cleanPrompt,
      };

      queueMicrotask(() => {
        setLocalMessages((prev) => ({
          ...prev,
          [activeThreadId]: [...(prev[activeThreadId] || []), userMsg],
        }));

        sendMessageMutation.mutate({
          threadId: activeThreadId,
          content: cleanPrompt,
        });
      });
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
