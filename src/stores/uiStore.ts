/**
 * uiStore — استور سراسری رابط کاربری
 * مدیریت زبان فعال (fa/en) و جهت‌بندی (rtl/ltr)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'fa' | 'en';
export type Direction = 'rtl' | 'ltr';

interface UiState {
  locale: Locale;
  dir: Direction;
  /** تغییر زبان و جهت‌بندی به‌صورت هم‌زمان */
  setLocale: (locale: Locale) => void;
  /** toggle سریع بین فارسی و انگلیسی */
  toggleLocale: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'fa',
      dir: 'rtl',

      setLocale: (locale) => {
        set({ locale, dir: locale === 'fa' ? 'rtl' : 'ltr' });
        // تنظیم مستقیم تگ html بدون نیاز به re-render کامل
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
          document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
          document.documentElement.setAttribute(
            'data-locale',
            locale
          );
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
