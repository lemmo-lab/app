/**
 * SDK Index — گلوگاه متمرکز داده‌رسانی
 *
 * تنها فرم مجاز مصرف داده در کل فرانت‌اند:
 *   import { sdk } from '@/sdk';
 *   const result = await sdk.tools.list();
 *
 * سوئیچ تک‌نقطه‌ای بر اساس NEXT_PUBLIC_API_MODE:
 *   - 'mock' (پیش‌فرض توسعه): MockAdapter با داده‌های شبیه‌سازی‌شده
 *   - 'live': LiveAdapter برای اتصال به سرور واقعی (M9)
 *
 * هیچ کدی خارج از این فایل نباید از mock/ یا live/ ایمپورت کند.
 */

import type { SdkClient } from './types';
import { mockSdkAdapter } from './mock/mock-adapter';

const isLiveMode =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_API_MODE === 'live';

// در M9: import { liveSdkAdapter } from './live/live-adapter';
// const sdk: SdkClient = isLiveMode ? liveSdkAdapter : mockSdkAdapter;

export const sdk: SdkClient = isLiveMode
  ? (mockSdkAdapter as SdkClient) // placeholder تا M9
  : mockSdkAdapter;

export type { SdkClient } from './types';
