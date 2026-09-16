import React from 'react';

export interface WireframePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  bg?: string;
}

export function WireframePlaceholder({
  className = '',
  style,
  width = '100%',
  height = '1rem',
  rounded = 'var(--lemmo-radius-150, 0.375rem)',
  bg = 'rgba(255, 255, 255, 0.08)',
  ...props
}: WireframePlaceholderProps) {
  return (
    <div
      className={`wireframe-placeholder ${className}`}
      style={{
        width: width,
        height: height,
        borderRadius: rounded,
        background: bg,
        ...style,
      }}
      {...props}
    />
  );
}
