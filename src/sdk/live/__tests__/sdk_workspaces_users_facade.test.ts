/**
 * TASK-INT-002: SDK Facade Verification Test Suite
 *
 * Verifies liveSdkAdapter Workspaces and Users operations migrated to typed Orval clients.
 * Proves REM-01 and REM-02 elimination, DTO transformations, pure-delta preferences semantics,
 * and robust error/security handling (RBAC vs Step-Up separation, 401, 404, session guards).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { liveSdkAdapter } from '../live-adapter';
import {
  setTransportContext,
  incrementSessionGeneration,
  onSignedOut,
  onStepUpAuthRequired,
  cancelProactiveRefresh,
} from '../transport';
import { PlatformApiError } from '../../errors';

describe('TASK-INT-002: SDK Workspaces & Users Facade Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cancelProactiveRefresh();
    setTransportContext('ws-test-100', 1);
  });

  afterEach(() => {
    cancelProactiveRefresh();
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. Positive Paths: Workspaces Operations via SDK Facade
  // =========================================================================
  describe('Workspaces Facade Operations (Positive Paths)', () => {
    it('workspaces.get: calls GET /api/v1/workspaces/:id and maps WorkspaceDetail to Workspace', async () => {
      let requestedUrl = '';
      let requestedMethod = '';

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';

        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'ws-test-100',
              name: 'Design Studio',
              slug: 'design-studio',
              type: 'TEAM',
              status: 'ACTIVE',
              ownerId: 'usr-admin-1',
              createdAt: '2026-10-01T00:00:00Z',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const ws = await liveSdkAdapter.workspaces.get!('ws-test-100');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100');
      expect(requestedMethod).toBe('GET');
      expect(ws).toEqual({
        id: 'ws-test-100',
        name: 'Design Studio',
        type: 'TEAM',
      });
    });

    it('workspaces.update: calls PUT /api/v1/workspaces/:id with update body and returns updated Workspace', async () => {
      let requestedUrl = '';
      let requestedMethod = '';
      let requestBody: Record<string, unknown> | null = null;

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';
        requestBody = JSON.parse(init?.body as string);

        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'ws-test-100',
              name: 'Renamed Studio',
              slug: 'renamed-studio',
              type: 'TEAM',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const ws = await liveSdkAdapter.workspaces.update!('ws-test-100', {
        name: 'Renamed Studio',
        slug: 'renamed-studio',
      });

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100');
      expect(requestedMethod).toBe('PUT');
      expect(requestBody).toEqual({
        name: 'Renamed Studio',
        slug: 'renamed-studio',
      });
      expect(ws).toEqual({
        id: 'ws-test-100',
        name: 'Renamed Studio',
        type: 'TEAM',
      });
    });

    it('workspaces.getMembers: calls GET /api/v1/workspaces/:id/members and maps to WorkspaceMemberInfo[]', async () => {
      let requestedUrl = '';

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        requestedUrl = url.toString();

        return Promise.resolve(
          new Response(
            JSON.stringify({
              members: [
                {
                  id: 'usr-admin-1',
                  name: 'Alice Admin',
                  email: 'alice@lemmo.space',
                  role: 'OWNER',
                  initials: 'AA',
                  status: 'ACTIVE',
                },
                {
                  id: 'usr-dev-2',
                  name: 'Bob Builder',
                  email: 'bob@lemmo.space',
                  role: 'EDITOR',
                  initials: 'BB',
                  status: 'ACTIVE',
                },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const members = await liveSdkAdapter.workspaces.getMembers!('ws-test-100');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/members');
      expect(members).toHaveLength(2);
      expect(members[0]).toEqual({
        id: 'usr-admin-1',
        name: 'Alice Admin',
        email: 'alice@lemmo.space',
        role: 'OWNER',
        initials: 'AA',
        status: 'ACTIVE',
      });
      expect(members[1]).toEqual({
        id: 'usr-dev-2',
        name: 'Bob Builder',
        email: 'bob@lemmo.space',
        role: 'EDITOR',
        initials: 'BB',
        status: 'ACTIVE',
      });
    });

    it('workspaces.inviteMember: calls POST /api/v1/workspaces/:id/members/invite with email and role', async () => {
      let requestedUrl = '';
      let requestedMethod = '';
      let requestBody: Record<string, unknown> | null = null;

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';
        requestBody = JSON.parse(init?.body as string);

        return Promise.resolve(
          new Response(
            JSON.stringify({
              invitationId: 'inv-999',
              email: 'charlie@lemmo.space',
              role: 'EDITOR',
              token: 'tok-abc',
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      await liveSdkAdapter.workspaces.inviteMember!('ws-test-100', 'charlie@lemmo.space', 'EDITOR');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/members/invite');
      expect(requestedMethod).toBe('POST');
      expect(requestBody).toEqual({
        email: 'charlie@lemmo.space',
        role: 'EDITOR',
      });
    });

    it('workspaces.removeMember: calls DELETE /api/v1/workspaces/:id/members/:userId', async () => {
      let requestedUrl = '';
      let requestedMethod = '';

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';

        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await liveSdkAdapter.workspaces.removeMember!('ws-test-100', 'usr-dev-2');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/members/usr-dev-2');
      expect(requestedMethod).toBe('DELETE');
    });

    it('workspaces.updateMemberRole: calls PUT /api/v1/workspaces/:id/members/:userId/role with role body', async () => {
      let requestedUrl = '';
      let requestedMethod = '';
      let requestBody: Record<string, unknown> | null = null;

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';
        requestBody = JSON.parse(init?.body as string);

        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await liveSdkAdapter.workspaces.updateMemberRole!('ws-test-100', 'usr-dev-2', 'ADMIN');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/members/usr-dev-2/role');
      expect(requestedMethod).toBe('PUT');
      expect(requestBody).toEqual({ role: 'ADMIN' });
    });

    it('workspaces.getSettings: calls GET /api/v1/workspaces/:id/settings and returns WorkspaceSettingsData', async () => {
      let requestedUrl = '';

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        requestedUrl = url.toString();

        return Promise.resolve(
          new Response(
            JSON.stringify({
              workspaceId: 'ws-test-100',
              allowedModels: ['flux-dev', 'sdxl'],
              requireAdminApproval: true,
              defaultResolution: '1024x1024',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const settings = await liveSdkAdapter.workspaces.getSettings!('ws-test-100');

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/settings');
      expect(settings).toEqual({
        workspaceId: 'ws-test-100',
        allowedModels: ['flux-dev', 'sdxl'],
        requireAdminApproval: true,
        defaultResolution: '1024x1024',
      });
    });

    it('workspaces.updateSettings: calls PUT /api/v1/workspaces/:id/settings with updated settings', async () => {
      let requestedUrl = '';
      let requestedMethod = '';
      let requestBody: Record<string, unknown> | null = null;

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        requestedUrl = url.toString();
        requestedMethod = init?.method || 'GET';
        requestBody = JSON.parse(init?.body as string);

        return Promise.resolve(
          new Response(
            JSON.stringify({
              workspaceId: 'ws-test-100',
              allowedModels: ['flux-dev'],
              requireAdminApproval: false,
              defaultResolution: '1024x1024',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const updated = await liveSdkAdapter.workspaces.updateSettings!('ws-test-100', {
        allowedModels: ['flux-dev'],
        requireAdminApproval: false,
        defaultResolution: '1024x1024',
      });

      expect(new URL(requestedUrl).pathname).toBe('/api/v1/workspaces/ws-test-100/settings');
      expect(requestedMethod).toBe('PUT');
      expect(requestBody).toEqual({
        allowedModels: ['flux-dev'],
        requireAdminApproval: false,
        defaultResolution: '1024x1024',
      });
      expect(updated).toEqual({
        workspaceId: 'ws-test-100',
        allowedModels: ['flux-dev'],
        requireAdminApproval: false,
        defaultResolution: '1024x1024',
      });
    });
  });

  // =========================================================================
  // 2. Positive Paths: Users Operations & Preferences Deep-Merge
  // =========================================================================
  describe('Users Operations & Preferences Deep-Merge (Positive Paths)', () => {
    it('user.updateProfile: sends core fields to /profile and sends pure delta { bio } to /preferences', async () => {
      const capturedCalls: Array<{ url: string; method: string; body: Record<string, unknown> }> = [];

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        const urlStr = url.toString();
        const method = init?.method || 'GET';

        // 1. Context call inside updateProfile
        if (urlStr.includes('/api/v1/me/context')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                user: {
                  id: 'usr-alice-01',
                  email: 'alice@lemmo.space',
                  display_name: 'Alice Original',
                  handle: 'alice',
                  avatar_url: 'https://cdn.lemmo.space/avatars/alice.png',
                  preferences: {
                    theme: 'dark',
                    locale: 'fa',
                    canvas: { grid_snap: true },
                    bio: 'Old bio',
                  },
                },
                workspaces: [],
                entitlements: { tier: 'PRO', wallet_balance: 5000, features: [] },
                onboarding: { completed: true, steps: {}, next_action: '' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        // 2. Profile or Preferences mutation
        if (init?.body) {
          capturedCalls.push({
            url: urlStr,
            method,
            body: JSON.parse(init.body as string),
          });
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'usr-alice-01',
              email: 'alice@lemmo.space',
              display_name: 'Alice Updated',
              handle: 'alice_updated',
              avatar_url: 'https://cdn.lemmo.space/avatars/new.png',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      const updatedProfile = await liveSdkAdapter.user.updateProfile({
        displayName: 'Alice Updated',
        handle: 'alice_updated',
        avatarUrl: 'https://cdn.lemmo.space/avatars/new.png',
        bio: 'New AI Researcher bio',
      });

      // Verify two distinct mutation calls were made:
      expect(capturedCalls).toHaveLength(2);

      // Call 1: Core profile update
      expect(new URL(capturedCalls[0].url).pathname).toBe('/api/v1/users/usr-alice-01/profile');
      expect(capturedCalls[0].method).toBe('PUT');
      expect(capturedCalls[0].body).toEqual({
        display_name: 'Alice Updated',
        handle: 'alice_updated',
        avatar_url: 'https://cdn.lemmo.space/avatars/new.png',
      });

      // Call 2: Preferences update — MUST BE PURE DELTA (server-side deep merge)
      // Must NOT resend existingPrefs { theme, locale, canvas } to prevent stale-data overwriting!
      expect(new URL(capturedCalls[1].url).pathname).toBe('/api/v1/users/usr-alice-01/preferences');
      expect(capturedCalls[1].method).toBe('PUT');
      expect(capturedCalls[1].body).toEqual({
        bio: 'New AI Researcher bio',
      });

      expect(updatedProfile).toEqual({
        id: 'usr-alice-01',
        name: 'Alice Updated',
        email: 'alice@lemmo.space',
        handle: 'alice_updated',
        avatarUrl: 'https://cdn.lemmo.space/avatars/new.png',
        bio: 'New AI Researcher bio',
      });
    });

    it('user.updateProfile: skips preferences call if bio is undefined', async () => {
      const capturedUrls: string[] = [];

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        const urlStr = url.toString();
        if (init?.method === 'PUT') {
          capturedUrls.push(urlStr);
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              user: {
                id: 'usr-alice-01',
                email: 'alice@lemmo.space',
                display_name: 'Alice',
              },
              workspaces: [],
              entitlements: { tier: 'FREE', wallet_balance: 0, features: [] },
              onboarding: { completed: true, steps: {}, next_action: '' },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      await liveSdkAdapter.user.updateProfile({
        displayName: 'Alice New Name',
      });

      expect(capturedUrls).toHaveLength(1);
      expect(new URL(capturedUrls[0]).pathname).toBe('/api/v1/users/usr-alice-01/profile');
    });
  });

  // =========================================================================
  // 3. Negative Scenarios: Security, Errors & Session Guards
  // =========================================================================
  describe('Negative Scenarios & Security Controls', () => {
    it('Negative 1: 401 Unauthorized triggers notifySignedOut and throws PlatformApiError(401)', async () => {
      let signedOutTriggered = false;
      const unregister = onSignedOut(() => {
        signedOutTriggered = true;
      });

      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              type: 'https://lemmo.space/errors/unauthenticated',
              title: 'Unauthorized',
              status: 401,
              detail: 'Session expired',
              reason: 'UNAUTHENTICATED',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      await expect(liveSdkAdapter.workspaces.get!('ws-test-100')).rejects.toThrow(PlatformApiError);
      expect(signedOutTriggered).toBe(true);

      unregister();
    });

    it('Negative 2: 403 Forbidden with PERMISSION_DENIED (RBAC) throws error and DOES NOT trigger Step-Up Auth', async () => {
      let stepUpTriggered = false;
      const unregister = onStepUpAuthRequired(() => {
        stepUpTriggered = true;
      });

      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              type: 'https://lemmo.space/errors/permission-denied',
              title: 'Forbidden',
              status: 403,
              detail: 'Only OWNER or ADMIN may remove members',
              reason: 'PERMISSION_DENIED',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      try {
        await liveSdkAdapter.workspaces.removeMember!('ws-test-100', 'usr-target');
        expect.unreachable('Should have thrown PlatformApiError');
      } catch (err) {
        expect(err).toBeInstanceOf(PlatformApiError);
        const apiErr = err as PlatformApiError;
        expect(apiErr.status).toBe(403);
        expect(apiErr.envelope.reason).toBe('PERMISSION_DENIED');
      }

      // CRITICAL SECURITY ASSERTION: RBAC error MUST NOT be confused with Step-Up Auth!
      expect(stepUpTriggered).toBe(false);

      unregister();
    });

    it('Negative 3: 403 Forbidden with ERROR_REASON_PRIVILEGED_SESSION_REQUIRED DOES trigger Step-Up Auth', async () => {
      let stepUpTriggered = false;
      const unregister = onStepUpAuthRequired(({ resolve }) => {
        stepUpTriggered = true;
        resolve(); // simulate user entering privileged password/MFA
      });

      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                type: 'https://lemmo.space/errors/privileged-session',
                title: 'Forbidden',
                status: 403,
                detail: 'Privileged session required',
                reason: 'ERROR_REASON_PRIVILEGED_SESSION_REQUIRED',
              }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }
        // Second call (replay after step-up resolved):
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await liveSdkAdapter.workspaces.removeMember!('ws-test-100', 'usr-target');

      expect(stepUpTriggered).toBe(true);
      expect(callCount).toBe(2);

      unregister();
    });

    it('Negative 4: 404 Not Found throws PlatformApiError with reason WORKSPACE_NOT_FOUND', async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              type: 'https://lemmo.space/errors/workspace-not-found',
              title: 'Not Found',
              status: 404,
              detail: 'Workspace not found',
              reason: 'WORKSPACE_NOT_FOUND',
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      try {
        await liveSdkAdapter.workspaces.get!('ws-non-existent');
        expect.unreachable('Should have thrown PlatformApiError');
      } catch (err) {
        expect(err).toBeInstanceOf(PlatformApiError);
        const apiErr = err as PlatformApiError;
        expect(apiErr.status).toBe(404);
        expect(apiErr.envelope.reason).toBe('WORKSPACE_NOT_FOUND');
      }
    });

    it('Negative 5: Unauthenticated user guard throws fail-fast error without network call', async () => {
      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlStr = url.toString();
        if (urlStr.includes('/api/v1/me/context')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                user: { id: '' }, // empty unauthenticated user
                workspaces: [],
                entitlements: { tier: 'FREE', wallet_balance: 0, features: [] },
                onboarding: { completed: false, steps: {}, next_action: '' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }
        return Promise.reject(new Error('Should not make further network calls'));
      });

      await expect(
        liveSdkAdapter.user.updateProfile({ displayName: 'New Name' })
      ).rejects.toThrow('Unauthenticated user cannot update profile');
    });

    it('Negative 6: Session switch race condition discards in-flight request', async () => {
      global.fetch = vi.fn().mockImplementation(async () => {
        // Increment session generation while fetch is in-flight (e.g. user logged out or switched)
        incrementSessionGeneration();
        return new Response(
          JSON.stringify({
            members: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      });

      await expect(liveSdkAdapter.workspaces.getMembers!('ws-test-100')).rejects.toThrow(
        'Request discarded: session was terminated or switched during request.'
      );
    });
  });
});
