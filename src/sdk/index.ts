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
import { liveSdkAdapter } from './live/live-adapter';

const isLiveMode =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_API_MODE === 'live';

export const sdk: SdkClient = isLiveMode ? liveSdkAdapter : mockSdkAdapter;

export {
  setTransportContext,
  incrementSessionGeneration,
  getActiveWorkspaceId,
  getSessionGenerationId,
  onStepUpAuthRequired,
  onSignedOut,
  scheduleProactiveRefresh,
  cancelProactiveRefresh,
  type StepUpAuthRequest,
} from './live/transport';

export type { SdkClient } from './types';
export * from './types';
export * from './errors';
export * from './node';

