'use client';

/**
 * StudioAuthGuard — Studio Session Gate & Shield
 *
 * Conforms to:
 * - ADR-016 Section 2.6: 6-State Context Machine Enforcement
 * - ADR-016 Section 2.11: Per-request SSR isolation & Auth Redirection
 * - GUARD-CHK-1: Fail-Closed on Unauthenticated state
 * - GUARD-CHK-2: Full Skeleton on Loading State
 */

import { useUiStore } from '@/stores/uiStore';
import { contextErrors } from '@/shared/locales/contextErrors';
import { PlatformApiError } from '@/sdk';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStudioContext } from './StudioContextProvider';

export function StudioAuthGuard({ children }: { children: React.ReactNode }) {
  const { state, error, retry } = useStudioContext();
  const pathname = usePathname();
  const locale = useUiStore((store) => store.locale);
  const copy = contextErrors[locale === 'fa' ? 'fa' : 'en'];
  const unavailable = error instanceof PlatformApiError && error.status === 503;
  const unavailableMessage = error instanceof PlatformApiError && error.reason === 'ERROR_REASON_USER_RECORD_NOT_FOUND'
    ? copy.missingUser : copy.connecting;

  useEffect(() => {
    if (state === 'signed-out') {
      const baseAuthUrl =
        process.env.NEXT_PUBLIC_AUTH_URL ||
        (typeof window !== 'undefined'
          ? `${window.location.protocol}//${window.location.hostname}:3001`
          : 'http://localhost:3001');

      const fullAuthUrl = new URL('/auth/entry', baseAuthUrl);
      if (typeof window !== 'undefined') {
        fullAuthUrl.searchParams.set('return_to', window.location.href);
        window.location.assign(fullAuthUrl.toString());
      }
    }
  }, [state, pathname]);

  if (state === 'loading' || state === 'uninitialized') {
    return (
      <div className="studio-auth-loading-screen" role="status" aria-live="polite">
        <div className="studio-spinner" />
        <p className="loading-label">Initializing secure session...</p>
        <style jsx>{`
          .studio-auth-loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100dvh;
            width: 100%;
            background: var(--lemmo-page-background, #131517);
            color: var(--lemmo-text-primary, #e1e1e3);
            font-family: inherit;
          }
          .studio-spinner {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2.5px solid rgba(255, 255, 255, 0.08);
            border-top-color: var(--lemmo-surface-brand-background, #d1fe17);
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }
          .loading-label {
            font-size: 0.875rem;
            color: var(--lemmo-text-secondary, #a1a1a5);
            margin: 0;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (state === 'signed-out') {
    return (
      <div className="studio-auth-redirecting-screen" role="status" aria-live="polite">
        <div className="studio-spinner" />
        <p className="redirect-label">Redirecting to secure login...</p>
        <style jsx>{`
          .studio-auth-redirecting-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100dvh;
            width: 100%;
            background: var(--lemmo-page-background, #131517);
            color: var(--lemmo-text-primary, #e1e1e3);
            font-family: inherit;
          }
          .studio-spinner {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2.5px solid rgba(255, 255, 255, 0.08);
            border-top-color: var(--lemmo-surface-brand-background, #d1fe17);
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }
          .redirect-label {
            font-size: 0.875rem;
            color: var(--lemmo-text-secondary, #a1a1a5);
            margin: 0;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="studio-auth-error-screen" role="alert">
        <div className="error-card">
          <h3 className="error-heading">{unavailable ? copy.title : 'Connection Error'}</h3>
          <p className="error-label">
            {unavailable ? unavailableMessage : error?.message || 'Unable to connect to platform services.'}
          </p>
          <button
            type="button"
            className="btn-retry"
            onClick={() => void retry()}
          >
            {copy.retry}
          </button>
        </div>
        <style jsx>{`
          .studio-auth-error-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100dvh;
            width: 100%;
            background: var(--lemmo-page-background, #131517);
            padding: 24px;
            box-sizing: border-box;
          }
          .error-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 400px;
            padding: 32px 24px;
            border-radius: var(--lemmo-radius-xl, 16px);
            background: var(--lemmo-surface-primary-background, #1c1e20);
            border: 1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          }
          .error-heading {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--lemmo-text-primary, #e1e1e3);
            margin: 0 0 8px 0;
          }
          .error-label {
            font-size: 0.875rem;
            color: var(--lemmo-text-secondary, #a1a1a5);
            margin: 0 0 24px 0;
            line-height: 1.5;
          }
          .btn-retry {
            height: 38px;
            padding: 0 20px;
            background: var(--lemmo-surface-brand-background, #d1fe17);
            color: var(--lemmo-surface-brand-foreground, #0d0e0f);
            border: none;
            border-radius: var(--lemmo-radius-pill, 9999px);
            font-weight: 600;
            font-size: 0.8125rem;
            cursor: pointer;
            transition: opacity 0.15s ease;
          }
          .btn-retry:hover {
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
