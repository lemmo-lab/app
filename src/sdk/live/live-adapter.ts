/**
 * Lemmo Live SDK Adapter
 *
 * Implements SdkClient interface connecting exclusively to real HTTP/SSE endpoints.
 * Follows Zero-Mock-in-Client architecture (ADR-016, OQ-036, OQ-040).
 */

import type {
  SdkClient,
  ContextResult,
  Project,
  Workspace,
  ToolManifest,
  Job,
  JobEvent,
  Message,
  Thread,
  Asset,
  FeedItem,
  FeedResult,
  UserProfile,
  BillingInfo,
} from '../types';

import {
  getMeContext,
  listProjects,
  createProject,
  listWorkspaces,
  createWorkspace,
  listTools,
  executeTool,
  getJob,
  listJobs,
  listChatThreads,
  getChatThread,
  sendChatMessage,
  listAssets,
  getAsset,
  getFeed,
  getFeedItem,
  type GetMeContext200,
  type ListProjects200,
  type CreateProject201,
  type ListWorkspaces200,
  type CreateWorkspace201,
  type GetFeed200,
} from './generated';

import { onSignedOut } from './transport';

// Active SSE subscriptions tracking for automatic cleanup on session change
const activeStreams = new Set<EventSource>();

// Automatically close all active streams when signed out
onSignedOut(() => {
  closeAllStreams();
});

export function closeAllStreams(): void {
  activeStreams.forEach((es) => {
    try {
      es.close();
    } catch {
      // ignore
    }
  });
  activeStreams.clear();
}

export const liveSdkAdapter: SdkClient = {
  // ================================================================ //
  // CONTEXT                                                           //
  // ================================================================ //
  context: {
    get: async (): Promise<ContextResult> => {
      const response = await getMeContext();
      const res = (response as { data: GetMeContext200 }).data;
      return {
        user: {
          id: res.user.id,
          email: res.user.email,
          handle: res.user.handle,
          display_name: res.user.display_name,
          avatar_url: res.user.avatar_url,
          status: res.user.status,
          preferences: res.user.preferences as Record<string, unknown> | undefined,
        },
        active_workspace: res.active_workspace
          ? {
              id: res.active_workspace.id,
              name: res.active_workspace.name,
              type: res.active_workspace.type,
              role: res.active_workspace.role,
            }
          : null,
        workspaces: (res.workspaces || []).map((w) => ({
          id: w.id,
          name: w.name,
          type: w.type,
          role: w.role,
        })),
        entitlements: {
          tier: (res.entitlements.tier as 'FREE' | 'PRO' | 'ENTERPRISE') || 'FREE',
          wallet_balance: res.entitlements.wallet_balance || 0,
          features: res.entitlements.features || [],
        },
        onboarding: {
          completed: Boolean(res.onboarding.completed),
          steps: (res.onboarding.steps as Record<string, boolean>) || {},
          next_action: res.onboarding.next_action || '',
        },
        session: (res as unknown as { session?: { expires_at?: number } }).session,
      };
    },
  },

  // ================================================================ //
  // PROJECTS                                                          //
  // ================================================================ //
  projects: {
    list: async (): Promise<Project[]> => {
      const response = await listProjects();
      const data = (response as { data: ListProjects200 }).data;
      return (data?.projects || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        version: p.version,
      }));
    },

    create: async (input: { name: string; description?: string }): Promise<Project> => {
      const response = await createProject({
        name: input.name,
        description: input.description,
      });
      const data = (response as { data: CreateProject201 }).data;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        version: data.version,
      };
    },
  },

  // ================================================================ //
  // WORKSPACES                                                        //
  // ================================================================ //
  workspaces: {
    list: async (): Promise<Workspace[]> => {
      const response = await listWorkspaces();
      const data = (response as { data: ListWorkspaces200 }).data;
      return (data?.workspaces || []).map((w) => ({
        id: w.id,
        name: w.name,
        type: w.type,
        role: w.role,
      }));
    },

    create: async (input: { name: string; type?: string }): Promise<Workspace> => {
      const response = await createWorkspace({
        name: input.name,
      });
      const data = (response as { data: CreateWorkspace201 }).data;
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        role: 'OWNER',
      };
    },
  },

  // ================================================================ //
  // TOOLS (Zero-Mock in Client — Dispatched to Kong / Prism Mock)      //
  // ================================================================ //
  tools: {
    list: async (): Promise<ToolManifest[]> => {
      const response = await listTools();
      return (response as { data: ToolManifest[] }).data;
    },

    execute: async (toolId: string, inputs: Record<string, unknown>): Promise<{ jobId: string }> => {
      const response = await executeTool(toolId, inputs);
      return (response as { data: { jobId: string } }).data;
    },
  },

  // ================================================================ //
  // JOBS & SSE STREAMING                                              //
  // ================================================================ //
  jobs: {
    get: async (jobId: string): Promise<Job> => {
      const response = await getJob(jobId);
      return (response as { data: Job }).data;
    },

    list: async (): Promise<Job[]> => {
      const response = await listJobs();
      return (response as { data: Job[] }).data;
    },

    subscribe: (jobId: string, onEvent: (event: JobEvent) => void): (() => void) => {
      const EventSourceCtor =
        typeof window !== 'undefined'
          ? window.EventSource
          : (globalThis as unknown as { EventSource?: typeof EventSource }).EventSource;

      if (!EventSourceCtor) {
        return () => {};
      }

      const url = `/api/v1/jobs/${encodeURIComponent(jobId)}/events`;
      const eventSource = new EventSourceCtor(url, { withCredentials: true });
      activeStreams.add(eventSource);

      const cleanup = () => {
        if (activeStreams.has(eventSource)) {
          activeStreams.delete(eventSource);
          eventSource.close();
        }
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({
            type: 'message',
            jobId,
            status: data.status || 'RUNNING',
            progressPercent: data.progress_percent,
            step: data.step,
            raw: data,
          });
        } catch {
          // ignore parsing error
        }
      };

      eventSource.addEventListener('progress', (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          onEvent({
            type: 'progress',
            jobId,
            status: data.status || 'RUNNING',
            progressPercent: data.progress_percent,
            step: data.step,
            raw: data,
          });
        } catch {
          // ignore parsing error
        }
      });

      // Terminal event handler per ADR-016 Section 2.13
      eventSource.addEventListener('job.terminal', (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          onEvent({
            type: 'job.terminal',
            jobId,
            status: data.status || 'SUCCEEDED',
            progressPercent: 100,
            results: data.results,
            completedAt: data.completed_at,
            raw: data,
          });
        } catch {
          // ignore parsing error
        } finally {
          cleanup();
        }
      });

      eventSource.onerror = () => {
        if (eventSource.readyState === EventSource.CLOSED) {
          cleanup();
        }
      };

      return cleanup;
    },
  },

  // ================================================================ //
  // CHAT (Zero-Mock in Client — Dispatched to Kong / Prism Mock)       //
  // ================================================================ //
  chat: {
    sendMessage: async (threadId: string | null, content: string): Promise<Message> => {
      const response = await sendChatMessage({
        threadId: threadId ?? undefined,
        content,
      });
      return (response as { data: Message }).data;
    },

    getThreads: async (): Promise<Thread[]> => {
      const response = await listChatThreads();
      return (response as { data: Thread[] }).data;
    },

    getThread: async (threadId: string): Promise<Thread> => {
      const response = await getChatThread(threadId);
      return (response as { data: Thread }).data;
    },
  },

  // ================================================================ //
  // ASSETS                                                            //
  // ================================================================ //
  assets: {
    list: async (): Promise<Asset[]> => {
      const response = await listAssets();
      return (response as { data: Asset[] }).data;
    },

    get: async (assetId: string): Promise<Asset> => {
      const response = await getAsset(assetId);
      return (response as { data: Asset }).data;
    },
  },

  // ================================================================ //
  // FEED                                                              //
  // ================================================================ //
  feed: {
    list: async (params?: { category?: string; limit?: number; cursor?: string }): Promise<FeedResult> => {
      const response = await getFeed(params);
      return (response as { data: GetFeed200 }).data as FeedResult;
    },

    get: async (id: string): Promise<FeedItem> => {
      const response = await getFeedItem(id);
      return (response as { data: FeedItem }).data;
    },
  },

  // ================================================================ //
  // USER & BILLING                                                    //
  // ================================================================ //
  user: {
    getProfile: async (): Promise<UserProfile> => {
      const ctx = await liveSdkAdapter.context.get();
      return {
        id: ctx.user.id,
        name: ctx.user.display_name || ctx.user.handle || 'User',
        email: ctx.user.email,
        avatarUrl: ctx.user.avatar_url,
      };
    },

    getBillingInfo: async (): Promise<BillingInfo> => {
      const ctx = await liveSdkAdapter.context.get();
      return {
        tokenBalance: ctx.entitlements.wallet_balance || 0,
        plan: (ctx.entitlements.tier?.toLowerCase() as 'free' | 'pro' | 'enterprise') || 'free',
      };
    },
  },
};
