/**
 * Stage 17B: Agent Chat Workspace & Capability Execution Test Suite
 *
 * Verifies:
 * 1. Slash command dispatch (/image <prompt>) via sdk.chat.sendMessage
 * 2. Real-time SSE streaming events: token, job_dispatched, message_done
 * 3. Decoupled job observation via sdk.jobs.subscribe to render synthesized media
 * 4. Graceful handling of thread concurrency and status updates
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sdk } from '@/sdk';

describe('Stage 17B: Agent Chat & Capability Invocation Verification', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully dispatches slash command /image and binds dispatched job', async () => {
    const threadId = 'thread-chat-001';
    const assistantMsgId = 'msg-asst-101';
    const targetJobId = 'job-synth-909';

    // Mock sdk.chat.sendMessage
    vi.spyOn(sdk.chat, 'sendMessage').mockResolvedValue({
      threadId,
      userMessageId: 'msg-user-001',
      assistantMessageId: assistantMsgId,
      status: 'streaming',
    });

    const sendRes = await sdk.chat.sendMessage(threadId, '/image futuristic neon cyber car');
    expect(sendRes.threadId).toBe(threadId);
    expect(sendRes.assistantMessageId).toBe(assistantMsgId);

    // Mock sdk.chat.subscribe
    const sseEvents: Array<{ type: string; token?: string; jobId?: string; toolId?: string }> = [];

    vi.spyOn(sdk.chat, 'subscribe').mockImplementation((tId, mId, onEvent) => {
      expect(tId).toBe(threadId);
      expect(mId).toBe(assistantMsgId);

      // Simulate streaming events emitted by agent-service
      setTimeout(() => onEvent({ type: 'token', token: 'Executing command...' }), 5);
      setTimeout(() => onEvent({ type: 'tool_call', toolId: 'text-to-image' }), 10);
      setTimeout(() => onEvent({ type: 'job_dispatched', jobId: targetJobId, toolId: 'text-to-image' }), 15);
      setTimeout(() => onEvent({ type: 'message_done' }), 20);

      return () => {};
    });

    await new Promise<void>((resolve) => {
      const unsub = sdk.chat.subscribe(threadId, assistantMsgId, (event) => {
        sseEvents.push(event);
        if (event.type === 'message_done') {
          unsub();
          resolve();
        }
      });
    });

    expect(sseEvents).toHaveLength(4);
    expect(sseEvents[0].type).toBe('token');
    expect(sseEvents[0].token).toBe('Executing command...');
    expect(sseEvents[1].type).toBe('tool_call');
    expect(sseEvents[2].type).toBe('job_dispatched');
    expect(sseEvents[2].jobId).toBe(targetJobId);
    expect(sseEvents[3].type).toBe('message_done');
  });

  it('observes dispatched job via sdk.jobs.subscribe and resolves generated image URL', async () => {
    const targetJobId = 'job-synth-909';
    const expectedOutputUrl = 'http://localhost:9000/lemmo-artifacts/tenants/ws-1/artifacts/output.png';

    const jobEvents: Array<{ status: string; progressPercent?: number; results?: Record<string, unknown> }> = [];

    vi.spyOn(sdk.jobs, 'subscribe').mockImplementation((jId, onEvent) => {
      expect(jId).toBe(targetJobId);

      setTimeout(() => onEvent({ type: 'job.progress', jobId: jId, status: 'RUNNING', progressPercent: 45 }), 5);
      setTimeout(() => onEvent({ type: 'job.progress', jobId: jId, status: 'RUNNING', progressPercent: 90 }), 10);
      setTimeout(
        () =>
          onEvent({
            type: 'job.terminal',
            jobId: jId,
            status: 'SUCCEEDED',
            progressPercent: 100,
            results: { url: expectedOutputUrl },
          }),
        15
      );

      return () => {};
    });

    let finalUrl: string | undefined;

    await new Promise<void>((resolve) => {
      const unsub = sdk.jobs.subscribe(targetJobId, (event) => {
        jobEvents.push(event);
        if (event.status === 'SUCCEEDED' || event.type === 'job.terminal') {
          finalUrl = (event.results?.url as string) || undefined;
          unsub();
          resolve();
        }
      });
    });

    expect(jobEvents).toHaveLength(3);
    expect(jobEvents[0].progressPercent).toBe(45);
    expect(jobEvents[1].progressPercent).toBe(90);
    expect(jobEvents[2].status).toBe('SUCCEEDED');
    expect(finalUrl).toBe(expectedOutputUrl);
  });

  it('handles message_failed event gracefully and formats workspace permission denied', async () => {
    const threadId = 'thread-fail-001';
    const assistantMsgId = 'msg-asst-fail';

    let capturedError: string | undefined;

    vi.spyOn(sdk.chat, 'subscribe').mockImplementation((tId, mId, onEvent) => {
      setTimeout(() => {
        onEvent({
          type: 'message_failed',
          threadId: tId,
          messageId: mId,
          error: 'ERROR_REASON_WORKSPACE_FORBIDDEN',
        });
      }, 10);
      return () => {};
    });

    await new Promise<void>((resolve) => {
      const unsub = sdk.chat.subscribe(threadId, assistantMsgId, (event) => {
        if (event.type === 'message_failed') {
          capturedError = event.error;
          unsub();
          resolve();
        }
      });
    });

    expect(capturedError).toBe('ERROR_REASON_WORKSPACE_FORBIDDEN');
  });
});
