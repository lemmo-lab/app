/**
 * useDirection — Hook for reading the current text direction from the UI store.
 * Use in components that need to respond to RTL/LTR changes.
 */

'use client';

import { useUiStore } from '@/stores/uiStore';

export function useDirection() {
  const dir = useUiStore((s) => s.dir);
  const locale = useUiStore((s) => s.locale);
  const isRtl = dir === 'rtl';
  const isLtr = dir === 'ltr';

  return { dir, locale, isRtl, isLtr };
}
