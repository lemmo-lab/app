/**
 * useMediaQuery — Responsive breakpoint hook for standard Lemmo screen sizes.
 */

'use client';

import { useEffect, useState } from 'react';

/** Standard project breakpoints as defined in the ROADMAP */
export const BREAKPOINTS = {
  mobile: '(max-width: 47.9375rem)',    // < 768px
  tablet: '(min-width: 48rem)',          // >= 768px
  desktop: '(min-width: 80rem)',         // >= 1280px
  wide: '(min-width: 120rem)',           // >= 1920px
} as const;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
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
