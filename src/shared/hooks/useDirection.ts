/**
 * useDirection — هوک خواندن جهت‌بندی جاری از استور
 * استفاده در کامپوننت‌هایی که باید به RTL/LTR واکنش نشان دهند
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
