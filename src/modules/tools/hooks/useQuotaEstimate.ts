import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@/sdk';

export interface UseQuotaEstimateParams {
  toolId?: string;
  modelId: string;
  width?: number;
  height?: number;
  steps?: number;
  numOutputs?: number;
  isByo?: boolean;
  debounceMs?: number;
  enabled?: boolean;
}

export function useQuotaEstimate({
  toolId = 'text-to-image',
  modelId,
  width = 1024,
  height = 1024,
  steps = 28,
  numOutputs = 1,
  isByo = false,
  debounceMs = 300,
  enabled = true,
}: UseQuotaEstimateParams) {
  const [debouncedParams, setDebouncedParams] = useState({
    toolId,
    modelId,
    width,
    height,
    steps,
    numOutputs,
    isByo,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({
        toolId,
        modelId,
        width,
        height,
        steps,
        numOutputs,
        isByo,
      });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [toolId, modelId, width, height, steps, numOutputs, isByo, debounceMs]);

  const query = useQuery({
    queryKey: ['quota-estimate', debouncedParams],
    queryFn: () => sdk.quota.estimate(debouncedParams),
    enabled: enabled && Boolean(debouncedParams.modelId),
    staleTime: 30_000,
  });

  return {
    // No fabricated fallback: when the estimate is unavailable the cost is
    // unknown (null), never a made-up number.
    estimatedCredits: query.data?.estimatedCredits ?? null,
    rateCardVersion: query.data?.rateCardVersion ?? null,
    breakdown: query.data?.breakdown,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
}
