'use client';

/**
 * StepUpAuthModal — Privileged Session Re-authentication Modal
 *
 * Conforms to:
 * - ADR-016 Section 2.22: Privileged session validation & Step-up modal
 * - TASK_FRONTEND_STAGE12B: Section 2.7
 */

import React, { useEffect, useState, useCallback } from 'react';
import { onStepUpAuthRequired, type StepUpAuthRequest } from '@/sdk';

interface KratosNode {
  type: string;
  group: string;
  attributes: {
    name: string;
    type: string;
    value?: string | number | boolean;
    disabled?: boolean;
    required?: boolean;
  };
  messages?: Array<{ text: string; type: string }>;
  meta?: {
    label?: { text: string };
  };
}

interface KratosFlow {
  id: string;
  ui: {
    action: string;
    method: string;
    nodes: KratosNode[];
    messages?: Array<{ text: string; type: string }>;
  };
}

export function StepUpAuthModal() {
  const [activeRequest, setActiveRequest] = useState<StepUpAuthRequest | null>(null);
  const [flow, setFlow] = useState<KratosFlow | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Kratos JSON login flow with ?refresh=true (ADR-016 Section 2.22)
  const initFlow = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/auth/kratos/self-service/login/browser?refresh=true', {
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to initialize verification flow (${res.status})`);
      }

      const flowData = (await res.json()) as KratosFlow;
      setFlow(flowData);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to initialize verification');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onStepUpAuthRequired((request) => {
      setActiveRequest(request);
      setCode('');
      void initFlow();
    });

    return unsubscribe;
  }, [initFlow]);

  const handleCancel = () => {
    if (activeRequest) {
      activeRequest.reject(new Error('Step-up verification cancelled by user.'));
      setActiveRequest(null);
      setFlow(null);
      setCode('');
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flow || !activeRequest || !code.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(flow.ui.action, {
        method: flow.ui.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          method: 'code',
          code: code.trim(),
        }),
      });

      if (res.status === 422) {
        const body = (await res.json()) as { redirect_browser_to?: string };
        if (body.redirect_browser_to) {
          window.location.href = body.redirect_browser_to;
          return;
        }
      }

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as {
          ui?: { messages?: Array<{ text: string }> };
          error?: { message?: string };
        };
        const msg =
          errData.ui?.messages?.[0]?.text ||
          errData.error?.message ||
          'Verification failed. Please check the code and try again.';
        throw new Error(msg);
      }

      // Verification succeeded! Resolve pending request so transport retries automatically
      activeRequest.resolve();
      setActiveRequest(null);
      setFlow(null);
      setCode('');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!activeRequest) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="step-up-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          borderRadius: '0.75rem',
          maxWidth: '26rem',
          width: '100%',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          border: '1px solid #374151',
        }}
      >
        <h2
          id="step-up-title"
          style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}
        >
          Security Verification Required
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
          This operation requires a privileged session. Please enter the verification code sent to
          your registered email to continue.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="step-up-code"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
              }}
            >
              Verification Code
            </label>
            <input
              id="step-up-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              autoFocus
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#111827',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: '#fff',
                fontSize: '1.125rem',
                letterSpacing: '0.25em',
                textAlign: 'center',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#374151',
                color: '#e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !code.trim() ? 0.6 : 1,
                border: 'none',
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
