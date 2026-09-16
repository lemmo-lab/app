/**
 * Mock SDK Adapter — آداپتور داده‌های مصنوعی
 *
 * شبیه‌سازی تاخیر شبکه (300-800ms) و پیاده‌سازی توابع SdkClient.
 * در M4 شبیه‌ساز کامل Job Simulator با تایمر واقعی اضافه می‌شود.
 */

import type { SdkClient, Job, Message, Thread } from '../types';
import {
  MOCK_ASSETS,
  MOCK_BILLING,
  MOCK_JOBS,
  MOCK_THREADS,
  MOCK_TOOLS,
  MOCK_USER,
} from './mock-data';

/** شبیه‌سازی تاخیر شبکه */
function delay(ms: number = 300): Promise<void> {
  const randomDelay = ms + Math.random() * 500; // 300 تا 800ms
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}

/** تولید ID تصادفی */
function generateId(prefix: string = 'mock'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const mockSdkAdapter: SdkClient = {
  // ================================================================ //
  // TOOLS                                                             //
  // ================================================================ //
  tools: {
    list: async () => {
      await delay(300);
      return [...MOCK_TOOLS];
    },

    execute: async (toolId, inputs) => {
      await delay(400);
      const jobId = generateId('job');

      // ایجاد شغل جدید
      const job: Job = {
        id: jobId,
        toolId,
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
      };
      MOCK_JOBS.set(jobId, job);

      // TODO M4: شبیه‌ساز کامل چرخه Job با تایمر
      // Pending → Processing (45%) → Done (100%)
      setTimeout(() => {
        const j = MOCK_JOBS.get(jobId);
        if (j) MOCK_JOBS.set(jobId, { ...j, status: 'processing', progress: 45 });
      }, 1500);
      setTimeout(() => {
        const j = MOCK_JOBS.get(jobId);
        if (j) {
          MOCK_JOBS.set(jobId, { ...j, status: 'done', progress: 100, completedAt: Date.now() });
        }
      }, 4000);

      void inputs; // suppress unused warning
      return { jobId };
    },
  },

  // ================================================================ //
  // JOBS                                                              //
  // ================================================================ //
  jobs: {
    get: async (jobId) => {
      await delay(100);
      const job = MOCK_JOBS.get(jobId);
      if (!job) throw new Error(`Job ${jobId} not found`);
      return { ...job };
    },

    list: async () => {
      await delay(200);
      return Array.from(MOCK_JOBS.values());
    },
  },

  // ================================================================ //
  // CHAT                                                              //
  // ================================================================ //
  chat: {
    sendMessage: async (threadId, content) => {
      await delay(300);

      const thread = threadId
        ? MOCK_THREADS.find((t) => t.id === threadId) ?? MOCK_THREADS[0]
        : MOCK_THREADS[0];

      const userMessage: Message = {
        id: generateId('msg'),
        role: 'user',
        content,
        createdAt: Date.now(),
      };

      thread.messages.push(userMessage);
      thread.updatedAt = Date.now();

      // پیام ساختگی از هوش مصنوعی
      setTimeout(() => {
        const assistantMessage: Message = {
          id: generateId('msg'),
          role: 'assistant',
          content: `(Mock) پیام شما دریافت شد: "${content.slice(0, 50)}..."`,
          createdAt: Date.now(),
        };
        thread.messages.push(assistantMessage);
      }, 1000);

      return userMessage;
    },

    getThreads: async () => {
      await delay(200);
      return [...MOCK_THREADS];
    },

    getThread: async (threadId) => {
      await delay(150);
      const thread = MOCK_THREADS.find((t) => t.id === threadId);
      if (!thread) throw new Error(`Thread ${threadId} not found`);
      return { ...thread };
    },
  },

  // ================================================================ //
  // ASSETS                                                            //
  // ================================================================ //
  assets: {
    list: async () => {
      await delay(200);
      return [...MOCK_ASSETS];
    },

    get: async (assetId) => {
      await delay(100);
      const asset = MOCK_ASSETS.find((a) => a.id === assetId);
      if (!asset) throw new Error(`Asset ${assetId} not found`);
      return { ...asset };
    },
  },

  // ================================================================ //
  // USER                                                              //
  // ================================================================ //
  user: {
    getProfile: async () => {
      await delay(200);
      return { ...MOCK_USER };
    },

    getBillingInfo: async () => {
      await delay(150);
      return { ...MOCK_BILLING };
    },
  },
};
