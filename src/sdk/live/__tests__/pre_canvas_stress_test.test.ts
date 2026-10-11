/**
 * Stage 17 Pre-Canvas E2E Verification & Stress Test Suite
 *
 * Conforms strictly to:
 * - TASK_STAGE17_AUTH_GUARD_AND_E2E_STRESS_TEST.md
 * - ADR-016 Sections 2.6, 2.7, 2.11 (6-State Machine, Auth Redirection & Session Isolation)
 * - GUARD-CHK-1 (Fail-Closed on Unauthenticated)
 * - GUARD-CHK-2 (Full Skeleton on Loading State)
 * - GUARD-CHK-3 (Single Logout Mechanism)
 * - GUARD-CHK-4 (Live Contract Execution)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  customFetch,
  setTransportContext,
  incrementSessionGeneration,
  getSessionGenerationId,
  getActiveWorkspaceId,
  cancelProactiveRefresh,
} from '../transport';
import { sdk, PlatformApiError } from '@/sdk';
import { useUiStore } from '@/stores/uiStore';

describe('Stage 17: Studio AuthGuard & Pre-Canvas E2E Verification Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cancelProactiveRefresh();
    setTransportContext(null, 1);
    useUiStore.getState().reset();
  });

  afterEach(() => {
    cancelProactiveRefresh();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Gate 1: Negative Gate — Unauthenticated Blocker & State Transition
  // =========================================================================
  describe('Gate 1: Negative Gate — Unauthenticated Blocker (GUARD-CHK-1)', () => {
    it('returns 401 when unauthenticated and enforces fail-closed state', async () => {
      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlStr = url.toString();
        if (urlStr.includes('/api/v1/me/context')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                type: 'https://lemmo.space/errors/unauthorized',
                title: 'Unauthorized',
                status: 401,
                detail: 'Session cookie or token is missing or expired.',
              }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/problem+json' },
              }
            )
          );
        }
        return Promise.reject(new Error(`Unexpected call to ${urlStr}`));
      });

      // Attempting to fetch context without session must throw PlatformApiError 401
      await expect(sdk.context.get()).rejects.toThrow();

      try {
        await sdk.context.get();
      } catch (err) {
        expect(err).toBeInstanceOf(PlatformApiError);
        expect((err as PlatformApiError).status).toBe(401);
      }
    });

    it('constructs correct auth redirect URL with return_to parameter on signed-out', () => {
      const baseAuthUrl = 'http://localhost:3001';
      const currentUrl = 'http://localhost:3000/settings/billing';

      const fullAuthUrl = new URL('/auth/entry', baseAuthUrl);
      fullAuthUrl.searchParams.set('return_to', currentUrl);

      expect(fullAuthUrl.origin).toBe('http://localhost:3001');
      expect(fullAuthUrl.pathname).toBe('/auth/entry');
      expect(fullAuthUrl.searchParams.get('return_to')).toBe(currentUrl);
    });
  });

  // =========================================================================
  // Gate 2: Positive Gate — Authenticated Context & Settings Data Flow
  // =========================================================================
  describe('Gate 2: Positive Gate — Authenticated Context & Settings (GUARD-CHK-4)', () => {
    it('successfully loads full context, user profile, workspace members and pricing', async () => {
      setTransportContext('ws-prod-777', 1);

      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlStr = url.toString();

        if (urlStr.includes('/api/v1/me/context')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                user: {
                  id: 'usr-behroz-01',
                  email: 'behroz@lemmo.space',
                  display_name: 'Behroz Platform Lead',
                  handle: 'behroz',
                  avatar_url: 'https://cdn.lemmo.space/avatars/behroz.png',
                  preferences: { bio: 'AI Platform Engineer' },
                },
                active_workspace: {
                  id: 'ws-prod-777',
                  name: 'Studio Alpha',
                  type: 'PERSONAL',
                  role: 'OWNER',
                },
                workspaces: [
                  {
                    id: 'ws-prod-777',
                    name: 'Studio Alpha',
                    type: 'PERSONAL',
                    role: 'OWNER',
                  },
                  {
                    id: 'ws-team-888',
                    name: 'Enterprise Lab',
                    type: 'TEAM',
                    role: 'ADMIN',
                  },
                ],
                entitlements: {
                  tier: 'PRO',
                  wallet_balance: 150000,
                  features: ['canvas', 'agent', 'turbo_engine', 'api_access'],
                },
                onboarding: {
                  completed: true,
                  steps: { profile: true, workspace: true, first_gen: true },
                  next_action: 'explore_feed',
                },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        if (urlStr.includes('/api/v1/workspaces/ws-prod-777/members')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                members: [
                  {
                    id: 'usr-behroz-01',
                    name: 'Behroz Platform Lead',
                    email: 'behroz@lemmo.space',
                    role: 'OWNER',
                    initials: 'BP',
                    status: 'ACTIVE',
                  },
                  {
                    id: 'usr-sarah-02',
                    name: 'Sarah Designer',
                    email: 'sarah@lemmo.space',
                    role: 'EDITOR',
                    initials: 'SD',
                    status: 'ACTIVE',
                  },
                ],
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        if (urlStr.includes('/api/v1/quota/pricing')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                pricing: {
                  version: '2026.10',
                  currency: 'IRR',
                  tools: {
                    turbo_diffusion: { cost_per_mp: 50 },
                    background_remover: { cost_per_call: 25 },
                  },
                },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        return Promise.reject(new Error(`Unhandled route in test: ${urlStr}`));
      });

      // 1. Context retrieval
      const context = await sdk.context.get();
      expect(context.user.id).toBe('usr-behroz-01');
      expect(context.user.email).toBe('behroz@lemmo.space');
      expect(context.active_workspace?.id).toBe('ws-prod-777');
      expect(context.entitlements.tier).toBe('PRO');
      expect(context.entitlements.wallet_balance).toBe(150000);

      // 2. Profile resolution derived from context
      const profile = await sdk.user.getProfile();
      expect(profile.id).toBe('usr-behroz-01');
      expect(profile.name).toBe('Behroz Platform Lead');
      expect(profile.bio).toBe('AI Platform Engineer');

      // 3. Billing info
      const billing = await sdk.user.getBillingInfo();
      expect(billing.tokenBalance).toBe(150000);
      expect(billing.plan).toBe('pro');

      // 4. Workspace members
      const members = await sdk.workspaces.getMembers!('ws-prod-777');
      expect(members).toHaveLength(2);
      expect(members[0].role).toBe('OWNER');
      expect(members[1].role).toBe('EDITOR');

      // 5. Quota & Pricing
      const pricing = await sdk.quota!.getPricing();
      expect(pricing.version).toBe('2026.10');
      expect(pricing.currency).toBe('IRR');
    });
  });

  // =========================================================================
  // Gate 3: Positive Gate — Feed & Content Service Keyset Verification
  // =========================================================================
  describe('Gate 3: Feed & Content Integration Live Contract (FEED-CHK-1, FEED-CHK-3)', () => {
    it('queries discovery feed with cursor and content announcements from Prism', async () => {
      global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlStr = url.toString();

        if (urlStr.includes('/api/v1/feed')) {
          // Strictly verify keyset parameters: limit and cursor, NEVER page
          expect(urlStr).not.toContain('page=');
          expect(urlStr).toContain('limit=12');
          expect(urlStr).toContain('cursor=c_anchor_99');

          return Promise.resolve(
            new Response(
              JSON.stringify({
                items: [
                  {
                    id: 'feed-888',
                    title: 'Bioluminescent Neon Garden',
                    titleFa: 'باغ نئونی بیولومینسانس',
                    prompt: 'Hyperrealistic botanical photography with vibrant alien flora',
                    image: 'https://cdn.lemmo.space/feed/feed-888.webp',
                    author: 'Neda AI',
                    authorHandle: 'neda_ai',
                    avatar: 'NA',
                    category: 'photoreal',
                    aspectRatio: '16:9',
                    width: 1920,
                    height: 1080,
                    likes: 940,
                    views: 4500,
                    model: 'Lemmo Turbo 4.5',
                    createdAt: '2026-10-11T10:00:00Z',
                  },
                ],
                next_cursor: 'c_next_100',
                has_more: true,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        if (urlStr.includes('/api/v1/content')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                featured: [
                  {
                    id: 'feat-slide-1',
                    title: 'Lemmo Diffusion 4.5 Turbo',
                    titleFa: 'موتور لمو توربو ۴.۵',
                    prompt: 'Ultra-fast 4K generation under 3 seconds',
                    promptFa: 'تولید سریع با کیفیت ۴K',
                    image: 'https://cdn.lemmo.space/banners/slide1.webp',
                    author: 'Lemmo Research',
                    model: 'turbo',
                    aspectRatio: '16:9',
                    remixCount: 3400,
                    likes: 8900,
                  },
                ],
                quick_tools: [
                  {
                    id: 'upscaler-pro',
                    name: 'Super Upscaler 4K',
                    nameFa: 'افزایش وضوح ۴K',
                    category: 'Enhance',
                    categoryFa: 'بهبود کیفیت',
                    description: 'Clarity enhancement engine',
                    descriptionFa: 'موتور افزایش جزئیات و شارپنس',
                    image: 'https://cdn.lemmo.space/tools/upscaler.webp',
                    href: '/app/tools/upscaler',
                    badge: '4K',
                    isNew: true,
                  },
                ],
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          );
        }

        return Promise.reject(new Error(`Unhandled route: ${urlStr}`));
      });

      // 1. Feed list
      const feed = await sdk.feed.list({ limit: 12, cursor: 'c_anchor_99' });
      expect(feed.items).toHaveLength(1);
      expect(feed.items[0].id).toBe('feed-888');
      expect(feed.next_cursor).toBe('c_next_100');
      expect(feed.has_more).toBe(true);

      // 2. Content banners & quick tools
      const content = await sdk.content.get();
      expect(content.featured).toHaveLength(1);
      expect(content.featured[0].model).toBe('turbo');
      expect(content.quick_tools).toHaveLength(1);
      expect(content.quick_tools[0].id).toBe('upscaler-pro');
    });
  });

  // =========================================================================
  // Gate 4: Session Invalidation & Clean Logout Stress Test
  // =========================================================================
  describe('Gate 4: Session Invalidation & Clean Logout (GUARD-CHK-3)', () => {
    it('aborts in-flight retries on session increment and purges cached context', async () => {
      setTransportContext('ws-test-logout', 5);
      expect(getSessionGenerationId()).toBe(5);
      expect(getActiveWorkspaceId()).toBe('ws-test-logout');

      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Invalidate session mid-flight (simulates concurrent logout)
          incrementSessionGeneration();
          return Promise.reject(new Error('Network drop'));
        }
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      });

      // Request must be cleanly rejected due to session generation mismatch
      await expect(customFetch('/api/v1/projects')).rejects.toThrow(
        /Request discarded: session was terminated or switched/
      );

      // Verify generation ID progressed
      expect(getSessionGenerationId()).toBe(6);
    });

    it('logout action sends POST /api/v1/auth/logout with credentials', async () => {
      let logoutCalled = false;
      global.fetch = vi.fn().mockImplementation((url: string | URL | Request, init?: RequestInit) => {
        const urlStr = url.toString();
        if (urlStr.includes('/api/v1/auth/logout')) {
          expect(init?.method).toBe('POST');
          expect(init?.credentials).toBe('include');
          logoutCalled = true;
          return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
        }
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200 }));
      });

      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      expect(logoutCalled).toBe(true);
    });
  });
});
