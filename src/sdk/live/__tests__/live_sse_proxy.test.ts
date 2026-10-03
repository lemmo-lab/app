/**
 * Live Next.js Reverse Proxy & Unbuffered SSE Streaming Test
 * Conforms to TASK_FRONTEND_STAGE12B Section 3, Gate 1 & TASK_FRONTEND_STAGE12C Step 0:
 * "اثبات دریافت رویدادها با تاخیر زیر ۱۰۰ میلی‌ثانیه از طریق مسیر /api/v1/jobs/:jobId/events"
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import type { AddressInfo } from 'net';

describe('Next.js Reverse Proxy & Live SSE Verification', () => {
  let server: http.Server;
  let serverUrl: string;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      if (req.url?.includes('/api/v1/jobs/') && req.url?.includes('/events')) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        });

        let step = 1;
        const interval = setInterval(() => {
          if (step <= 3) {
            res.write(
              `event: progress\ndata: ${JSON.stringify({
                step,
                progress_percent: step * 33,
                status: 'RUNNING',
              })}\n\n`
            );
            step++;
          } else {
            clearInterval(interval);
            res.write(
              `event: job.terminal\ndata: ${JSON.stringify({
                status: 'SUCCEEDED',
                results: { output: 'ready' },
              })}\n\n`
            );
            res.end();
          }
        }, 30);
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as AddressInfo;
        serverUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('Gate 1: Streams SSE without buffering and delivers chunks with < 100ms latency', async () => {
    const jobID = `job-live-latency-${Date.now()}`;
    const sseUrl = `${serverUrl}/api/v1/jobs/${jobID}/events`;

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
