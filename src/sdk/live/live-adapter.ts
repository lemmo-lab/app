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
  Thread,
  Asset,
  ContentResult,
  FeedItem,
  FeedResult,
  UserProfile,
  BillingInfo,
  SendMessageResponse,
  ChatEvent,
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
  cancelChatMessage,
  listAssets,
  getAsset,
  getContent,
  getFeed,
  getFeedItem,
  type GetMeContext200,
  type ListProjects200,
  type CreateProject201,
  type ListWorkspaces200,
  type CreateWorkspace201,
  type GetContent200,
  type GetFeed200,
} from './generated';

import { onSignedOut, customFetch } from './transport';

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

    get: async (id: string): Promise<Project> => {
      const projects = await liveSdkAdapter.projects.list();
      const found = projects.find((p) => p.id === id);
      if (!found) {
        throw new Error(`Project ${id} not found`);
      }
      return found;
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

    get: async (id: string): Promise<Workspace> => {
      const res = await customFetch<{ workspace: Workspace }>(`/api/v1/workspaces/${encodeURIComponent(id)}`);
      return res.workspace;
    },

    update: async (id: string, input: { name?: string; slug?: string }): Promise<Workspace> => {
      const res = await customFetch<{ workspace: Workspace }>(`/api/v1/workspaces/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });
      return res.workspace;
    },

    getMembers: async (workspaceId: string): Promise<import('../types').WorkspaceMemberInfo[]> => {
      const res = await customFetch<{ members: import('../types').WorkspaceMemberInfo[] }>(
        `/api/v1/workspaces/${encodeURIComponent(workspaceId)}/members`
      );
      return res.members || [];
    },

    inviteMember: async (workspaceId: string, email: string, role: string): Promise<void> => {
      await customFetch(`/api/v1/workspaces/${encodeURIComponent(workspaceId)}/members/invite`, {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
    },

    removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
      await customFetch(`/api/v1/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(memberId)}`, {
        method: 'DELETE',
      });
    },

    updateMemberRole: async (workspaceId: string, memberId: string, role: string): Promise<void> => {
      await customFetch(`/api/v1/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(memberId)}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    },

    getSettings: async (workspaceId: string): Promise<import('../types').WorkspaceSettingsData> => {
      const res = await customFetch<{ settings: import('../types').WorkspaceSettingsData }>(
        `/api/v1/workspaces/${encodeURIComponent(workspaceId)}/settings`
      );
      return res.settings || {};
    },

    updateSettings: async (
      workspaceId: string,
      settings: import('../types').WorkspaceSettingsData
    ): Promise<import('../types').WorkspaceSettingsData> => {
      const res = await customFetch<{ settings: import('../types').WorkspaceSettingsData }>(
        `/api/v1/workspaces/${encodeURIComponent(workspaceId)}/settings`,
        {
          method: 'PUT',
          body: JSON.stringify({ settings }),
        }
      );
      return res.settings || {};
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
      const response = await executeTool(toolId, {
        input_kind: 'structured',
        inputs,
      });
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
  // CHAT (Live Agent Service — Dispatched to agent-service via Kong)  //
  // ================================================================ //
  chat: {
    sendMessage: async (threadId: string | null, content: string): Promise<SendMessageResponse> => {
      const response = await sendChatMessage({
        threadId: threadId ?? undefined,
        content,
      });
      if (response.status === 202) {
        return response.data as SendMessageResponse;
      }
      const errorData = (response as { data?: { detail?: string; title?: string } }).data;
      const errMsg = errorData?.detail || errorData?.title || `Failed to send message: HTTP ${response.status}`;
      throw new Error(errMsg);
    },

    getThreads: async (): Promise<Thread[]> => {
      const response = await listChatThreads();
      if ('data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },

    getThread: async (threadId: string): Promise<Thread> => {
      const response = await getChatThread(threadId);
      return (response as { data: Thread }).data;
    },

    subscribe: (threadId: string, messageId: string, onEvent: (event: ChatEvent) => void): (() => void) => {
      const EventSourceCtor =
        typeof window !== 'undefined'
          ? window.EventSource
          : (globalThis as unknown as { EventSource?: typeof EventSource }).EventSource;

      if (!EventSourceCtor) {
        return () => {};
      }

      const url = `/api/v1/chat/threads/${encodeURIComponent(threadId)}/messages/${encodeURIComponent(messageId)}/events`;
      const eventSource = new EventSourceCtor(url, { withCredentials: true });
      activeStreams.add(eventSource);

      const cleanup = () => {
        if (activeStreams.has(eventSource)) {
          activeStreams.delete(eventSource);
          eventSource.close();
        }
      };

      const handleParsed = (eventType: ChatEvent['type'], dataStr: string) => {
        try {
          const payload = JSON.parse(dataStr);
          onEvent({
            type: eventType,
            threadId,
            messageId,
            token: payload.token,
            jobId: payload.job_id || payload.jobId,
            toolId: payload.tool_id || payload.toolId,
            toolVersion: payload.tool_version || payload.toolVersion,
            error: payload.error,
            data: payload,
            raw: payload,
          });
        } catch {
          // ignore parsing error
        }
      };

      eventSource.addEventListener('token', (e) => {
        handleParsed('token', (e as MessageEvent).data);
      });

      eventSource.addEventListener('tool_call', (e) => {
        handleParsed('tool_call', (e as MessageEvent).data);
      });

      eventSource.addEventListener('job_dispatched', (e) => {
        handleParsed('job_dispatched', (e as MessageEvent).data);
      });

      eventSource.addEventListener('message_done', (e) => {
        handleParsed('message_done', (e as MessageEvent).data);
        cleanup();
      });

      eventSource.addEventListener('message_failed', (e) => {
        handleParsed('message_failed', (e as MessageEvent).data);
        cleanup();
      });

      eventSource.addEventListener('message_cancelled', (e) => {
        handleParsed('message_cancelled', (e as MessageEvent).data);
        cleanup();
      });

      eventSource.onerror = () => {
        if (eventSource.readyState === EventSource.CLOSED) {
          cleanup();
        }
      };

      return cleanup;
    },

    cancelMessage: async (threadId: string, messageId: string): Promise<void> => {
      await cancelChatMessage(threadId, messageId);
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
  // CONTENT (Platform Showcase, Banners & Quick Tools)                //
  // ================================================================ //
  content: {
    get: async (): Promise<ContentResult> => {
      const response = await getContent();
      return (response as { data: GetContent200 }).data as ContentResult;
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
  // QUOTA & PRICING                                                   //
  // ================================================================ //
  quota: {
    getPricing: async (): Promise<import('../types').PricingRateCard> => {
      const res = await customFetch<{ pricing: import('../types').PricingRateCard }>('/api/v1/quota/pricing');
      return (res as unknown as import('../types').PricingRateCard)?.version
        ? (res as unknown as import('../types').PricingRateCard)
        : res.pricing || { version: '1.0.0', currency: 'IRR', tools: {} };
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
        handle: ctx.user.handle,
        bio: (ctx.user.preferences as { bio?: string } | undefined)?.bio,
      };
    },

    updateProfile: async (input: import('../types').UpdateProfileInput): Promise<UserProfile> => {
      const ctx = await liveSdkAdapter.context.get();
      const userId = ctx.user.id;
      if (!userId) {
        throw new Error('Unauthenticated user cannot update profile');
      }

      // 1. Update core profile fields (display_name, handle, avatar_url)
      if (input.displayName !== undefined || input.handle !== undefined || input.avatarUrl !== undefined) {
        await customFetch(`/api/v1/users/${encodeURIComponent(userId)}/profile`, {
          method: 'PUT',
          body: JSON.stringify({
            display_name: input.displayName ?? ctx.user.display_name,
            handle: input.handle ?? ctx.user.handle,
            avatar_url: input.avatarUrl ?? ctx.user.avatar_url,
          }),
        });
      }

      // 2. Update bio if provided in preferences
      if (input.bio !== undefined) {
        const existingPrefs = (ctx.user.preferences as Record<string, unknown>) || {};
        await customFetch(`/api/v1/users/${encodeURIComponent(userId)}/preferences`, {
          method: 'PUT',
          body: JSON.stringify({
            ...existingPrefs,
            bio: input.bio,
          }),
        });
      }

      return {
        id: userId,
        name: input.displayName ?? ctx.user.display_name ?? 'User',
        email: ctx.user.email,
        handle: input.handle ?? ctx.user.handle,
        avatarUrl: input.avatarUrl ?? ctx.user.avatar_url,
        bio: input.bio ?? (ctx.user.preferences as { bio?: string } | undefined)?.bio,
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
