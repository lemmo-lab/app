import React from 'react';

export interface WireframeBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: string;
  dashed?: boolean;
  bg?: string;
  rounded?: string;
}

export function WireframeBox({
  children,
  className = '',
  style,
  aspectRatio,
  dashed = false,
  bg = 'var(--lemmo-surface-primary-background, #1c1e20)',
  rounded = 'var(--lemmo-radius-card, 0.75rem)',
  ...props
}: WireframeBoxProps) {
  return (
    <div
      className={`wireframe-box ${className}`}
      style={{
        background: bg,
        borderRadius: rounded,
        border: dashed
          ? '1px dashed var(--lemmo-border-default, rgba(255, 255, 255, 0.15))'
          : '1px solid var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08))',
        aspectRatio: aspectRatio,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
