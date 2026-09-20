'use client';

import React from 'react';

export interface SettingsHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function SettingsHeader({
  title,
  description,
  children,
}: SettingsHeaderProps) {
  return (
    <header className="settings-page-header">
      <div className="header-meta">
        <h1 className="header-title">{title}</h1>
        {description && <p className="header-description">{description}</p>}
      </div>
      {children && <div className="header-actions">{children}</div>}

      <style jsx>{`
        .settings-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--lemmo-gap-4, 16px);
          margin-bottom: var(--lemmo-space-600, 24px);
          padding-bottom: var(--lemmo-space-400, 16px);
          border-bottom: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.06));
        }

        .header-meta {
          flex: 1;
        }

        .header-title {
          margin: 0;
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-500, 1.25rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-text-primary, #ffffff);
          letter-spacing: -0.01em;
        }

        .header-description {
          margin: var(--lemmo-space-150, 6px) 0 0;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          line-height: var(--lemmo-type-leading-600, 1.5);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }
      `}</style>
    </header>
  );
}
