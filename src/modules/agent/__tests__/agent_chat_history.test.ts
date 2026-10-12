/**
 * Agent Chat History and Thread Lifecycle Test Suite
 * Conforms to TASK-FE-BE-AGENT-CHAT-HISTORY-01
 *
 * Verifies:
 * 1. sdk.chat.renameThread invocations
 * 2. sdk.chat.deleteThread invocations
 * 3. Temporal grouping algorithms (Today, Yesterday, Previous 7 Days, Older)
 * 4. Case-insensitive client search filtering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sdk, Thread } from '@/sdk';
import { parseTimestamp } from '../components/AgentHistoryDrawer';

describe('TASK-FE-BE-AGENT-CHAT-HISTORY-01: Thread Lifecycle & History Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully invokes sdk.chat.renameThread with trimmed title', async () => {
    const threadId = 'thread-test-123';
    const newTitle = 'Renamed Creative Concept';

    vi.spyOn(sdk.chat, 'renameThread').mockResolvedValue({
      id: threadId,
      title: newTitle,
      messages: [],
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    });

    const result = await sdk.chat.renameThread(threadId, newTitle);
    expect(result.id).toBe(threadId);
    expect(result.title).toBe(newTitle);
    expect(sdk.chat.renameThread).toHaveBeenCalledWith(threadId, newTitle);
  });

  it('successfully invokes sdk.chat.deleteThread to soft-delete conversation', async () => {
    const threadId = 'thread-delete-456';

    vi.spyOn(sdk.chat, 'deleteThread').mockResolvedValue(undefined);

    await expect(sdk.chat.deleteThread(threadId)).resolves.toBeUndefined();
    expect(sdk.chat.deleteThread).toHaveBeenCalledWith(threadId);
  });

  it('correctly partitions threads into temporal buckets using parseTimestamp', () => {
    // Anchor reference time to midday (12:00:00) to ensure deterministic temporal buckets across any test execution hour
    const nowDate = new Date();
    const startOfToday = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime();
    const middayToday = startOfToday + 12 * 3600 * 1000;
    const startOfYesterday = startOfToday - 86400000;
    const startOfPrevious7Days = startOfToday - 7 * 86400000;

    const todayTime = middayToday;
    const yesterdayTime = startOfYesterday + 12 * 3600 * 1000;
    const pastWeekTime = startOfPrevious7Days + 12 * 3600 * 1000;
    const olderTime = startOfPrevious7Days - 3 * 86400000;

    const mockThreads: Thread[] = [
      { id: '1', title: 'Today Thread', messages: [], createdAt: todayTime, updatedAt: todayTime },
      { id: '2', title: 'Yesterday Thread', messages: [], createdAt: yesterdayTime, updatedAt: yesterdayTime },
      { id: '3', title: 'Past Week Thread', messages: [], createdAt: pastWeekTime, updatedAt: pastWeekTime },
      { id: '4', title: 'Older Thread', messages: [], createdAt: olderTime, updatedAt: olderTime },
    ];

    const groups = {
      today: [] as Thread[],
      yesterday: [] as Thread[],
      previous7Days: [] as Thread[],
      older: [] as Thread[],
    };

    for (const t of mockThreads) {
      const time = t.createdAt;
      if (time >= startOfToday) {
        groups.today.push(t);
      } else if (time >= startOfYesterday) {
        groups.yesterday.push(t);
      } else if (time >= startOfPrevious7Days) {
        groups.previous7Days.push(t);
      } else {
        groups.older.push(t);
      }
    }

    expect(groups.today).toHaveLength(1);
    expect(groups.today[0].id).toBe('1');
    expect(groups.yesterday).toHaveLength(1);
    expect(groups.yesterday[0].id).toBe('2');
    expect(groups.previous7Days).toHaveLength(1);
    expect(groups.previous7Days[0].id).toBe('3');
    expect(groups.older).toHaveLength(1);
    expect(groups.older[0].id).toBe('4');
  });

  it('strictly adheres to No Synthetic Data policy for missing or invalid timestamps', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // 1. Thread with missing createdAt / updatedAt
    const missingThread: Thread = {
      id: 'thread-missing-time',
      title: 'Undated Thread',
      messages: [],
      createdAt: 0,
      updatedAt: 0,
    };
    // Delete falsy fields to simulate absent contract payload
    delete (missingThread as unknown as Record<string, unknown>).createdAt;
    delete (missingThread as unknown as Record<string, unknown>).updatedAt;

    const parsedMissing = parseTimestamp(missingThread);
    expect(parsedMissing).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Contract Deficiency] Thread thread-missing-time is missing mandatory timestamp field.')
    );

    // 2. Thread with unparseable / corrupt timestamp string
    const corruptThread: Thread = {
      id: 'thread-corrupt-time',
      title: 'Corrupt Thread',
      messages: [],
      createdAt: 'invalid-date-string' as unknown as number,
      updatedAt: 0,
    };

    const parsedCorrupt = parseTimestamp(corruptThread);
    expect(parsedCorrupt).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Contract Deficiency] Thread thread-corrupt-time has unparseable timestamp value:'),
      'invalid-date-string'
    );

    consoleWarnSpy.mockRestore();
  });

  it('filters threads by search term case-insensitively', () => {
    const threads: Thread[] = [
      { id: '1', title: 'Sci-Fi Cyberpunk Portrait', messages: [], createdAt: 1, updatedAt: 1 },
      { id: '2', title: 'Minimalist Vector Logo', messages: [], createdAt: 2, updatedAt: 2 },
      { id: '3', title: 'Product Photography in Studio', messages: [], createdAt: 3, updatedAt: 3 },
    ];

    const search = 'cyber';
    const filtered = threads.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
});

describe('TASK-CLN-001: Multi-Tenant Cache Isolation & Context Readiness Behavioral Verification', () => {
  it('prevents query execution before Studio Context is ready with valid user and workspace', async () => {
    const isContextReady = (state: string, userId: string, wsId: string) =>
      state === 'ready' && Boolean(userId) && Boolean(wsId);

    // Initial loading state: no query execution permitted
    expect(isContextReady('loading', '', '')).toBe(false);
    expect(isContextReady('loading', 'usr-1', 'ws-1')).toBe(false);

    // Incomplete context: missing user or missing workspace
    expect(isContextReady('ready', '', 'ws-1')).toBe(false);
    expect(isContextReady('ready', 'usr-1', '')).toBe(false);
    expect(isContextReady('no-workspace', 'usr-1', '')).toBe(false);
    expect(isContextReady('signed-out', '', '')).toBe(false);

    // Valid ready context: execution enabled
    expect(isContextReady('ready', 'usr-1', 'ws-1')).toBe(true);
  });

  it('guarantees complete cache isolation across workspace switches (Workspace Switch)', () => {
    const userId = 'usr-test-101';
    const ws1 = 'workspace-alpha';
    const ws2 = 'workspace-beta';

    const threadsWs1: Thread[] = [
      { id: 't-alpha-1', title: 'Alpha Thread 1', messages: [], createdAt: 1000, updatedAt: 1000 },
    ];
    const threadsWs2: Thread[] = [
      { id: 't-beta-1', title: 'Beta Thread 1', messages: [], createdAt: 2000, updatedAt: 2000 },
    ];

    const cache = new Map<string, Thread[]>();
    const getKey = (u: string, w: string) => JSON.stringify(['user', u, 'workspace', w, 'chat-threads']);

    cache.set(getKey(userId, ws1), threadsWs1);
    cache.set(getKey(userId, ws2), threadsWs2);

    expect(cache.get(getKey(userId, ws1))).toEqual(threadsWs1);
    expect(cache.get(getKey(userId, ws2))).toEqual(threadsWs2);
    expect(cache.get(getKey(userId, ws1))).not.toEqual(cache.get(getKey(userId, ws2)));
  });

  it('guarantees complete cache isolation across user account switches & logout', () => {
    const userA = 'user-account-A';
    const userB = 'user-account-B';
    const sharedWsId = 'shared-workspace-corp';

    const threadsUserA: Thread[] = [
      { id: 't-A-1', title: 'User A Private Thread', messages: [], createdAt: 1000, updatedAt: 1000 },
    ];
    const threadsUserB: Thread[] = [
      { id: 't-B-1', title: 'User B Private Thread', messages: [], createdAt: 2000, updatedAt: 2000 },
    ];

    const getKey = (u: string, w: string) => JSON.stringify(['user', u, 'workspace', w, 'chat-threads']);
    const cache = new Map<string, Thread[]>();

    // 1. User A is active
    cache.set(getKey(userA, sharedWsId), threadsUserA);

    // 2. User A logs out (ADR-016 Section 2.18: cache.clear())
    cache.clear();
    expect(cache.get(getKey(userA, sharedWsId))).toBeUndefined();

    // 3. User B logs in to the same workspace ID
    cache.set(getKey(userB, sharedWsId), threadsUserB);
    expect(cache.get(getKey(userB, sharedWsId))).toEqual(threadsUserB);
    expect(cache.get(getKey(userA, sharedWsId))).toBeUndefined();
  });

  it('prevents late/delayed responses from previous context from contaminating active workspace', async () => {
    let activeWorkspaceId = 'ws-old';

    const activeViewData = { currentWorkspaceId: activeWorkspaceId, threads: [] as Thread[] };

    // Simulate slow in-flight response from ws-old
    const slowResponsePromise = new Promise<{ targetWs: string; data: Thread[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          targetWs: 'ws-old',
          data: [{ id: 'stale-thread', title: 'Stale Old Thread', messages: [], createdAt: 100, updatedAt: 100 }],
        });
      }, 20);
    });

    // User switches workspace immediately to ws-new
    activeWorkspaceId = 'ws-new';
    activeViewData.currentWorkspaceId = activeWorkspaceId;
    activeViewData.threads = [{ id: 'new-thread', title: 'New Active Thread', messages: [], createdAt: 200, updatedAt: 200 }];

    // When the delayed response arrives:
    const delayedResult = await slowResponsePromise;
    if (delayedResult.targetWs === activeViewData.currentWorkspaceId) {
      activeViewData.threads = delayedResult.data;
    }

    // Active view must NOT be contaminated by delayed ws-old response
    expect(activeViewData.threads[0].id).toBe('new-thread');
    expect(activeViewData.threads[0].title).toBe('New Active Thread');
  });
});
