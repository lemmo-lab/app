/**
 * SDK Index — Centralized data access bottleneck.
 *
 * The ONLY permitted way to consume data anywhere in the frontend:
 *   import { sdk } from '@/sdk';
 *   const result = await sdk.tools.list();
 *
 * Single-switch migration via NEXT_PUBLIC_API_MODE:
 *   - 'mock' (default during development): MockAdapter with simulated data
 *   - 'live': LiveAdapter connecting to the real backend (M9)
 *
 * No code outside this file may import from mock/ or live/.
 */

import type { SdkClient } from './types';
import { mockSdkAdapter } from './mock/mock-adapter';

const isLiveMode =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_API_MODE === 'live';

// M9: import { liveSdkAdapter } from './live/live-adapter';
// const sdk: SdkClient = isLiveMode ? liveSdkAdapter : mockSdkAdapter;

export const sdk: SdkClient = isLiveMode
  ? (mockSdkAdapter as SdkClient) // placeholder until M9
  : mockSdkAdapter;

export type { SdkClient } from './types';
