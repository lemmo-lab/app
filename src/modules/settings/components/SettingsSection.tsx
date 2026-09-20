'use client';

import React from 'react';

export interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsSection({
  title,
  children,
  className = '',
}: SettingsSectionProps) {
  return (
    <section className={`settings-section ${className}`}>
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-body">{children}</div>

      <style jsx>{`
        .settings-section {
          margin-top: var(--lemmo-space-800, 32px);
        }

        .settings-section:first-child {
          margin-top: 0;
        }

        .section-title {
          margin: 0;
          padding-bottom: var(--lemmo-space-300, 12px);
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.12));
          color: var(--lemmo-text-muted, #898a8b);
          font-size: var(--lemmo-type-size-050, 0.6875rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .section-body {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </section>
  );
}
