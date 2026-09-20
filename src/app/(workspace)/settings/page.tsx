/**
 * Settings Page — Unified Settings Module for Lemmo Studio.
 * Clean, component-based architecture built with @lemmo-lab/tokens.
 */

'use client';

import React, { Suspense } from 'react';
import { SettingsLayout } from '@/modules/settings';

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="settings-page-loading" />}>
      <SettingsLayout />

      <style jsx>{`
        .settings-page-loading {
          width: 100%;
          height: 100%;
          background: var(--lemmo-page-background, #131517);
        }
      `}</style>
    </Suspense>
  );
}
