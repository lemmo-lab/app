'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, RefreshCw } from 'synthline/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk, Message } from '@/sdk';
import {
  AgentChatMessageItem,
  AgentGenerationConfig,
  AgentReferenceItem,
  AgentAspectRatio,
} from '../types';
import { AgentChatMessage } from './AgentChatMessage';
import { AgentInputBar } from './AgentInputBar';

interface AgentChatViewProps {
  currentId?: string;
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
  const mediaUrl =
    msg.attachments?.[0]?.url ||
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
  const aspect =
    (msg.attachments?.[0]?.aspectRatio as AgentAspectRatio) ||
    config?.aspectRatio ||
    '3:4';

  return {
    id: msg.id,
    sender: 'assistant',
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    resultMediaUrl: mediaUrl,
    contentType: config?.contentType || 'image',
    aspectRatio: aspect,
    modelUsed: config?.modelId === 'flux-1-dev' ? 'FLUX.1 [dev]' : 'Lemmo Realism v2',
    seed: Math.floor(Math.random() * 900000000) + 100000000,
    generationDurationSec: 2.8,
    creditsUsed: (config?.batchCount || 1) * 5,
    isFavorite: false,
  };
}

export function AgentChatView({
  currentId,
  locale,
  isRtl,
}: AgentChatViewProps) {
  const queryClient = useQueryClient();

  // 1. Fetch available chat threads to identify active thread ID
  const { data: threads = [] } = useQuery({
    queryKey: ['chat-threads'],
    queryFn: () => sdk.chat.getThreads(),
  });

  const activeThreadId = currentId || threads[0]?.id || 'thread-001';

  // 2. Fetch messages for active thread from SDK
  const { data: threadData } = useQuery({
    queryKey: ['chat-thread', activeThreadId],
    queryFn: () => sdk.chat.getThread(activeThreadId),
    enabled: Boolean(activeThreadId),
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
    aspectRatio: '3:4',
    modelId: 'flux-1-dev',
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

  // 3. Send message mutation via sdk.chat.sendMessage
  const sendMessageMutation = useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string | null; content: string }) => {
      return sdk.chat.sendMessage(threadId, content);
    },
    onSuccess: (assistantMsg) => {
      const assistantItem = mapSdkMessageToAgentMessage(assistantMsg, config);
      setLocalMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), assistantItem],
      }));
      queryClient.invalidateQueries({ queryKey: ['chat-thread', activeThreadId] });
    },
  });

  const isSubmitting = sendMessageMutation.isPending;

  const handleSubmit = () => {
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
