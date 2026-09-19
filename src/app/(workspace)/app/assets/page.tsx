/**
 * Assets Index Page — Production Implementation
 * Route: /app/assets
 *
 * Fully modular implementation rendering AssetsManager conforming to:
 * - DOC-FE-001 (Workspace Frontend Architecture)
 * - app/.wireframe/Assets/assets.html
 * - Complete token coverage from @lemmo-lab/tokens
 */

import React from 'react';
import type { Metadata } from 'next';
import { AssetsManager } from '@/modules/assets';

export const metadata: Metadata = {
  title: 'Assets & Media Library',
  description: 'Manage, search, and remix your generated creations, studio outputs, and uploaded assets.',
};

export default function AssetsPage() {
  return <AssetsManager initialEmpty={false} />;
}
