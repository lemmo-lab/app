'use client';

import React from 'react';

export interface SettingsRowProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  stacked?: boolean;
  controlEnd?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsRow({
  label,
  hint,
  htmlFor,
  required = false,
  stacked = false,
  controlEnd = false,
  children,
  className = '',
}: SettingsRowProps) {
  return (
    <div
      className={`settings-row ${stacked ? 'row-stacked' : ''} ${className}`}
    >
      {label && (
        <div className="row-label-side">
          <label className="row-label" htmlFor={htmlFor}>
            {label}
            {required && <span className="required-star">*</span>}
          </label>
          {hint && <span className="row-hint">{hint}</span>}
        </div>
      )}

      <div
        className={`row-control-side ${
          controlEnd ? 'control-end' : ''
        } ${!label ? 'full-width' : ''}`}
      >
        {children}
      </div>

      <style jsx>{`
        .settings-row {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          align-items: center;
          gap: var(--lemmo-gap-2, 8px) var(--lemmo-space-600, 24px);
          padding: var(--lemmo-space-450, 16px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
        }

        .settings-row:last-child {
          border-bottom: none;
        }

        .settings-row.row-stacked {
          grid-template-columns: minmax(0, 1fr);
          gap: var(--lemmo-gap-2, 8px);
        }

        .row-label-side {
          display: flex;
          flex-direction: column;
        }

        .row-label {
          font-weight: var(--lemmo-font-weight-medium, 500);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #e1e1e3);
        }

        .required-star {
          margin-inline-start: var(--lemmo-space-050, 2px);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .row-hint {
          display: block;
          margin-top: var(--lemmo-space-050, 2px);
          color: var(--lemmo-text-muted, #898a8b);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          line-height: 1.45;
        }

        .row-control-side {
          justify-self: end;
          width: 100%;
          max-width: 360px;
          min-width: 0;
        }

        .row-control-side.full-width,
        .row-stacked .row-control-side {
          justify-self: stretch;
          max-width: 100%;
        }

        .row-control-side.control-end {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }

        @media (max-width: 640px) {
          .settings-row {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--lemmo-gap-2, 8px);
          }

          .row-control-side {
            justify-self: stretch;
            max-width: 100%;
          }

          .row-control-side.control-end {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
