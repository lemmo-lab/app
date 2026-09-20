'use client';

import React from 'react';

export interface LemmoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export default function LemmoButton({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  ...props
}: LemmoButtonProps) {
  return (
    <button
      className={`lemmo-btn lemmo-btn-${variant} lemmo-btn-${size} ${className}`}
      {...props}
    >
      {icon && <span className="lemmo-btn-icon">{icon}</span>}
      {children && <span>{children}</span>}

      <style jsx>{`
        .lemmo-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--lemmo-gap-2, 6px);
          font-family: inherit;
          font-weight: var(--lemmo-font-weight-medium, 500);
          border-radius: var(--lemmo-radius-200, 8px);
          box-sizing: border-box;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: background var(--lemmo-duration-fast, 120ms) ease,
            border-color var(--lemmo-duration-fast, 120ms) ease,
            color var(--lemmo-duration-fast, 120ms) ease,
            opacity var(--lemmo-duration-fast, 120ms) ease;
        }

        .lemmo-btn-md {
          height: 36px;
          padding: 0 var(--lemmo-space-300, 14px);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
        }

        .lemmo-btn-sm {
          height: 30px;
          padding: 0 var(--lemmo-space-250, 10px);
          font-size: var(--lemmo-type-size-050, 0.75rem);
        }

        /* Variant: Primary (Neon Lime) */
        .lemmo-btn-primary {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          color: var(--lemmo-surface-brand-foreground, #131517);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
        }

        .lemmo-btn-primary:hover:not(:disabled) {
          background: var(--lemmo-interactive-primary-hover, #c4ee0b);
          border-color: var(--lemmo-interactive-primary-hover, #c4ee0b);
        }

        /* Variant: Secondary (Dark subtle surface) */
        .lemmo-btn-secondary {
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: var(--lemmo-text-primary, #e1e1e3);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
        }

        .lemmo-btn-secondary:hover:not(:disabled) {
          background: var(--lemmo-surface-secondary-background, #23262a);
          border-color: var(--lemmo-text-muted, #898a8b);
          color: #ffffff;
        }

        /* Variant: Ghost */
        .lemmo-btn-ghost {
          background: transparent;
          color: var(--lemmo-text-secondary, #a1a1a5);
          border: var(--lemmo-stroke-thin, 1px) solid transparent;
        }

        .lemmo-btn-ghost:hover:not(:disabled) {
          background: var(--lemmo-border-subtle, rgba(255, 255, 255, 0.06));
          color: var(--lemmo-text-primary, #ffffff);
        }

        /* Variant: Danger */
        .lemmo-btn-danger {
          background: color-mix(in srgb, var(--lemmo-text-danger, #ff5462) 12%, transparent);
          color: var(--lemmo-text-danger, #ff5462);
          border: var(--lemmo-stroke-thin, 1px) solid color-mix(in srgb, var(--lemmo-text-danger, #ff5462) 30%, transparent);
        }

        .lemmo-btn-danger:hover:not(:disabled) {
          background: color-mix(in srgb, var(--lemmo-text-danger, #ff5462) 20%, transparent);
          border-color: var(--lemmo-text-danger, #ff5462);
        }

        .lemmo-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .lemmo-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </button>
  );
}
