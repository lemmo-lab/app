/**
 * Agent Empty State Wireframe — /app/agent
 * Responsive implementation of agent-empty-state.html wireframe:
 * - Desktop: 1920px max layout with sticky 72px sidebar rail
 * - Centered empty-state illustration with 4 tilted style card elements
 * - Bottom floating input bar with:
 *   - Reference thumbnails with remove icons
 *   - Text input placeholder skeleton
 *   - Plus action button
 *   - Model & frame configuration trigger with interactive popup menu
 *   - Send button linking to /app/agent/chat-01
 * - Mobile/Tablet:
 *   - Responsive scaling for card stack
 *   - Fluid input bar and modal popup
 *   - Mobile bottom navigation rail
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AgentEmptyStatePage() {
  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  const [activeType, setActiveType] = useState<'image' | 'video'>('image');
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [activeCount, setActiveCount] = useState(1);
  const [refItems, setRefItems] = useState([1, 2]);

  const removeRefItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefItems((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="agent-container">
      {/* ===== MAIN BODY ===== */}
      <main className="main-content">
        <div className="content-inner">
          {/* Base Area / Canvas */}
          <div className="base-area">
            {/* Empty State Style Cards Deck */}
            <div className="empty-state-wrap">
              <div className="empty-state">
                <div className="style-select">
                  <div className="select-style card-1" />
                  <div className="select-style card-2" />
                  <div className="select-style card-3" />
                  <div className="select-style card-4" />
                </div>
              </div>
            </div>

            {/* Bottom Input Area */}
            <div className="input-container">
              <div className="input-bar">
                {/* Reference Uploads Row */}
                {refItems.length > 0 && (
                  <div className="input-reference-row">
                    {refItems.map((id) => (
                      <div key={id} className="input-ref-box">
                        <button
                          type="button"
                          className="remove-icon"
                          onClick={(e) => removeRefItem(id, e)}
                          title="Remove reference"
                          aria-label="Remove reference"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Area Placeholder */}
                <div className="text-area-box">
                  <div className="text-skeleton-pill" />
                </div>

                {/* Actions Row */}
                <div className="action-row">
                  <button
                    type="button"
                    className="plus-btn"
                    title="Add Reference"
                    aria-label="Add Reference"
                  >
                    <div className="plus-icon-shape" />
                  </button>

                  <div className="send-config-group">
                    {/* Model / Config Selector Pill */}
                    <button
                      type="button"
                      className="select-model-btn"
                      onClick={() => setConfigMenuOpen(!configMenuOpen)}
                      title="Toggle Generation Settings"
                      aria-label="Toggle Generation Settings"
                    >
                      <div className="model-pill-shape" />
                    </button>

                    {/* Send Button */}
                    <Link
                      href="/app/agent/chat-01"
                      className="send-btn"
                      title="Send Prompt (Start Chat)"
                      aria-label="Send Prompt"
                    >
                      <div className="send-icon-shape" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Interactive Configuration Menu Modal */}
              {configMenuOpen && (
                <div className="config-menu active" onClick={(e) => e.stopPropagation()}>
                  {/* Image / Video Switcher */}
                  <div className="type-content">
                    <button
                      type="button"
                      className={`type-btn image ${activeType === 'image' ? 'active' : ''}`}
                      onClick={() => setActiveType('image')}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      className={`type-btn video ${activeType === 'video' ? 'active' : ''}`}
                      onClick={() => setActiveType('video')}
                    >
                      Video
                    </button>
                  </div>

                  {/* Frame / Aspect Ratio Choices */}
                  <div className="frame-choice">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`frame ${activeFrameIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveFrameIndex(idx)}
                        title={`Aspect ratio option ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Model Dropdown Box */}
                  <div className="model-dropdown">
                    <div className="dropdown" />
                  </div>

                  {/* Result Count (1, 2, 3, 4) */}
                  <div className="number-result">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`frame-num ${activeCount === num ? 'active' : ''}`}
                        onClick={() => setActiveCount(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Credit Usage Indicator */}
                  <div className="credit-container">
                    <div className="credit-usage" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===== SIDEBAR (72px rail) ===== */}
      <nav className="side">
        <div className="button">
          <Link href="/app" className="icon" title="Home">
            <div className="rect-8" />
          </Link>
        </div>

        <div className="primary-cats">
          {/* Feed / Home */}
          <Link href="/app" className="nav-button" title="Feed">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>

          {/* Agent (Active) */}
          <Link href="/app/agent" className="nav-button active" title="Agent">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>

          {/* Assets */}
          <Link href="/app/assets" className="nav-button" title="Assets">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>

          {/* Canvas */}
          <Link href="/canvas" className="nav-button" title="Canvas">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>
        </div>

        <div className="tools-section">
          <Link href="/chat" className="nav-button" title="Chat">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>
        </div>

        <div className="footer-sidebar">
          <Link href="/gallery" className="nav-button" title="Gallery">
            <div className="icon-small"><div className="rect-8-small" /></div>
            <div className="rect-9-indicator" />
          </Link>
          <div className="button">
            <Link href="/settings/billing" className="icon" title="Settings">
              <div className="rect-8" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .agent-container {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          background: #0A0A0A;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          overflow-x: hidden;
          direction: ltr;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100dvh;
          padding: 32px 24px;
          background: #0A0A0A;
          position: relative;
        }

        .content-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          min-height: calc(100dvh - 64px);
          position: relative;
        }

        .base-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          flex: 1;
          position: relative;
          padding-bottom: 200px;
        }

        /* Empty State Fanned Cards */
        .empty-state-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 40px 0;
        }

        .empty-state {
          width: 705px;
          height: 302px;
          position: relative;
          transform-origin: center center;
        }

        .style-select {
          position: absolute;
          width: 705.39px;
          height: 302.04px;
          left: 0;
          top: 0;
        }

        .select-style {
          position: absolute;
          width: 210px;
          height: 260px;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .select-style:hover {
          transform: translateY(-8px) scale(1.02) !important;
          z-index: 10;
        }

        .card-1 {
          left: 0px;
          top: calc(50% - 130px - 21.02px);
          background: #D9D9D9;
          transform: rotate(-13.58deg);
          z-index: 1;
        }

        .card-2 {
          right: 9px;
          top: calc(50% - 130px + 1px);
          background: #ADADAD;
          transform: rotate(-2.1deg);
          z-index: 2;
        }

        .card-3 {
          left: 154.95px;
          top: calc(50% - 130px - 8.49px);
          background: #BAB1B1;
          transform: rotate(2.53deg);
          z-index: 3;
        }

        .card-4 {
          left: 308px;
          top: calc(50% - 130px - 17px);
          background: #9C9C9C;
          transform: rotate(9.88deg);
          z-index: 4;
        }

        /* Floating Input Container */
        .input-container {
          position: fixed;
          bottom: 24px;
          left: 0;
          right: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 20;
          pointer-events: none;
        }

        .input-bar {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 16px;
          gap: 12px;
          width: 100%;
          max-width: 896px;
          background: #353434;
          border-radius: 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          pointer-events: auto;
          box-sizing: border-box;
        }

        /* Reference items */
        .input-reference-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .input-ref-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 55px;
          height: 55px;
          background: #FFFFFF;
          border-radius: 16px;
          position: relative;
        }

        .remove-icon {
          width: 18px;
          height: 18px;
          background: #D9D9D9;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .remove-icon:hover {
          background: #ff5555;
        }

        /* Text area placeholder */
        .text-area-box {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 40px;
        }

        .text-skeleton-pill {
          width: 184px;
          height: 14px;
          background: #525252;
          border-radius: 999px;
        }

        /* Action bar */
        .action-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 32px;
        }

        .plus-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .plus-icon-shape {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .send-config-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
        }

        .select-model-btn {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .model-pill-shape {
          width: 187px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 6px;
          transition: opacity 0.15s ease;
        }

        .model-pill-shape:hover {
          opacity: 0.85;
        }

        .send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          cursor: pointer;
          text-decoration: none;
        }

        .send-icon-shape {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
          transition: opacity 0.15s ease;
        }

        .send-icon-shape:hover {
          opacity: 0.85;
        }

        /* Configuration Menu Popup */
        .config-menu {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 16px;
          position: absolute;
          width: 360px;
          max-width: calc(100vw - 48px);
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: #4D4B4B;
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          z-index: 30;
          pointer-events: auto;
          box-sizing: border-box;
        }

        .type-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 100%;
          margin-bottom: 12px;
        }

        .type-btn {
          flex: 1;
          height: 40px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          background: #494444;
          color: #D9D9D9;
          transition: all 0.15s ease;
        }

        .type-btn.active {
          background: #D9D9D9;
          color: #0A0A0A;
        }

        .frame-choice {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 12px;
        }

        .frame {
          width: 52px;
          height: 52px;
          background: #D9D9D9;
          border-radius: 16px;
          border: 2px solid transparent;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.15s ease;
        }

        .frame.active {
          opacity: 1;
          border: 2px solid #FFFFFF;
        }

        .model-dropdown {
          display: flex;
          width: 100%;
          margin-bottom: 12px;
        }

        .dropdown {
          width: 100%;
          height: 40px;
          background: #D9D9D9;
          border-radius: 12px;
          cursor: pointer;
        }

        .number-result {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          width: 100%;
          margin-bottom: 12px;
        }

        .frame-num {
          flex: 1;
          height: 52px;
          background: #D9D9D9;
          border-radius: 16px;
          border: 2px solid transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.15s ease;
        }

        .frame-num.active {
          opacity: 1;
          background: #FFFFFF;
          border: 2px solid #333333;
        }

        .credit-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding-top: 4px;
        }

        .credit-usage {
          width: 170px;
          height: 12px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        /* ===== SIDEBAR RAIL ===== */
        .side {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          width: 72px;
          min-width: 72px;
          height: 100dvh;
          background: #131517;
          position: sticky;
          top: 0;
          box-sizing: border-box;
          z-index: 40;
        }

        .side .button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          width: 56px;
          height: 56px;
          background: #171717;
          border-radius: 8px;
          margin-bottom: 8px;
          box-sizing: border-box;
        }

        :global(.side .button .icon) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          text-decoration: none;
        }

        .side .button .rect-8 {
          width: 40px;
          height: 40px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .primary-cats {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          gap: 8px;
          width: 56px;
        }

        :global(.nav-button) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 6px;
          width: 56px;
          height: 60px;
          background: #171717;
          border-radius: 8px;
          text-decoration: none;
          box-sizing: border-box;
          transition: background 0.15s ease;
        }

        :global(.nav-button.active) {
          background: #453D3D;
        }

        :global(.nav-button .icon-small) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .rect-8-small {
          width: 20px;
          height: 20px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .rect-9-indicator {
          width: 40px;
          height: 14px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .tools-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          width: 56px;
          margin-top: 8px;
        }

        .footer-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 0;
          width: 56px;
          flex-grow: 1;
          gap: 8px;
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        @media (max-width: 900px) {
          .agent-container {
            flex-direction: column;
          }

          .main-content {
            max-width: 100%;
            padding: 16px 12px 100px 12px;
          }

          .empty-state {
            transform: scale(min(1, calc((100vw - 48px) / 705)));
          }

          .input-container {
            right: 0;
            bottom: 74px;
            padding: 0 16px;
          }

          .side {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 64px;
            flex-direction: row;
            justify-content: space-between;
            padding: 4px 16px;
            z-index: 50;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.7);
          }

          .side .button {
            margin-bottom: 0;
            width: 44px;
            height: 44px;
            padding: 2px;
          }

          .side .button .rect-8 {
            width: 36px;
            height: 36px;
          }

          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
            gap: 8px;
          }

          .nav-button {
            width: 48px;
            height: 48px;
            padding: 4px;
            margin-bottom: 0;
          }

          .nav-button .rect-9-indicator {
            display: none;
          }

          .tools-section {
            display: none;
          }

          .footer-sidebar {
            flex-direction: row;
            padding: 0;
            width: auto;
            flex-grow: 0;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
