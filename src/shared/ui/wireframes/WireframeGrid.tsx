import React from 'react';

export interface WireframeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: string;
}

export function WireframeGrid({
  children,
  className = '',
  style,
  columns = 5,
  gap = 'var(--lemmo-gap-card-grid, 0.5rem)',
  ...props
}: WireframeGridProps) {
  return (
    <div
      className={`wireframe-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns:
          typeof columns === 'number'
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns,
        gap: gap,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
