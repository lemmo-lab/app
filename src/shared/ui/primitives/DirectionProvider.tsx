/**
 * DirectionProvider — کامپوننت کلاینت برای مدیریت پویای جهت‌بندی RTL/LTR
 *
 * این کامپوننت:
 * ۱. زبان ذخیره‌شده در localStorage را هنگام mount می‌خواند
 * ۲. تگ <html> را با dir/lang/data-locale صحیح به‌روز می‌کند
 * ۳. در هر تغییر locale از استور، HTML را واکنش‌گرا به‌روز می‌کند
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
