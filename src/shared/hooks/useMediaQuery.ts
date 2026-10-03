/**
 * useMediaQuery — Responsive breakpoint hook for standard Lemmo screen sizes.
 */

'use client';

import { useSyncExternalStore } from 'react';

/** Standard project breakpoints as defined in the ROADMAP */
export const BREAKPOINTS = {
  mobile: '(max-width: 47.9375rem)',    // < 768px
  tablet: '(min-width: 48rem)',          // >= 768px
  desktop: '(min-width: 80rem)',         // >= 1280px
  wide: '(min-width: 120rem)',           // >= 1920px
} as const;

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    () => false
  );
}

/** Convenience hooks for common breakpoints */
export function useIsMobile() {
  return useMediaQuery(BREAKPOINTS.mobile);
}
export function useIsTablet() {
  return useMediaQuery(BREAKPOINTS.tablet);
}
export function useIsDesktop() {
  return useMediaQuery(BREAKPOINTS.desktop);
}
