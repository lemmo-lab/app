/**
 * Home Page — Redirects to /app
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/app');
}
