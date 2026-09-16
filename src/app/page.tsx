/**
 * Home Page — Redirects to the default studio entry point (/chat).
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/chat');
}
