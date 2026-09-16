/**
 * Home Page — صفحه اصلی
 * ریدایرکت به استودیو چت به عنوان نقطه ورود پیش‌فرض
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/chat');
}
