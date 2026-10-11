'use client';

/**
 * Login Page — Authentication entry redirector.
 * Immediately forwards client to the auth micro-frontend (lemmo-auth) with return_to.
 */

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const baseAuthUrl =
      process.env.NEXT_PUBLIC_AUTH_URL ||
      (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : 'http://localhost:3001');

    const fullAuthUrl = new URL('/auth/entry', baseAuthUrl);
    const returnTo =
      searchParams?.get('return_to') ||
      (typeof window !== 'undefined' ? `${window.location.origin}/app` : '/app');

    fullAuthUrl.searchParams.set('return_to', returnTo);

    if (typeof window !== 'undefined') {
      window.location.assign(fullAuthUrl.toString());
    }
  }, [searchParams]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: 'var(--lemmo-page-background, #131517)',
        color: 'var(--lemmo-text-primary, #e1e1e3)',
        fontFamily: 'inherit',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '2.5px solid rgba(255, 255, 255, 0.08)',
          borderTopColor: 'var(--lemmo-surface-brand-background, #d1fe17)',
          animation: 'loginSpin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      />
      <p style={{ fontSize: '0.875rem', color: 'var(--lemmo-text-secondary, #a1a1a5)', margin: 0 }}>
        Redirecting to secure login...
      </p>
      <style>{`
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            background: 'var(--lemmo-page-background, #131517)',
            color: 'var(--lemmo-text-secondary, #a1a1a5)',
          }}
        >
          Loading...
        </div>
      }
    >
      <LoginRedirect />
    </Suspense>
  );
}
