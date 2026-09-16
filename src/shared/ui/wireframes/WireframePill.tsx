import React from 'react';

export interface WireframePillProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  width?: string | number;
  height?: string | number;
}

export function WireframePill({
  children,
  className = '',
  style,
  active = false,
  width,
  height = '2.25rem',
  ...props
}: WireframePillProps) {
  return (
    <div
      className={`wireframe-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        paddingInline: '1rem',
        borderRadius: 'var(--lemmo-radius-pill, 9999px)',
        background: active
          ? 'var(--lemmo-interactive-primary-background, #d1fe17)'
          : 'var(--lemmo-surface-secondary-background, #23262a)',
        color: active
          ? 'var(--lemmo-interactive-primary-foreground, #131517)'
          : 'var(--lemmo-text-primary, #e1e1e3)',
        border: '1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08))',
        fontSize: '0.875rem',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
