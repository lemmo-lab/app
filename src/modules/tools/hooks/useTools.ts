import { useQuery } from '@tanstack/react-query';
import { sdk } from '@/sdk';
import type { ToolManifest } from '@/sdk/types';

export function useTools() {
  return useQuery<ToolManifest[]>({
    queryKey: ['tools'],
    queryFn: () => sdk.tools.list(),
    staleTime: 60_000,
  });
}
