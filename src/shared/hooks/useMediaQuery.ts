/**
 * useMediaQuery — هوک واکنش‌گرایی برای بریک‌پوینت‌های تعریف‌شده در ROADMAP
 */

'use client';

import { useEffect, useState } from 'react';

/** بریک‌پوینت‌های استاندارد پروژه */
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

/** هوک‌های آماده برای بریک‌پوینت‌های رایج */
export function useIsMobile() {
  return useMediaQuery(BREAKPOINTS.mobile);
}
export function useIsTablet() {
  return useMediaQuery(BREAKPOINTS.tablet);
}
export function useIsDesktop() {
  return useMediaQuery(BREAKPOINTS.desktop);
}
