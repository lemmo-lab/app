import React from 'react';

interface LemmoLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const LemmoLogo: React.FC<LemmoLogoProps> = ({
  size = 28,
  className = '',
  showText = true,
}) => {
  return (
    <div
      className={`lemmo-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        textDecoration: 'none',
        color: 'inherit',
        userSelect: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="LEMMO Logo"
      >
        <path
          d="M143.836 311.343C174.673 311.343 199.671 336.341 199.671 367.178C199.671 398.015 174.673 423.014 143.836 423.014C112.998 423.014 88 398.015 88 367.178C88 336.341 112.998 311.343 143.836 311.343Z"
          fill="currentColor"
        />
        <path
          d="M367.178 311.343C398.015 311.343 423.014 336.341 423.014 367.178C423.014 398.015 398.015 423.014 367.178 423.014C336.341 423.014 311.343 398.015 311.343 367.178C311.343 336.341 336.341 311.343 367.178 311.343Z"
          fill="currentColor"
        />
        <path
          d="M255.507 88C286.344 88 311.343 112.998 311.343 143.836C311.343 174.673 286.344 199.671 255.507 199.671C224.67 199.671 199.671 174.673 199.671 143.836C199.671 112.998 224.67 88 255.507 88Z"
          fill="currentColor"
        />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-heading, 'Satoshi', sans-serif)",
            fontWeight: 800,
            fontSize: `${size * 0.72}px`,
            letterSpacing: '-0.03em',
            color: 'var(--lemmo-text-primary, #e1e1e3)',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          LEMMO
        </span>
      )}
    </div>
  );
};
