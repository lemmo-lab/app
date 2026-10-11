/**
 * Stage 17B Verification: Feed & Discovery Showcase Live Integration Tests
 *
 * Verifies:
 * - FEED-CHK-1: Keyset cursor-based pagination enforcement (cursor & limit, strictly never page)
 * - FEED-CHK-2: Single network gateway routing through @/sdk (Zero-Client-Mock)
 * - FEED-CHK-3: Content service integration (/api/v1/content) structure
 * - Category filter query propagation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sdk } from '@/sdk';
import { setTransportContext } from '@/sdk/live/transport';

describe('Stage 17B: Feed, Showcase & Content Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setTransportContext('ws-stage17b-test', 1);
  });

  describe('FEED-CHK-1 & FEED-CHK-2: Keyset Cursor Pagination & Gateway Routing', () => {
    it('calls /api/v1/feed with cursor and limit, strictly omitting page parameter', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        // Invariant check: URL must never include page
        expect(urlStr).not.toContain('page=');
        expect(urlStr).toContain('/api/v1/feed');
        expect(urlStr).toContain('limit=24');
        expect(urlStr).toContain('cursor=cur_12345');
        expect(urlStr).toContain('category=photoreal');

        return new Response(
          JSON.stringify({
            items: [
              {
                id: 'feed-item-1',
                title: 'Cyberpunk Skyline',
                titleFa: 'افق سایبرپانک',
                prompt: 'Futuristic city glowing with neon reflections',
                image: 'https://example.com/item1.webp',
                author: 'Sora',
                authorHandle: 'sora_ai',
                avatar: 'SO',
                category: 'photoreal',
                aspectRatio: '16:9',
                width: 1920,
                height: 1080,
                likes: 120,
                views: 540,
                model: 'Flux Dev',
                createdAt: '2026-10-11T12:00:00Z',
              },
            ],
            next_cursor: 'cur_67890',
            has_more: true,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      });

      const result = await sdk.feed.list({
        category: 'photoreal',
        limit: 24,
        cursor: 'cur_12345',
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('feed-item-1');
      expect(result.next_cursor).toBe('cur_67890');
      expect(result.has_more).toBe(true);
    });

    it('fetches single feed item by ID via /api/v1/feed/:id', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        expect(urlStr).toContain('/api/v1/feed/feed-item-42');

        return new Response(
          JSON.stringify({
            id: 'feed-item-42',
            title: 'Isometric Citadel',
            titleFa: 'دژ ایزومتریک',
            prompt: 'Detailed 3D architectural render',
            image: 'https://example.com/item42.webp',
            author: 'Aras',
            authorHandle: 'aras_3d',
            avatar: 'AR',
            category: 'architecture',
            aspectRatio: '1:1',
            width: 1024,
            height: 1024,
            likes: 85,
            views: 310,
            model: 'SDXL Turbo',
            createdAt: '2026-10-11T12:00:00Z',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      });

      const item = await sdk.feed.get('feed-item-42');
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(item.id).toBe('feed-item-42');
      expect(item.category).toBe('architecture');
      expect(item.model).toBe('SDXL Turbo');
    });
  });

  describe('FEED-CHK-3: Content Service Live Integration (/api/v1/content)', () => {
    it('retrieves featured banners and quick tools from /api/v1/content', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        expect(url.toString()).toContain('/api/v1/content');

        return new Response(
          JSON.stringify({
            featured: [
              {
                id: 'banner-1',
                title: 'Lemmo Diffusion 4.5 Turbo',
                titleFa: 'موتور لمو توربو ۴.۵',
                prompt: 'Ultra-fast 4K generation under 3 seconds',
                promptFa: 'تولید سریع با کیفیت ۴K',
                image: 'https://example.com/banner1.webp',
                author: 'Lemmo Team',
                model: 'turbo',
                aspectRatio: '16:9',
                remixCount: 1520,
                likes: 4200,
              },
            ],
            quick_tools: [
              {
                id: 'bg-remove',
                name: 'Background Remover',
                nameFa: 'حذف پس‌زمینه',
                category: 'Utility',
                categoryFa: 'ابزارها',
                description: 'Instant clean cutout',
                descriptionFa: 'برش دقیق سوژه',
                image: 'https://example.com/tool1.webp',
                href: '/app/tools/bg-remover',
                badge: 'Fast',
                isNew: true,
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      });

      const content = await sdk.content.get();
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(content.featured).toHaveLength(1);
      expect(content.featured[0].id).toBe('banner-1');
      expect(content.quick_tools).toHaveLength(1);
      expect(content.quick_tools[0].id).toBe('bg-remove');
    });
  });
});
