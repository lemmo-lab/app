/**
 * Lemmo SDK Index — Single Network Client & Data Path Gateway.
 *
 * Conforms to:
 * - ADR-016 Sections 2.17, 2.21, 2.23 (Zero-Leakage & Client Zero-Mock Enforcement)
 * - ADR-013 Three-Tier Edge Gateway & BFF Architecture
 * - DOC-FE-002 Frontend Architecture & Data Flow Specification
 *
 * All data fetching across the entire frontend routes exclusively through this gateway.
 * Client-side mock adapters and in-memory simulated paths are strictly eradicated.
 * Requests route through Kong Edge Gateway to live backend services or Prism schema-driven mock.
 */

import type { SdkClient } from './types';
import { liveSdkAdapter } from './live/live-adapter';

export const sdk: SdkClient = liveSdkAdapter;

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
