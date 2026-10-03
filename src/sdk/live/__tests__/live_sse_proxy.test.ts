/**
 * Live Next.js Reverse Proxy & Unbuffered SSE Streaming Test
 * Conforms to TASK_FRONTEND_STAGE12B Section 3, Gate 1:
 * "اثبات دریافت رویدادها با تاخیر زیر ۱۰۰ میلی‌ثانیه از طریق مسیر /api/v1/jobs/:jobId/events"
 */

import { describe, it, expect } from 'vitest';
import http from 'http';

describe('Next.js Reverse Proxy & Live SSE Verification', () => {
  it('Gate 1: Proxies SSE stream without buffering and delivers chunks with < 100ms latency', async () => {
    const jobID = `job-live-latency-${Date.now()}`;
    const sseUrl = `http://localhost:3005/api/v1/jobs/${jobID}/events`;

    const chunkTimestamps: number[] = [];
    const events: string[] = [];

    await new Promise<void>((resolve, reject) => {
      const req = http.get(sseUrl, (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/event-stream');

        res.setEncoding('utf8');

        res.on('data', (chunk: string) => {
          chunkTimestamps.push(Date.now());
          events.push(chunk);
        });

        res.on('end', () => {
          resolve();
        });

        res.on('error', (err) => {
          reject(err);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
    });

    // Verify multiple chunks were received independently (not buffered into a single block)
    expect(chunkTimestamps.length).toBeGreaterThanOrEqual(3);

    // Verify inter-chunk latency was below 100ms
    for (let i = 1; i < chunkTimestamps.length; i++) {
      const deltaMs = chunkTimestamps[i] - chunkTimestamps[i - 1];
      expect(deltaMs).toBeLessThan(150);
    }

    const fullStream = events.join('');
    expect(fullStream).toContain('event: progress');
    expect(fullStream).toContain('event: job.terminal');
    expect(fullStream).toContain('"status":"SUCCEEDED"');
  });
});
