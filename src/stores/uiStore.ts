/**
 * uiStore — Global UI state store
 * Manages the active locale (fa/en) and text direction (rtl/ltr)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'fa' | 'en';
export type Direction = 'rtl' | 'ltr';
export type DefaultWorkspace = 'agent' | 'canvas';

interface UiState {
  locale: Locale;
  dir: Direction;
  defaultWorkspace: DefaultWorkspace;
  /** Set locale and direction simultaneously */
  setLocale: (locale: Locale) => void;
  /** Toggle between 'fa' and 'en' */
  toggleLocale: () => void;
  /** Set default workspace mode (agent or canvas) */
  setDefaultWorkspace: (ws: DefaultWorkspace) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'en',
      dir: 'ltr',
      defaultWorkspace: 'agent',

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

      setDefaultWorkspace: (defaultWorkspace) => {
        set({ defaultWorkspace });
      },
    }),
    {
      name: 'lemmo-ui-store',
      partialize: (state) => ({
        locale: state.locale,
        dir: state.dir,
        defaultWorkspace: state.defaultWorkspace,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.dir = state.locale === 'fa' ? 'rtl' : 'ltr';
          if (typeof document !== 'undefined') {
            document.documentElement.lang = state.locale;
            document.documentElement.dir = state.dir;
            document.documentElement.setAttribute('data-locale', state.locale);
          }
        }
      },
    }
  )
);
