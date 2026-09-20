'use client';

import React from 'react';

export interface LemmoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixAffix?: string;
  error?: string;
}

export default function LemmoInput({
  prefixAffix,
  error,
  className = '',
  ...props
}: LemmoInputProps) {
  if (prefixAffix) {
    return (
      <div className="lemmo-input-wrapper">
        <div className={`lemmo-input-affix-container ${error ? 'has-error' : ''}`}>
          <span className="lemmo-input-affix-tag">{prefixAffix}</span>
          <input
            className={`lemmo-input-affix-field ${className}`}
            dir="ltr"
            {...props}
          />
        </div>
        {error && <span className="lemmo-input-error-msg">{error}</span>}

        <style jsx>{`
          .lemmo-input-wrapper {
            position: relative;
            width: 100%;
          }

          .lemmo-input-affix-container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 38px;
            direction: ltr;
            border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
            border-radius: var(--lemmo-radius-200, 8px);
            background: var(--lemmo-surface-tertiary-background, #0a0c0e);
            overflow: hidden;
            box-sizing: border-box;
            transition: border-color var(--lemmo-duration-fast, 150ms) ease,
              box-shadow var(--lemmo-duration-fast, 150ms) ease;
          }

          .lemmo-input-affix-container:focus-within {
            border-color: var(--lemmo-surface-brand-background, #d1fe17);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
          }

          .lemmo-input-affix-container.has-error {
            border-color: var(--lemmo-text-danger, #ff5462);
          }

          .lemmo-input-affix-tag {
            padding: 0 var(--lemmo-space-250, 10px);
            color: var(--lemmo-text-muted, #898a8b);
            font-family: var(--lemmo-font-mono, monospace);
            font-size: var(--lemmo-type-size-100, 0.8125rem);
            font-weight: var(--lemmo-font-weight-medium, 500);
            background: var(--lemmo-surface-secondary-background, #23262a);
            height: 100%;
            display: flex;
            align-items: center;
            border-inline-end: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.06));
            user-select: none;
            flex-shrink: 0;
          }

          .lemmo-input-affix-field {
            flex: 1;
            min-width: 0;
            height: 100%;
            padding: 0 var(--lemmo-space-300, 12px);
            background: transparent;
            border: none;
            outline: none;
            color: var(--lemmo-text-primary, #ffffff);
            font-family: inherit;
            font-size: var(--lemmo-type-size-100, 0.8125rem);
          }

          .lemmo-input-affix-field::placeholder {
            color: var(--lemmo-text-faint, #737475);
          }

          .lemmo-input-error-msg {
            display: block;
            margin-top: var(--lemmo-space-100, 4px);
            font-size: var(--lemmo-type-size-050, 0.75rem);
            color: var(--lemmo-text-danger, #ff5462);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="lemmo-input-wrapper">
      <input
        className={`lemmo-input-field ${error ? 'has-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="lemmo-input-error-msg">{error}</span>}

      <style jsx>{`
        .lemmo-input-wrapper {
          position: relative;
          width: 100%;
        }

        .lemmo-input-field {
          display: block;
          width: 100%;
          height: 38px;
          padding: 0 var(--lemmo-space-300, 12px);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: var(--lemmo-text-primary, #ffffff);
          font-family: inherit;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          box-sizing: border-box;
          outline: none;
          transition: border-color var(--lemmo-duration-fast, 150ms) ease,
            box-shadow var(--lemmo-duration-fast, 150ms) ease;
        }

        .lemmo-input-field::placeholder {
          color: var(--lemmo-text-faint, #737475);
        }

        .lemmo-input-field:hover:not(:disabled) {
          border-color: var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
        }

        .lemmo-input-field:focus {
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
        }

        .lemmo-input-field.has-error {
          border-color: var(--lemmo-text-danger, #ff5462);
        }

        .lemmo-input-field:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lemmo-input-error-msg {
          display: block;
          margin-top: var(--lemmo-space-100, 4px);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-danger, #ff5462);
        }
      `}</style>
    </div>
  );
}
