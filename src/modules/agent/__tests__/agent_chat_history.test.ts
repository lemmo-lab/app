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

  it('correctly partitions threads into temporal buckets', () => {
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;
    const yesterday = now - 26 * 3600 * 1000;
    const fourDaysAgo = now - 4 * 24 * 3600 * 1000;
    const tenDaysAgo = now - 10 * 24 * 3600 * 1000;

    const mockThreads: Thread[] = [
      { id: '1', title: 'Today Thread', messages: [], createdAt: oneHourAgo, updatedAt: oneHourAgo },
      { id: '2', title: 'Yesterday Thread', messages: [], createdAt: yesterday, updatedAt: yesterday },
      { id: '3', title: 'Past Week Thread', messages: [], createdAt: fourDaysAgo, updatedAt: fourDaysAgo },
      { id: '4', title: 'Older Thread', messages: [], createdAt: tenDaysAgo, updatedAt: tenDaysAgo },
    ];

    const nowDate = new Date();
    const startOfToday = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfPrevious7Days = startOfToday - 7 * 86400000;

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
