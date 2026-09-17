/**
 * uiStore — Global UI state store
 * Manages the active locale (fa/en) and text direction (rtl/ltr)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'fa' | 'en';
export type Direction = 'rtl' | 'ltr';

interface UiState {
  locale: Locale;
  dir: Direction;
  /** Set locale and direction simultaneously */
  setLocale: (locale: Locale) => void;
  /** Toggle between 'fa' and 'en' */
  toggleLocale: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'en',
      dir: 'ltr',

      setLocale: (locale) => {
        set({ locale, dir: locale === 'fa' ? 'rtl' : 'ltr' });
        // Update html attributes directly without triggering a full re-render
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
          document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
          document.documentElement.setAttribute('data-locale', locale);
        }
      },

      toggleLocale: () => {
        set((state) => {
          const next: Locale = state.locale === 'fa' ? 'en' : 'fa';
          const nextDir: Direction = next === 'fa' ? 'rtl' : 'ltr';
          if (typeof document !== 'undefined') {
            document.documentElement.lang = next;
            document.documentElement.dir = nextDir;
            document.documentElement.setAttribute('data-locale', next);
          }
          return { locale: next, dir: nextDir };
        });
      },
    }),
    {
      name: 'lemmo-ui-store',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
