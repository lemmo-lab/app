'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check01 } from 'synthline/react';
import type { SelectOption } from '../types';

export interface LemmoSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function LemmoSelect({
  id,
  value,
  onChange,
  options,
  className = '',
  ariaLabel,
  disabled = false,
}: LemmoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 220 && rect.top > 200);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className={`lemmo-select-container ${className}`}>
      <button
        id={id}
        type="button"
        className={`lemmo-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="selected-label-text">
          {selectedOption ? selectedOption.label : value}
        </span>
        <span className={`select-chevron ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className={`lemmo-select-menu ${openUpwards ? 'open-upwards' : ''}`}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`lemmo-select-option ${isSelected ? 'selected' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check01 size={13} strokeWidth={2.4} className="option-check-icon" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .lemmo-select-container {
          position: relative;
          width: 100%;
          font-family: inherit;
        }

        .lemmo-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 38px;
          padding: 0 var(--lemmo-space-300, 12px);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.08));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          color: var(--lemmo-text-primary, #e1e1e3);
          font-family: inherit;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          box-sizing: border-box;
          cursor: pointer;
          text-align: start;
          transition: border-color var(--lemmo-duration-fast, 150ms) var(--lemmo-ease-out, ease-out),
            box-shadow var(--lemmo-duration-fast, 150ms) var(--lemmo-ease-out, ease-out);
        }

        .lemmo-select-trigger:hover:not(:disabled) {
          border-color: var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
        }

        .lemmo-select-trigger:focus,
        .lemmo-select-trigger.open {
          outline: none;
          border-color: var(--lemmo-surface-brand-background, #d1fe17);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 20%, transparent);
        }

        .lemmo-select-trigger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .selected-label-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .select-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-text-muted, #898a8b);
          transition: transform var(--lemmo-duration-normal, 200ms) var(--lemmo-ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
          flex-shrink: 0;
          margin-inline-start: var(--lemmo-space-200, 8px);
        }

        .select-chevron.rotated {
          transform: rotate(180deg);
        }

        .lemmo-select-menu {
          position: absolute;
          top: calc(100% + var(--lemmo-space-100, 4px));
          inset-inline-start: 0;
          width: 100%;
          min-width: 180px;
          background: var(--lemmo-surface-elevated-background, #18191c);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-250, 10px);
          padding: var(--lemmo-space-100, 4px);
          box-shadow: var(--lemmo-shadow-card-base, 0 12px 32px rgba(0, 0, 0, 0.75));
          z-index: 60;
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-gap-1, 2px);
          animation: selectMenuIn var(--lemmo-duration-fast, 120ms) var(--lemmo-ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
        }

        @keyframes selectMenuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lemmo-select-menu.open-upwards {
          top: auto;
          bottom: calc(100% + var(--lemmo-space-100, 4px));
          animation: selectMenuInUp var(--lemmo-duration-fast, 120ms) var(--lemmo-ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
        }

        @keyframes selectMenuInUp {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lemmo-select-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--lemmo-space-200, 8px) var(--lemmo-space-250, 10px);
          border-radius: var(--lemmo-radius-150, 6px);
          background: transparent;
          border: none;
          color: var(--lemmo-text-secondary, #a1a1a5);
          font-family: inherit;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          cursor: pointer;
          text-align: start;
          transition: background var(--lemmo-duration-fast, 100ms) ease,
            color var(--lemmo-duration-fast, 100ms) ease;
        }

        .lemmo-select-option:hover {
          background: var(--lemmo-border-subtle, rgba(255, 255, 255, 0.06));
          color: var(--lemmo-text-primary, #ffffff);
        }

        .lemmo-select-option.selected {
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 10%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-weight: var(--lemmo-font-weight-medium, 500);
        }

        .option-check-icon {
          color: var(--lemmo-surface-brand-background, #d1fe17);
          flex-shrink: 0;
          margin-inline-start: var(--lemmo-space-200, 8px);
        }
      `}</style>
    </div>
  );
}
