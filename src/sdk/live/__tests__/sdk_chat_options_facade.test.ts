/**
 * TASK-INT-003: SDK Chat Options & Facade Verification Test Suite
 *
 * Verifies liveSdkAdapter.chat.sendMessage forwards user options (model, aspectRatio, numOutputs, expectedCost)
 * to the Orval-generated sendChatMessage client and Kong edge gateway.
 * Tests positive option propagation, default handling, null threadId handling, RFC 7807 error parsing,
 * and workspace header context propagation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { liveSdkAdapter } from '../live-adapter';
import { setTransportContext, cancelProactiveRefresh } from '../transport';

describe('TASK-INT-003: SDK Chat Options Facade Suite', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cancelProactiveRefresh();
    setTransportContext('b3e0d5a2-4c1f-4a7e-9b2d-8f6a1c3e5d40', 1);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    cancelProactiveRefresh();
    vi.useRealTimers();
  });

  describe('Positive Paths: chat.sendMessage Option Propagation', () => {
    it('propagates full user options (model, aspectRatio, numOutputs, expectedCost) in POST /api/v1/chat/messages payload', async () => {
      let requestedUrl = '';
      let requestedMethod = '';
      let requestedHeaders: Record<string, string> = {};
      let requestedBody: Record<string, unknown> = {};

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';
        if (init?.headers) {
          requestedHeaders = Object.fromEntries(new Headers(init.headers as HeadersInit).entries());
        }
        if (init?.body) {
          requestedBody = JSON.parse(init.body as string);
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              threadId: 'th-123',
              userMessageId: 'msg-u-1',
              assistantMessageId: 'msg-a-1',
              status: 'streaming',
            }),
            {
              status: 202,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });

      const res = await liveSdkAdapter.chat.sendMessage('th-123', 'A futuristic cyber city', {
        model: 'fal-ai/flux-dev',
        aspectRatio: '16:9',
        numOutputs: 2,
        expectedCost: 20,
      });

      // Verification of URL and Method
      expect(requestedUrl).toContain('/api/v1/chat/messages');
      expect(requestedMethod).toBe('POST');

      // Verification of Header Context (ADR-016)
      expect(requestedHeaders['x-workspace-id']).toBe('b3e0d5a2-4c1f-4a7e-9b2d-8f6a1c3e5d40');

      // Verification of Payload
      expect(requestedBody.threadId).toBe('th-123');
      expect(requestedBody.content).toBe('A futuristic cyber city');
      expect(requestedBody.model).toBe('fal-ai/flux-dev');
      expect(requestedBody.aspectRatio).toBe('16:9');
      expect(requestedBody.numOutputs).toBe(2);
      expect(requestedBody.expectedCost).toBe(20);

      // Verification of SDK Response
      expect(res).toEqual({
        threadId: 'th-123',
        userMessageId: 'msg-u-1',
        assistantMessageId: 'msg-a-1',
        status: 'streaming',
      });
    });

    it('handles default/omitted options cleanly without sending invalid keys', async () => {
      let requestedBody: Record<string, unknown> = {};

      global.fetch = vi.fn().mockImplementation((_url: string | URL | Request, init?: RequestInit) => {
        if (init?.body) {
          requestedBody = JSON.parse(init.body as string);
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              threadId: 'th-default-1',
              userMessageId: 'msg-u-def',
              assistantMessageId: 'msg-a-def',
              status: 'streaming',
            }),
            {
              status: 202,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });

      const res = await liveSdkAdapter.chat.sendMessage('th-default-1', 'Simple inquiry without options');

      expect(requestedBody.threadId).toBe('th-default-1');
      expect(requestedBody.content).toBe('Simple inquiry without options');
      expect(requestedBody.model).toBeUndefined();
      expect(requestedBody.aspectRatio).toBeUndefined();
      expect(requestedBody.numOutputs).toBeUndefined();
      expect(requestedBody.expectedCost).toBeUndefined();

      expect(res.threadId).toBe('th-default-1');
      expect(res.status).toBe('streaming');
    });

    it('translates null threadId to undefined for server-side auto-thread generation', async () => {
      let requestedBody: Record<string, unknown> = {};

      global.fetch = vi.fn().mockImplementation((_url: string | URL | Request, init?: RequestInit) => {
        if (init?.body) {
          requestedBody = JSON.parse(init.body as string);
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              threadId: 'th-auto-generated-888',
              userMessageId: 'msg-u-new',
              assistantMessageId: 'msg-a-new',
              status: 'streaming',
            }),
            {
              status: 202,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });

      const res = await liveSdkAdapter.chat.sendMessage(null, 'Brand new thread initiation', {
        model: 'gpt-image-2',
        aspectRatio: '1:1',
      });

      // threadId was null, converted to undefined so it should not appear as null in JSON body
      expect(requestedBody.threadId).toBeUndefined();
      expect(requestedBody.content).toBe('Brand new thread initiation');
      expect(requestedBody.model).toBe('gpt-image-2');
      expect(requestedBody.aspectRatio).toBe('1:1');

      expect(res.threadId).toBe('th-auto-generated-888');
      expect(res.status).toBe('streaming');
    });
  });

  describe('Negative Paths: RFC 7807 Problem Details Error Propagation', () => {
    it('throws error with detail message on HTTP 400 Bad Request', async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              type: 'https://tools.ietf.org/html/rfc7807',
              title: 'Bad Request',
              status: 400,
              detail: 'Invalid aspect ratio specified: 21:9 is unsupported',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/problem+json' },
            }
          )
        );
      });

      await expect(
        liveSdkAdapter.chat.sendMessage('th-1', 'Prompt', { aspectRatio: '21:9' })
      ).rejects.toThrow('Invalid aspect ratio specified: 21:9 is unsupported');
    });

    it('throws error with title message on HTTP 404 Thread Not Found', async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              title: 'Chat thread not found or inaccessible',
              status: 404,
            }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/problem+json' },
            }
          )
        );
      });

      await expect(
        liveSdkAdapter.chat.sendMessage('th-non-existent', 'Prompt')
      ).rejects.toThrow('Chat thread not found or inaccessible');
    });

    it('throws error with title message on HTTP 409 Conflict (Thread Busy)', async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              title: 'Thread currently busy generating another message',
              status: 409,
            }),
            {
              status: 409,
              headers: { 'Content-Type': 'application/problem+json' },
            }
          )
        );
      });

      await expect(
        liveSdkAdapter.chat.sendMessage('th-busy', 'Prompt')
      ).rejects.toThrow('Thread currently busy generating another message');
    });
  });
});
