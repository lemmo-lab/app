'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, RefreshCw } from 'synthline/react';
import {
  AgentChatMessageItem,
  AgentGenerationConfig,
  AgentReferenceItem,
} from '../types';
import { AgentChatMessage } from './AgentChatMessage';
import { AgentInputBar } from './AgentInputBar';
import { MOCK_CONVERSATIONS } from '../data/mockAgentData';

interface AgentChatViewProps {
  currentId?: string;
  locale: string;
  isRtl: boolean;
}

export function AgentChatView({
  currentId = 'chat-01',
  locale,
  isRtl,
}: AgentChatViewProps) {
  const initialConv = MOCK_CONVERSATIONS[currentId] || MOCK_CONVERSATIONS['chat-01'];
  const [messages, setMessages] = useState<AgentChatMessageItem[]>(initialConv.messages);
  const [prompt, setPrompt] = useState('');
  const [references, setReferences] = useState<AgentReferenceItem[]>([]);
  const [config, setConfig] = useState<AgentGenerationConfig>({
    contentType: 'image',
    aspectRatio: '3:4',
    modelId: 'flux-1-dev',
    batchCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = () => {
    if (!prompt.trim() && references.length === 0) return;

    const newPromptText = prompt.trim();
    const currentRefs = [...references];

    // Add user message
    const userMsg: AgentChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prompt: newPromptText,
      references: currentRefs,
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setReferences([]);
    setIsSubmitting(true);

    // Simulate generation output
    setTimeout(() => {
      const assistantMsg: AgentChatMessageItem = {
        id: `msg-res-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resultMediaUrl:
          currentRefs[0]?.url ||
          '/images/feed/an-anime-style-girl-with-translucent-moth-wings-and-fluffy.webp',
        contentType: config.contentType,
        aspectRatio: config.aspectRatio,
        modelUsed: config.modelId === 'flux-1-dev' ? 'FLUX.1 [dev]' : 'Lemmo Realism v2',
        seed: Math.floor(Math.random() * 900000000) + 100000000,
        generationDurationSec: 2.8,
        creditsUsed: config.batchCount * 5,
        isFavorite: false,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsSubmitting(false);
    }, 1200);
  };

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
            {initialConv.title}
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
                    ? 'در حال پردازش پرامپت و تولید رسانه...'
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
