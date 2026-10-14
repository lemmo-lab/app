'use client';

/**
 * Studio Context Provider & 6-State Context Machine
 *
 * Conforms to:
 * - ADR-016 Section 2.6: Explicit 6-state machine (uninitialized, loading, ready, no-workspace, error, signed-out)
 * - ADR-016 Section 2.7: Multi-tenant cache isolation & mutation lifecycle
 * - ADR-016 Section 2.11: Per-request SSR isolation & logout race condition protection
 * - TASK_FRONTEND_STAGE12B: Section 2.6
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  sdk,
  setTransportContext,
  incrementSessionGeneration,
  getSessionGenerationId,
  onSignedOut,
  clearStaleWorkspaceScope,
  type ContextResult,
  type UserContext,
  type WorkspaceSummary,
  type EntitlementStatus,
  PlatformApiError,
} from '@/sdk';
import { useUiStore } from '@/stores/uiStore';

export type StudioState =
  | 'uninitialized'
  | 'loading'
  | 'ready'
  | 'no-workspace'
  | 'error'
  | 'signed-out';

export interface StudioContextValue {
  state: StudioState;
  context: ContextResult | null;
  user: UserContext | null;
  activeWorkspace: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  /**
   * Entitlement availability. `degraded` means the quota/ledger service is
   * unreachable: balance is unknown (never 0/unlimited) and paid generation must
   * stay closed, while read-only surfaces (history) remain usable.
   */
  entitlementsStatus: EntitlementStatus;
  financeDegraded: boolean;
  error: Error | null;
  sessionGenerationId: number;
  retry: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

interface StudioContextProviderProps {
  children: React.ReactNode;
}

export function StudioContextProvider({ children }: StudioContextProviderProps) {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const [state, setState] = useState<StudioState>('loading');
  const [contextData, setContextData] = useState<ContextResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [sessionGen, setSessionGen] = useState<number>(() => getSessionGenerationId());

  const fetchContext = useCallback(async (requestedWsId?: string) => {
    const callGen = getSessionGenerationId();

    const applyContext = (res: ContextResult): void => {
      if (getSessionGenerationId() !== callGen) {
        return;
      }

      setError(null);
      setContextData(res);

      if (!res.user || !res.workspaces || res.workspaces.length === 0) {
        setTransportContext(null, callGen);
        clearStaleWorkspaceScope();
        setState('no-workspace');
        return;
      }

      const targetWorkspace =
        (requestedWsId && res.workspaces.find((w) => w.id === requestedWsId)) ||
        res.active_workspace ||
        res.workspaces[0];

      setTransportContext(targetWorkspace.id, callGen);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lemmo_active_workspace', targetWorkspace.id);
      }
      setState('ready');
    };

    try {
      const res = await sdk.context.get();
      applyContext(res);
    } catch (err: unknown) {
      // Guard against stale response if session terminated in-flight
      if (getSessionGenerationId() !== callGen) {
        return;
      }

      const apiErr = err instanceof PlatformApiError ? err : null;
      if (apiErr?.status === 401 || (err as { status?: number })?.status === 401) {
        setState('signed-out');
        return;
      }

      // A 403 workspace-forbidden means the request was scoped to a workspace the
      // user is not a member of (typically a stale scope persisted by a previous
      // session or account). Drop the stale scope and retry once against the
      // user's real context instead of surfacing a dead-end connection error.
      const reason = apiErr?.reason ?? apiErr?.envelope?.reason;
      if (
        apiErr?.status === 403 &&
        (reason === 'ERROR_REASON_WORKSPACE_FORBIDDEN' ||
          reason === 'ERROR_REASON_PERMISSION_DENIED_WORKSPACE' ||
          reason === 'WORKSPACE_ACCESS_DENIED')
      ) {
        setTransportContext(null, callGen);
        clearStaleWorkspaceScope();
        try {
          const retried = await sdk.context.get();
          applyContext(retried);
          return;
        } catch (retryErr: unknown) {
          if (getSessionGenerationId() !== callGen) {
            return;
          }
          setError(retryErr instanceof Error ? retryErr : new Error(String(retryErr)));
          setState('error');
          return;
        }
      }

      setError(err instanceof Error ? err : new Error(String(err)));
      setState('error');
    }
  }, []);

  // Initial load
  useEffect(() => {
    let ignore = false;
    queueMicrotask(() => {
      if (!ignore) {
        void fetchContext();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchContext]);

  // Listen for silent transport session invalidation
  useEffect(() => {
    const unsubscribe = onSignedOut(() => {
      setState('signed-out');
    });
    return unsubscribe;
  }, []);

  const retry = useCallback(async () => {
    setState('loading');
    await fetchContext();
  }, [fetchContext]);

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      setState('loading');
      // SEC-23: Cancel in-flight queries & clear cache on workspace switch
      await queryClient.cancelQueries();
      queryClient.clear();
      useUiStore.getState().reset();

      startTransition(() => {
        setTransportContext(workspaceId, getSessionGenerationId());
      });
      await fetchContext(workspaceId);
    },
    [fetchContext, queryClient]
  );

  const logout = useCallback(async () => {
    const baseAuthUrl =
      process.env.NEXT_PUBLIC_AUTH_URL ||
      (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : 'http://localhost:3001');

    try {
      // 1. Cancel in-flight queries & clear TanStack Query cache completely (ADR-016 Section 2.7)
      await queryClient.cancelQueries();
      queryClient.clear();

      // 2. Increment session generation ID to invalidate in-flight retries
      const nextGen = incrementSessionGeneration();
      setSessionGen(nextGen);

      // 3. Reset Zustand stores (uiStore, etc.)
      useUiStore.getState().reset();

      // 4. Fire logout endpoint
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    } finally {
      // 5. Hard browser redirect with return_to
      if (typeof window !== 'undefined') {
        const fullAuthUrl = new URL('/auth/entry', baseAuthUrl);
        fullAuthUrl.searchParams.set('return_to', window.location.origin);
        window.location.assign(fullAuthUrl.toString());
      }
    }
  }, [queryClient]);

  const entitlementsStatus: EntitlementStatus = contextData?.entitlements?.status ?? 'degraded';

  const value: StudioContextValue = {
    state,
    context: contextData,
    user: contextData?.user ?? null,
    activeWorkspace: contextData?.active_workspace ?? null,
    workspaces: contextData?.workspaces ?? [],
    entitlementsStatus,
    financeDegraded: entitlementsStatus === 'degraded',
    error,
    sessionGenerationId: sessionGen,
    retry,
    switchWorkspace,
    logout,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudioContext(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudioContext must be used within a StudioContextProvider');
  }
  return ctx;
}

export function useOptionalStudioContext(): StudioContextValue | null {
  return useContext(StudioContext);
}
