/**
 * DirectionProvider — Client component for dynamic RTL/LTR direction management.
 *
 * Responsibilities:
 * 1. Reads the persisted locale from localStorage on mount.
 * 2. Syncs the <html> element's dir, lang, and data-locale attributes.
 * 3. Reacts to any locale change in the UI store and updates the DOM accordingly.
 */

'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';

interface DirectionProviderProps {
  children: React.ReactNode;
}

export function DirectionProvider({ children }: DirectionProviderProps) {
  const { locale, dir } = useUiStore();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    root.setAttribute('data-locale', locale);
  }, [locale, dir]);

  return <>{children}</>;
}
