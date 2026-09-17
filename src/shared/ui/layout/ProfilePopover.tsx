/**
 * Profile & Settings Popover — Wireframe implementation of menu-pop-over.html
 * Displays:
 * - Current plan review & token/credit usage progress
 * - Quick action items (Upgrade, Billing, API Keys, Preferences)
 * - Logout button
 */

'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePopover({ isOpen, onClose }: ProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Slight delay to prevent immediate trigger by the toggle click
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="profile-popover"
      role="menu"
      aria-label="User profile and settings"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Plan Review Section */}
      <Link href="/settings/billing" className="plan-review" onClick={onClose} title="View Billing & Credits">
        <div className="plan-details">
          <div className="rect-66" />
          <div className="rect-67" />
        </div>
        <div className="progress">
          <div className="progress-fill" />
        </div>
      </Link>

      {/* Quick Actions List */}
      <div className="quick-action">
        {/* Upgrade Plan Item */}
        <Link href="/settings/billing" className="action-btn-item upgrade" onClick={onClose} title="Upgrade Plan">
          <div className="rect-66" />
          <div className="rect-65" />
        </Link>

        {/* Settings Item */}
        <Link href="/settings/billing" className="action-btn-item" onClick={onClose} title="Workspace Settings">
          <div className="rect-66" />
          <div className="rect-65" />
        </Link>

        {/* API Keys Item */}
        <div className="action-btn-item" role="menuitem" tabIndex={0} title="API Keys">
          <div className="rect-66" />
          <div className="rect-65" />
        </div>

        {/* Preferences Item */}
        <div className="action-btn-item" role="menuitem" tabIndex={0} title="Preferences">
          <div className="rect-66" />
          <div className="rect-65" />
        </div>
      </div>

      {/* Logout Button */}
      <Link href="/login" className="logout-button" onClick={onClose} title="Log Out">
        <div className="rect-66" />
        <div className="rect-65" />
      </Link>

      <style jsx>{`
        .profile-popover {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 12px;
          position: absolute;
          width: 265px;
          inset-inline-start: calc(100% + 8px);
          inset-inline-end: auto;
          bottom: 0px;
          background: #2A2A2A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          z-index: 100;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75);
          animation: popoverFadeIn 0.15s ease-out;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        :global(.plan-review) {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          text-decoration: none;
          margin-bottom: 8px;
          transition: background 0.15s ease;
        }

        :global(.plan-review:hover) {
          background: rgba(255, 255, 255, 0.1);
        }

        .plan-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rect-66 {
          width: 90px;
          height: 14px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        .rect-67 {
          width: 55px;
          height: 10px;
          background: #7C7C7C;
          border-radius: 999px;
        }

        .progress {
          width: 36px;
          height: 36px;
          background: #171717;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          box-sizing: border-box;
        }

        .progress-fill {
          width: 100%;
          height: 100%;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .quick-action {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 6px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 6px;
        }

        :global(.action-btn-item) {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          height: 38px;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease;
          box-sizing: border-box;
        }

        :global(.action-btn-item:hover) {
          background: rgba(255, 255, 255, 0.08);
        }

        :global(.action-btn-item.upgrade) {
          background: rgba(255, 255, 255, 0.07);
        }

        :global(.action-btn-item.upgrade:hover) {
          background: rgba(255, 255, 255, 0.12);
        }

        .rect-65 {
          width: 20px;
          height: 20px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        :global(.logout-button) {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          height: 38px;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease;
          box-sizing: border-box;
        }

        :global(.logout-button:hover) {
          background: rgba(255, 60, 60, 0.15);
        }

        :global(.logout-button:hover .rect-66),
        :global(.logout-button:hover .rect-65) {
          background: #ff6b6b;
        }

        @media (max-width: 900px) {
          .profile-popover {
            position: fixed;
            bottom: 72px;
            inset-inline: 16px;
            width: auto;
            max-width: 360px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
