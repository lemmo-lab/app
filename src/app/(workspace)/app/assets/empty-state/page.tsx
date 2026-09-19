/**
 * Assets Empty State Page — Production Implementation
 * Route: /app/assets/empty-state
 *
 * Dedicated route rendering the AssetsManager in empty state conforming to:
 * - DOC-FE-001 (Workspace Frontend Architecture)
 * - app/.wireframe/Assets/assets-empty.html
 * - 100% tokens from @lemmo-lab/tokens
 */

import React from 'react';
import type { Metadata } from 'next';
import { AssetsManager } from '@/modules/assets';

export const metadata: Metadata = {
  title: 'Assets (Empty State)',
  description: 'Your media library is currently empty. Generate your first creation in the Studio.',
};

export default function AssetsEmptyStatePage() {
  return <AssetsManager initialEmpty={true} />;
}
