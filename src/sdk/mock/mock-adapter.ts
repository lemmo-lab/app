/**
 * Mock SDK Adapter — Simulated data adapter implementing SdkClient.
 *
 * Simulates network latency (300–800ms) for realistic loading state testing.
 * In M4, a full Job Simulator with real timer-based progress will be added.
 */

import type { SdkClient, Job, Message, Thread } from '../types';
import {
  MOCK_ASSETS,
  MOCK_BILLING,
  MOCK_FEATURED_SLIDES,
  MOCK_FEED_ITEMS,
  MOCK_JOBS,
  MOCK_QUICK_TOOLS,
  MOCK_THREADS,
  MOCK_TOOLS,
  MOCK_USER,
} from './mock-data';

/** Simulate network latency with a random delay between ms and ms+500 */
function delay(ms: number = 300): Promise<void> {
  const randomDelay = ms + Math.random() * 500; // 300 to 800ms
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}

/** Generate a random ID with an optional prefix */
function generateId(prefix: string = 'mock'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const mockSdkAdapter: SdkClient = {
  // ================================================================ //
  // CONTEXT, WORKSPACES & PROJECTS                                    //
  // ================================================================ //
  context: {
    get: async () => {
      await delay(200);
      return {
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
          display_name: MOCK_USER.name,
          handle: 'demo-user',
          status: 'ACTIVE',
        },
        active_workspace: {
          id: 'mock-ws-001',
          name: 'Demo Workspace',
          type: 'PERSONAL',
          role: 'OWNER',
        },
        workspaces: [
          {
            id: 'mock-ws-001',
            name: 'Demo Workspace',
            type: 'PERSONAL',
            role: 'OWNER',
          },
        ],
        entitlements: {
          tier: 'PRO',
          wallet_balance: 10000,
          features: ['flux-dev', 'chat', 'unlimited-canvas'],
        },
        onboarding: {
          completed: true,
          steps: { profile_completed: true, workspace_created: true, first_project_created: true },
          next_action: 'EXPLORE_TEMPLATES',
        },
      };
    },
  },

  projects: {
    list: async () => {
      await delay(200);
      return [
        {
          id: 'proj-001',
          name: 'Demo Project',
          description: 'A mock project for development',
          version: 1,
          createdAt: Date.now() - 3600000,
        },
      ];
    },
    get: async (id: string) => {
      await delay(150);
      const projects = await mockSdkAdapter.projects.list();
      const found = projects.find((p) => p.id === id);
      if (!found) {
        return {
          id,
          name: 'Demo Project',
          description: 'A mock project for development',
          version: 1,
          createdAt: Date.now() - 3600000,
        };
      }
      return found;
    },
    create: async (input) => {
      await delay(300);
      return {
        id: generateId('proj'),
        name: input.name,
        description: input.description,
        version: 1,
        createdAt: Date.now(),
      };
    },
  },

  workspaces: {
    list: async () => {
      await delay(150);
      return [
        {
          id: 'mock-ws-001',
          name: 'Demo Workspace',
          type: 'PERSONAL',
          role: 'OWNER',
        },
      ];
    },
    create: async (input) => {
      await delay(300);
      return {
        id: generateId('ws'),
        name: input.name,
        type: input.type || 'TEAM',
        role: 'OWNER',
      };
    },
  },

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

      // Create a new job in the pending state
      const job: Job = {
        id: jobId,
        toolId,
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
      };
      MOCK_JOBS.set(jobId, job);

      // TODO M4: Full Job Simulator with real timer-based progress cycle:
      // Pending (0%) → Processing (45%) → Done (100%)
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

      void inputs; // suppress unused-variable warning
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

    subscribe: (jobId, onEvent) => {
      let cancelled = false;
      setTimeout(() => {
        if (cancelled) return;
        onEvent({
          type: 'progress',
          jobId,
          status: 'processing',
          progressPercent: 50,
          step: 1,
        });
      }, 500);
      setTimeout(() => {
        if (cancelled) return;
        onEvent({
          type: 'job.terminal',
          jobId,
          status: 'done',
          progressPercent: 100,
          step: 2,
        });
      }, 1200);

      return () => {
        cancelled = true;
      };
    },
  },

  // ================================================================ //
  // CHAT                                                              //
  // ================================================================ //
  chat: {
    sendMessage: async (threadId, content) => {
      await delay(200);

      const thread: Thread = threadId
        ? (MOCK_THREADS.find((t) => t.id === threadId) ?? MOCK_THREADS[0])
        : MOCK_THREADS[0];

      const userMsgId = generateId('msg');
      const assistantMsgId = generateId('msg');

      const userMessage: Message = {
        id: userMsgId,
        role: 'user',
        content,
        createdAt: Date.now(),
        threadId: thread.id,
        status: 'completed',
      };

      const assistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: `Creative synthesis completed for: "${content.slice(0, 60)}"`,
        createdAt: Date.now() + 100,
        threadId: thread.id,
        status: 'completed',
        attachments: [
          {
            id: generateId('ast'),
            type: 'image',
            name: 'Generated Creative Output',
            url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
            aspectRatio: '3:4',
            createdAt: Date.now(),
          },
        ],
      };

      thread.messages.push(userMessage, assistantMessage);
      thread.updatedAt = Date.now();

      return {
        threadId: thread.id,
        userMessageId: userMsgId,
        assistantMessageId: assistantMsgId,
        status: 'completed',
      };
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

    subscribe: (threadId, messageId, onEvent) => {
      let cancelled = false;
      setTimeout(() => {
        if (cancelled) return;
        onEvent({
          type: 'token',
          threadId,
          messageId,
          token: 'Mock generation completed.',
        });
        onEvent({
          type: 'message_done',
          threadId,
          messageId,
        });
      }, 300);

      return () => {
        cancelled = true;
      };
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
  // CONTENT                                                           //
  // ================================================================ //
  content: {
    get: async () => {
      await delay(150);
      return {
        featured: [...MOCK_FEATURED_SLIDES],
        quick_tools: [...MOCK_QUICK_TOOLS],
      };
    },
  },

  // ================================================================ //
  // FEED                                                              //
  // ================================================================ //
  feed: {
    list: async (params) => {
      await delay(200);
      let items = [...MOCK_FEED_ITEMS];
      if (params?.category) {
        items = items.filter((item) => item.category === params.category);
      }
      return {
        items,
        next_cursor: null,
        has_more: false,
      };
    },

    get: async (id) => {
      await delay(100);
      const item = MOCK_FEED_ITEMS.find((f) => f.id === id);
      if (!item) throw new Error(`Feed item ${id} not found`);
      return { ...item };
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
