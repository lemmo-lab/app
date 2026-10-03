'use client';

/**
 * StudioProviders — Root Provider Hierarchy & 4-Layer Multi-Tenant Cache Isolation
 *
 * Conforms to:
 * - ADR-016 Section 2.18: 4-Layer Cache Isolation Defense
 * - ADR-016 Section 2.6: 6-State Studio Context Machine
 * - TASK_FRONTEND_STAGE12B: Section 2.6
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudioContextProvider, useStudioContext } from './StudioContextProvider';
import { DirectionProvider } from '@/shared/ui/primitives/DirectionProvider';
import { StepUpAuthModal } from '@/shared/components/StepUpAuthModal';

/**
 * Subtree isolation wrapper.
 * Layer 4: Remounts child tree on sessionGenerationId change.
 */
function IsolatedSubtree({ children }: { children: React.ReactNode }) {
  const { sessionGenerationId } = useStudioContext();

  return (
    <div key={sessionGenerationId} className="contents">
      {children}
    </div>
  );
}

export function StudioProviders({ children }: { children: React.ReactNode }) {
  // Layer 1: Component-scoped QueryClient instance (never a module singleton)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            retry: (failureCount, error) => {
              // Never retry on 401 or 403
              const status = (error as { status?: number })?.status;
              if (status === 401 || status === 403) return false;
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StudioContextProvider>
        <DirectionProvider>
          <IsolatedSubtree>{children}</IsolatedSubtree>
          <StepUpAuthModal />
        </DirectionProvider>
      </StudioContextProvider>
    </QueryClientProvider>
  );
}
