'use client';

import React from 'react';

export interface LemmoToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function LemmoToggle({
  id,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: LemmoToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`lemmo-toggle ${checked ? 'checked' : ''}`}
    >
      <span className="lemmo-toggle-knob" />

      <style jsx>{`
        .lemmo-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 44px;
          height: 24px;
          padding: 2px;
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          cursor: pointer;
          transition: background var(--lemmo-duration-fast, 150ms) ease,
            border-color var(--lemmo-duration-fast, 150ms) ease;
        }

        .lemmo-toggle.checked {
          background: var(--lemmo-surface-brand-background, #d1fe17);
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .lemmo-toggle-knob {
          display: block;
          width: 18px;
          height: 18px;
          border-radius: var(--lemmo-radius-full, 9999px);
          background: #ffffff;
          transition: transform var(--lemmo-duration-normal, 180ms) var(--lemmo-ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .lemmo-toggle.checked .lemmo-toggle-knob {
          transform: translateX(20px);
          background: var(--lemmo-surface-brand-foreground, #131517);
        }

        [dir='rtl'] .lemmo-toggle.checked .lemmo-toggle-knob {
          transform: translateX(-20px);
        }

        .lemmo-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lemmo-toggle:focus-visible {
          outline: 2px solid var(--lemmo-surface-brand-background, #d1fe17);
          outline-offset: 2px;
        }
      `}</style>
    </button>
  );
}
