/**
 * Stage 12B Frontend Live Adapter & Transport Verification Test Suite
 * Conforms to TASK_FRONTEND_STAGE12B Section 3 Quality & Acceptance Gates.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  customFetch,
  setTransportContext,
  incrementSessionGeneration,
  getSessionGenerationId,
  getActiveWorkspaceId,
  onStepUpAuthRequired,
  onSignedOut,
  scheduleProactiveRefresh,
  cancelProactiveRefresh,
  executeSilentRefresh,
} from '../transport';
import { liveSdkAdapter, closeAllStreams } from '../live-adapter';
import { useUiStore } from '@/stores/uiStore';
import { PlatformApiError } from '../../errors';

describe('Stage 12B: Ingress Transport Hardening & Isolation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cancelProactiveRefresh();
    setTransportContext(null, 0);
  });

  afterEach(() => {
    cancelProactiveRefresh();
    closeAllStreams();
    vi.useRealTimers();
  });

  it('Gate 1: Header Sanitization — strips caller X-Workspace-ID and injects verified context', async () => {
    const verifiedWsId = 'ws-verified-1111';
    setTransportContext(verifiedWsId, 1);

    let capturedHeaders: Headers | null = null;
    global.fetch = vi.fn().mockImplementation((_url, init?: RequestInit) => {
      capturedHeaders = new Headers(init?.headers);
      return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    });

    await customFetch<{ status: string }>('/api/v1/projects', {
      headers: {
        'x-workspace-id': 'malicious-workspace-id',
        'X-WORKSPACE-ID': 'another-spoofed-id',
        'Content-Type': 'application/json',
      },
    });

    expect(capturedHeaders).not.toBeNull();
    // Verify caller's injected IDs were stripped and verified ID was injected
    expect(capturedHeaders!.get('x-workspace-id')).toBe(verifiedWsId);
    expect(capturedHeaders!.get('X-Workspace-ID')).toBe(verifiedWsId);
  });

  it('Gate 2: Context Freezing — preserves snapshot across retries and aborts on session generation change', async () => {
    const initialWsId = 'ws-frozen-2222';
    setTransportContext(initialWsId, 5);

    let attempts = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts === 1) {
        // Change session generation mid-flight to simulate logout / user switch
        incrementSessionGeneration();
        return Promise.reject(new Error('Network glitch'));
      }
      return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
    });

    // In-flight session mismatch should discard and abort cleanly
    await expect(customFetch('/api/v1/projects')).rejects.toThrow(
      /Request discarded: session was terminated or switched during request/
    );
  });

  it('Gate 3: Dynamic Proactive Refresh — calculates 90% lifespan and enforces single-flight locking', async () => {
    vi.useFakeTimers();

    const nowSec = Math.floor(Date.now() / 1000);
    const expiresAt = nowSec + 1000; // 1000 seconds lifetime

    let fetchCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount++;
      return Promise.resolve(
        new Response(
          JSON.stringify({
            status: 'ok',
            expires_in: 1000,
          }),
          { status: 200 }
        )
      );
    });

    scheduleProactiveRefresh(expiresAt);

    // Fast-forward to 899s (before 90% = 900s)
    await vi.advanceTimersByTimeAsync(899 * 1000);
    expect(fetchCount).toBe(0);

    // Fast-forward past 900s (90% threshold)
    await vi.advanceTimersByTimeAsync(2 * 1000);
    expect(fetchCount).toBe(1);

    // Test single-flight lock: multiple concurrent executeSilentRefresh share single in-flight promise
    const [p1, p2, p3] = [executeSilentRefresh(), executeSilentRefresh(), executeSilentRefresh()];
    const results = await Promise.all([p1, p2, p3]);

    expect(results).toEqual([true, true, true]);
    expect(fetchCount).toBe(2); // Only 1 additional network call for all 3 concurrent requests

    vi.useRealTimers();
  });

  it('Gate 4: Step-Up Privileged Auth Modal — intercepts 403, notifies listener, and replays request', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              title: 'Forbidden',
              status: 403,
              reason: 'ERROR_REASON_PRIVILEGED_SESSION_REQUIRED',
              detail: 'Privileged session expired',
            }),
            { status: 403 }
          )
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify({ id: 'proj-new' }), { status: 201 })
      );
    });

    let stepUpTriggered = false;
    const unsubscribe = onStepUpAuthRequired((req) => {
      stepUpTriggered = true;
      // Simulate user entering code and verifying successfully
      req.resolve();
    });

    const res = await customFetch<{ data: { id: string }; status: number }>('/api/v1/projects', {
      method: 'POST',
    });

    expect(stepUpTriggered).toBe(true);
    expect(callCount).toBe(2); // Initial attempt + automatic replay
    expect(res.data.id).toBe('proj-new');

    unsubscribe();
  });

  it('Gate 5: 4-Layer Cache & State Isolation — Zustand store reset on session switch', () => {
    // 1. Mutate store
    useUiStore.getState().setDefaultWorkspace('canvas');
    useUiStore.getState().setLocale('fa');

    expect(useUiStore.getState().defaultWorkspace).toBe('canvas');
    expect(useUiStore.getState().locale).toBe('fa');

    // 2. Simulate session reset
    useUiStore.getState().reset();

    // 3. Verify state cleanly cleared back to defaults
    expect(useUiStore.getState().defaultWorkspace).toBe('agent');
    expect(useUiStore.getState().locale).toBe('en');
  });

  it('Gate 6: Jobs SSE Subscription — terminal event delivery and active close', async () => {
    const eventsReceived: unknown[] = [];

    // Mock EventSource in Node test environment
    class MockEventSource {
      public readyState = 1;
      public listeners: Record<string, ((e: unknown) => void)[]> = {};
      public onmessage: ((e: { data: string }) => void) | null = null;
      public onerror: ((e: unknown) => void) | null = null;

      constructor(public url: string) {
        setTimeout(() => {
          this.emit('progress', {
            data: JSON.stringify({
              id: 'job-test-1',
              status: 'RUNNING',
              progress_percent: 50,
              step: 1,
            }),
          });
        }, 10);

        setTimeout(() => {
          this.emit('job.terminal', {
            data: JSON.stringify({
              id: 'job-test-1',
              status: 'SUCCEEDED',
              completed_at: new Date().toISOString(),
              results: { output: 'success' },
            }),
          });
        }, 30);
      }

      addEventListener(event: string, cb: (e: unknown) => void) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
      }

      emit(event: string, data: unknown) {
        (this.listeners[event] || []).forEach((cb) => cb(data));
      }

      close = vi.fn(() => {
        this.readyState = 2; // CLOSED
      });
    }

    // @ts-expect-error Mocking global EventSource for Node environment
    global.EventSource = MockEventSource;

    const unsubscribe = liveSdkAdapter.jobs.subscribe('job-test-1', (event) => {
      eventsReceived.push(event);
    });

    await new Promise((resolve) => setTimeout(resolve, 80));

    expect(eventsReceived.length).toBe(2);
    expect(eventsReceived[0]).toMatchObject({
      type: 'progress',
      jobId: 'job-test-1',
      status: 'RUNNING',
      progressPercent: 50,
    });
    expect(eventsReceived[1]).toMatchObject({
      type: 'job.terminal',
      jobId: 'job-test-1',
      status: 'SUCCEEDED',
      progressPercent: 100,
    });

    unsubscribe();
  });
});
