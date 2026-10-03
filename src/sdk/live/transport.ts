/**
 * Lemmo Live SDK Transport Layer
 *
 * Conforms to:
 * - ADR-016: Request Context Governance, Workspace Policy Classification, and End-to-End Lifecycle Security
 * - ADR-015: Unified Identity Architecture & Zero-Trust Session Lifecycle
 * - DOC-ARCH-009: Fail-Fast Configuration & Dynamic Timers
 * - TASK_FRONTEND_STAGE12B: Stage 12B Detailed Specifications
 */

import { PlatformApiError, type PlatformErrorEnvelope } from '../errors';

export interface TransportContext {
  activeWorkspaceId: string | null;
  sessionGenerationId: number;
}

export interface StepUpAuthRequest {
  resolve: () => void;
  reject: (err: Error) => void;
}

type StepUpListener = (request: StepUpAuthRequest) => void;
type SignedOutListener = () => void;

// Module-level context state (frozen per request snapshot)
let currentWorkspaceId: string | null = null;
let currentSessionGenerationId: number = 0;

// Listeners for step-up modal and session termination
const stepUpListeners = new Set<StepUpListener>();
const signedOutListeners = new Set<SignedOutListener>();

// Proactive refresh timer & single-flight lock
let proactiveRefreshTimer: NodeJS.Timeout | null = null;
let singleFlightRefreshPromise: Promise<boolean> | null = null;

/**
 * Configure active workspace and session generation ID.
 */
export function setTransportContext(workspaceId: string | null, sessionGen?: number): void {
  currentWorkspaceId = workspaceId;
  if (typeof sessionGen === 'number') {
    currentSessionGenerationId = sessionGen;
  }
}

/**
 * Increment session generation ID on logout or user switch.
 * Aborts any pending retries from prior sessions.
 */
export function incrementSessionGeneration(): number {
  currentSessionGenerationId += 1;
  cancelProactiveRefresh();
  return currentSessionGenerationId;
}

export function getActiveWorkspaceId(): string | null {
  return currentWorkspaceId;
}

export function getSessionGenerationId(): number {
  return currentSessionGenerationId;
}

/**
 * Register a listener for step-up privileged authentication events (ADR-016 Section 2.22).
 */
export function onStepUpAuthRequired(listener: StepUpListener): () => void {
  stepUpListeners.add(listener);
  return () => stepUpListeners.delete(listener);
}

/**
 * Register a listener for session termination / sign-out.
 */
export function onSignedOut(listener: SignedOutListener): () => void {
  signedOutListeners.add(listener);
  return () => signedOutListeners.delete(listener);
}

function notifyStepUpRequired(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (stepUpListeners.size === 0) {
      reject(new Error('No step-up authentication handler registered in UI.'));
      return;
    }
    const request: StepUpAuthRequest = {
      resolve,
      reject,
    };
    stepUpListeners.forEach((listener) => listener(request));
  });
}

function notifySignedOut(): void {
  signedOutListeners.forEach((listener) => listener());
}

/**
 * Cancels active proactive refresh timer.
 */
export function cancelProactiveRefresh(): void {
  if (proactiveRefreshTimer) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }
}

/**
 * Schedule dynamic proactive token refresh at 90% of token lifespan (ADR-016 Section 2.12).
 * Never hardcodes static durations.
 */
export function scheduleProactiveRefresh(expiresAtSeconds: number): void {
  cancelProactiveRefresh();

  const nowSeconds = Math.floor(Date.now() / 1000);
  const remainingSeconds = expiresAtSeconds - nowSeconds;

  if (remainingSeconds <= 0) {
    // Already expired or immediate refresh
    void executeSilentRefresh();
    return;
  }

  // 90% of token lifespan
  const refreshDelayMs = Math.max(1000, Math.floor(remainingSeconds * 0.9) * 1000);

  proactiveRefreshTimer = setTimeout(() => {
    void executeSilentRefresh();
  }, refreshDelayMs);
}

/**
 * Single-flight silent token refresh.
 */
export async function executeSilentRefresh(): Promise<boolean> {
  if (singleFlightRefreshPromise) {
    return singleFlightRefreshPromise;
  }

  const sessionGenAtCall = currentSessionGenerationId;

  singleFlightRefreshPromise = (async () => {
    try {
      const response = await fetch(resolveUrl('/api/v1/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (currentSessionGenerationId !== sessionGenAtCall) {
        return false;
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notifySignedOut();
        }
        return false;
      }

      const body = (await response.json()) as { expires_in?: number; session?: { expires_at?: number } };
      if (body.session?.expires_at) {
        scheduleProactiveRefresh(body.session.expires_at);
      } else if (body.expires_in) {
        scheduleProactiveRefresh(Math.floor(Date.now() / 1000) + body.expires_in);
      }

      return true;
    } catch {
      return false;
    } finally {
      singleFlightRefreshPromise = null;
    }
  })();

  return singleFlightRefreshPromise;
}

/**
 * Resolves relative URLs in SSR or browser environments.
 */
function resolveUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (typeof window === 'undefined') {
    const gatewayInternalUrl = process.env.GATEWAY_INTERNAL_URL || 'http://localhost:8000';
    return `${gatewayInternalUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }
  return url;
}

/**
 * Sanitizes headers to eliminate raw X-Workspace-ID provided by callers (ADR-016 Section 2.3).
 */
function sanitizeHeaders(inputHeaders?: HeadersInit): Headers {
  const headers = new Headers(inputHeaders);
  
  // Strip any variation of x-workspace-id
  const keysToRemove: string[] = [];
  headers.forEach((_, key) => {
    if (key.toLowerCase() === 'x-workspace-id') {
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach((key) => headers.delete(key));

  return headers;
}

/**
 * Core customFetch mutator for Orval and SdkClient.
 * Provides:
 * - Header sanitization (strip caller X-Workspace-ID)
 * - Request Context Freezing across retries
 * - Credentials: 'include'
 * - Step-up 403 interception and automated replay
 * - Proactive refresh response parsing
 */
export async function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 1. Freeze context snapshot in the exact millisecond of invocation (ADR-016 Section 2.4)
  const snapshotWorkspaceId = currentWorkspaceId;
  const snapshotSessionGen = currentSessionGenerationId;

  const performRequest = async (): Promise<T> => {
    // Abort if session changed
    if (currentSessionGenerationId !== snapshotSessionGen) {
      throw new Error('Request aborted: session was terminated or switched.');
    }

    // 2. Sanitize and inject verified workspace header
    const headers = sanitizeHeaders(options.headers);
    if (snapshotWorkspaceId) {
      headers.set('X-Workspace-ID', snapshotWorkspaceId);
    }

    if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const resolvedUrl = resolveUrl(url);

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    let response: Response;
    try {
      response = await fetch(resolvedUrl, fetchOptions);
    } catch (networkErr) {
      if (currentSessionGenerationId !== snapshotSessionGen) {
        throw new Error('Request discarded: session was terminated or switched during request.');
      }
      throw networkErr;
    }

    // Abort if session changed while in-flight
    if (currentSessionGenerationId !== snapshotSessionGen) {
      throw new Error('Request discarded: session was terminated or switched during request.');
    }

    // 3. Handle 403 Privileged Session Required (ADR-016 Section 2.22)
    if (response.status === 403) {
      let problemPayload: PlatformErrorEnvelope | null = null;
      try {
        problemPayload = (await response.clone().json()) as PlatformErrorEnvelope;
      } catch {
        // Not a JSON response
      }

      if (problemPayload?.reason === 'ERROR_REASON_PRIVILEGED_SESSION_REQUIRED') {
        // Trigger step-up modal and await resolution without canvas reload
        await notifyStepUpRequired();

        // If user is still on the same session, replay the original request
        if (currentSessionGenerationId === snapshotSessionGen) {
          return performRequest();
        }
        throw new Error('Step-up authentication succeeded but session generation changed.');
      }
    }

    // 4. Handle non-2xx errors
    if (!response.ok) {
      let envelope: PlatformErrorEnvelope;
      try {
        envelope = (await response.json()) as PlatformErrorEnvelope;
      } catch {
        const text = await response.text().catch(() => '');
        envelope = {
          title: response.statusText || 'HTTP Error',
          status: response.status,
          detail: text || undefined,
        };
      }
      throw new PlatformApiError(response.status, envelope);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {
        status: 204,
        data: undefined,
        headers: response.headers,
      } as T;
    }

    const data = (await response.json()) as unknown;

    // 5. Inspect response for session expiration to schedule dynamic refresh
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const session = record.session as { expires_at?: number } | undefined;
      if (session?.expires_at && typeof session.expires_at === 'number') {
        scheduleProactiveRefresh(session.expires_at);
      } else if (typeof record.expires_in === 'number') {
        scheduleProactiveRefresh(Math.floor(Date.now() / 1000) + record.expires_in);
      }
    }

    return {
      status: response.status,
      data,
      headers: response.headers,
    } as T;
  };

  return performRequest();
}
