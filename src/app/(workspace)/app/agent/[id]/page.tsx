/**
 * Dynamic Agent Route — /app/agent/[id]
 * Handles both:
 * 1. Agent Chat view: /app/agent/[chat-id] (e.g. /app/agent/chat-01) matching agent.html
 * 2. Agent Single Content view: /app/agent/[file-name] (e.g. /app/agent/file-01) matching single-content.html
 *
 * Fully responsive:
 * - Desktop: 1920px max layout with 72px sticky sidebar rail
 * - Chat: Scrollable conversation thread, prompt card with reference thumbnails,
 *         result image with interactive link to single content view, bottom input bar with config popup.
 * - Single Content: Little thumbnail rail (left), top zoom controls, top action pill navigation menu,
 *                   central picture frame (449x754px), bottom back button, and floating input bar.
 * - Mobile/Tablet: Responsive layouts with stacking and bottom navigation bar.
 */

'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DynamicAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id || 'chat-01';
  const searchParams = useSearchParams();
  const viewQuery = searchParams.get('view');

  // Determine view mode based on filename convention or explicit query parameter
  const isFileView =
    viewQuery === 'single' ||
    (viewQuery !== 'chat' &&
      (id.startsWith('file') ||
        id.startsWith('img') ||
        id.startsWith('image') ||
        id.startsWith('asset') ||
        id.startsWith('content') ||
        id.includes('.')));

  return isFileView ? (
    <AgentSingleContentView currentId={id} />
  ) : (
    <AgentChatView currentId={id} />
  );
}

/**
 * ============================================================================
 * VIEW 1: AGENT CHAT VIEW (agent.html)
 * ============================================================================
 */
function AgentChatView({ currentId }: { currentId: string }) {
  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  const [activeType, setActiveType] = useState<'image' | 'video'>('image');
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [activeCount, setActiveCount] = useState(1);

  return (
    <div className="agent-container">
      {/* ===== MAIN CHAT AREA ===== */}
      <main className="main-chat">
        {/* Scrollable Conversation Thread */}
        <div className="chat-thread">
          <div className="base-area">
            {/* View Switcher Pill for Easy Testing */}
            <div className="debug-view-nav">
              <span className="view-mode-badge">Chat View: {currentId}</span>
              <Link
                href={`/app/agent/file-${currentId}`}
                className="switch-view-btn"
                title="Switch to Single Content View"
              >
                Switch to Single Content View &rarr;
              </Link>
            </div>

            {/* Input Prompt Card (User Message) */}
            <div className="input-top">
              <div className="promp-body">
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line" />
                <div className="promp-line short" />
              </div>
              <div className="input-refrence">
                <div className="input-ref-item" />
                <div className="input-ref-item" />
              </div>
            </div>

            {/* Output Result Card (Assistant Generated Content) */}
            <div className="output">
              <div className="result-frame">
                <Link
                  href={`/app/agent/file-${currentId}`}
                  className="result-link"
                  title="Click to open Single Content view"
                >
                  <div className="result">
                    <div className="result-overlay">
                      <span className="inspect-pill">Inspect Asset</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating / Sticky Input Bar */}
        <div className="input-bar-container">
          <div className="input-bar">
            {/* Text Area Placeholder */}
            <div className="text_area">
              <div className="rectangle-18" />
            </div>

            {/* Action Buttons Row */}
            <div className="action">
              <button
                type="button"
                className="primary-action"
                title="Add Reference"
                aria-label="Add Reference"
              >
                <div className="plus" />
              </button>

              <div className="send-config-row">
                <button
                  type="button"
                  className="select-model-btn"
                  onClick={() => setConfigMenuOpen(!configMenuOpen)}
                  title="Generation Settings"
                  aria-label="Generation Settings"
                >
                  <div className="rectangle-11" />
                </button>

                <button
                  type="button"
                  className="send-btn"
                  title="Send Message"
                  aria-label="Send Message"
                >
                  <div className="send" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Config Menu */}
          {configMenuOpen && (
            <div className="confog-menu active" onClick={(e) => e.stopPropagation()}>
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

              <div className="frame-choice">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`frame ${activeFrameIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveFrameIndex(idx)}
                    title={`Ratio option ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="model-dropdown">
                <div className="dropdown" />
              </div>

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

              <div className="creadit">
                <div className="creadit-usage" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== SIDEBAR RAIL ===== */}
      <Sidebar activeRoute="agent" />

      {/* ===== CHAT VIEW STYLES ===== */}
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

        .main-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100dvh;
          position: relative;
          background: #0A0A0A;
        }

        .chat-thread {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 24px 180px 24px;
          min-height: 100dvh;
          box-sizing: border-box;
        }

        .base-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 100%;
          max-width: 896px;
        }

        .debug-view-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          font-size: 12px;
        }

        .view-mode-badge {
          color: #888888;
        }

        :global(.switch-view-btn) {
          color: #cccccc;
          text-decoration: none;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          transition: background 0.15s ease;
        }

        :global(.switch-view-btn:hover) {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        /* Input Top (Prompt) */
        .input-top {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          gap: 16px;
          width: 100%;
        }

        .promp-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          padding: 16px;
          gap: 8px;
          width: 100%;
          max-width: 664px;
          min-height: 222px;
          background: #464646;
          border-radius: 18px;
          box-sizing: border-box;
        }

        .promp-line {
          width: 100%;
          height: 14px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .promp-line.short {
          width: 35%;
          align-self: flex-start;
        }

        .input-refrence {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .input-ref-item {
          width: 58px;
          height: 58px;
          background: #D9D9D9;
          border-radius: 12px;
        }

        /* Output (Generated Result) */
        .output {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
        }

        .result-frame {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          max-width: 664px;
        }

        :global(.result-link) {
          display: block;
          text-decoration: none;
          cursor: pointer;
        }

        .result {
          width: 502px;
          max-width: 100%;
          height: 594px;
          background: #B1B1B1;
          border-radius: 50px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .result:hover {
          transform: scale(1.015);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        }

        .result-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.25);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .result:hover .result-overlay {
          opacity: 1;
        }

        .inspect-pill {
          background: #131517;
          color: #D9D9D9;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        /* Input Bottom Bar */
        .input-bar-container {
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

        .text_area {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 40px;
        }

        .rectangle-18 {
          width: 184px;
          height: 14px;
          background: #525252;
          border-radius: 999px;
        }

        .action {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 32px;
        }

        .primary-action {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .plus {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .send-config-row {
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

        .rectangle-11 {
          width: 187px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 6px;
          transition: opacity 0.15s ease;
        }

        .rectangle-11:hover {
          opacity: 0.85;
        }

        .send-btn {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .send {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
          transition: opacity 0.15s ease;
        }

        .send:hover {
          opacity: 0.85;
        }

        /* Config Menu */
        .confog-menu {
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

        .creadit {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding-top: 4px;
        }

        .creadit-usage {
          width: 170px;
          height: 12px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .agent-container {
            flex-direction: column;
          }

          .main-chat {
            max-width: 100%;
          }

          .chat-thread {
            padding: 16px 12px 160px 12px;
          }

          .result {
            width: 100%;
            height: 420px;
            border-radius: 24px;
          }

          .input-bar-container {
            right: 0;
            bottom: 74px;
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * ============================================================================
 * VIEW 2: AGENT SINGLE CONTENT VIEW (single-content.html)
 * ============================================================================
 */
function AgentSingleContentView({ currentId }: { currentId: string }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [refItems, setRefItems] = useState([1, 2]);

  const thumbnails = Array.from({ length: 14 });

  const removeRefItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefItems((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="single-content-container">
      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="main-content">
        <div className="content-layout">
          {/* Left Thumbnail Strip (little-gallery) */}
          <aside className="little-gallery" aria-label="Thumbnail gallery">
            {thumbnails.map((_, i) => (
              <button
                key={i}
                type="button"
                className="focus-pic-btn"
                onClick={() => setActiveThumb(i)}
                title={`Thumbnail ${i + 1}`}
              >
                <div className={`rect-14 ${activeThumb === i ? 'active' : ''}`} />
              </button>
            ))}
          </aside>

          {/* Central Workspace / Canvas Area */}
          <div className="content-area">
            {/* Top Zoom Controls */}
            <div className="zoom-container">
              <button type="button" className="zoom-btn" title="Zoom Out" aria-label="Zoom Out" />
              <div className="zoom-bar" />
              <button type="button" className="zoom-btn" title="Zoom In" aria-label="Zoom In" />
            </div>

            {/* Top Navigation / Tool Menu */}
            <nav className="nav-menu" aria-label="Action tools">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="nav-item-btn"
                  title={`Tool action ${item}`}
                />
              ))}
            </nav>

            {/* Main Picture Frame */}
            <div className="picture-wrapper">
              <div className="rect-17" />
            </div>

            {/* Back to Chat Button */}
            <div className="back-button-container">
              <Link
                href={`/app/agent/chat-01`}
                className="back-button"
                title="Back to Agent Chat"
                aria-label="Back to Agent Chat"
              >
                <div className="rect-11" />
              </Link>
            </div>

            {/* Floating Input Area */}
            <div className="floating-div">
              <div className="input-box">
                {/* References row */}
                {refItems.length > 0 && (
                  <div className="input_refrance">
                    {refItems.map((id) => (
                      <div key={id} className="input-ref-item">
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

                {/* Action Row */}
                <div className="action-row">
                  <button
                    type="button"
                    className="primary-action"
                    title="Add Reference"
                    aria-label="Add Reference"
                  >
                    <div className="plus" />
                  </button>

                  <div className="text_area">
                    <div className="rectangle-18" />
                  </div>

                  <div className="send-container">
                    <button
                      type="button"
                      className="send-btn"
                      title="Send message"
                      aria-label="Send message"
                    >
                      <div className="send" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== SIDEBAR RAIL ===== */}
      <Sidebar activeRoute="agent" />

      {/* ===== SINGLE CONTENT STYLES ===== */}
      <style jsx>{`
        .single-content-container {
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
          height: 100dvh;
          padding: 24px;
          background: #0A0A0A;
          box-sizing: border-box;
          overflow: hidden;
        }

        .content-layout {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 24px;
          width: 100%;
          height: 100%;
        }

        /* Left Little Gallery Rail */
        .little-gallery {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 64px;
          min-width: 64px;
          height: 100%;
          overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
        }

        .focus-pic-btn {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .rect-14 {
          width: 58px;
          height: 58px;
          background: #474747;
          border-radius: 8px;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .rect-14.active {
          background: #DEDEDE;
        }

        .rect-14:hover {
          transform: scale(1.05);
        }

        /* Center Content Canvas */
        .content-area {
          flex: 1;
          height: 100%;
          background: #111111;
          border-radius: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        /* Zoom Control */
        .zoom-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          position: absolute;
          left: 20px;
          top: 20px;
          z-index: 10;
        }

        .zoom-btn {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .zoom-btn:hover {
          opacity: 0.85;
        }

        .zoom-bar {
          width: 100px;
          height: 16px;
          background: #D9D9D9;
          border-radius: 8px;
        }

        /* Top Action Menu */
        .nav-menu {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 20px;
          z-index: 10;
        }

        .nav-item-btn {
          width: 90px;
          height: 38px;
          background: #D9D9D9;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .nav-item-btn:hover {
          opacity: 0.85;
        }

        /* Picture Frame */
        .picture-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: calc(100% - 160px);
          padding: 60px 20px 20px 20px;
          box-sizing: border-box;
        }

        .rect-17 {
          width: 449px;
          max-width: 100%;
          height: 100%;
          max-height: 754px;
          background: #D9D9D9;
          border-radius: 4px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        /* Back to Chat Button */
        .back-button-container {
          position: absolute;
          left: 20px;
          bottom: 24px;
          z-index: 10;
        }

        :global(.back-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          text-decoration: none;
          cursor: pointer;
        }

        .rect-11 {
          width: 36px;
          height: 36px;
          background: #D9D9D9;
          border-radius: 8px;
          transition: opacity 0.15s ease;
        }

        .rect-11:hover {
          opacity: 0.85;
        }

        /* Floating Input Area */
        .floating-div {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          pointer-events: none;
          z-index: 10;
        }

        .input-box {
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

        .input_refrance {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .input-ref-item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 55px;
          height: 55px;
          background: #FFFFFF;
          border-radius: 16px;
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

        .action-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          width: 100%;
          height: 32px;
        }

        .primary-action {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .plus {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .text_area {
          display: flex;
          align-items: center;
          flex: 1;
          height: 32px;
        }

        .rectangle-18 {
          width: 184px;
          height: 14px;
          background: #525252;
          border-radius: 999px;
        }

        .send-container {
          display: flex;
          align-items: center;
        }

        .send-btn {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .send {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .single-content-container {
            flex-direction: column;
          }

          .main-content {
            max-width: 100%;
            height: auto;
            min-height: 100dvh;
            padding: 12px 12px 140px 12px;
            overflow-y: auto;
          }

          .content-layout {
            flex-direction: column;
            height: auto;
            gap: 16px;
          }

          .little-gallery {
            flex-direction: row;
            width: 100%;
            min-width: 100%;
            height: 64px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 4px;
            gap: 8px;
          }

          .focus-pic-btn {
            flex: none;
          }

          .rect-14 {
            width: 50px;
            height: 50px;
          }

          .content-area {
            width: 100%;
            min-height: 560px;
            height: 560px;
            flex: none;
            position: relative;
          }

          .nav-menu {
            overflow-x: auto;
            max-width: calc(100% - 100px);
            left: auto;
            right: 12px;
            transform: none;
            gap: 6px;
          }

          .nav-item-btn {
            width: 50px;
            height: 30px;
            flex: none;
          }

          .zoom-container {
            left: 12px;
            top: 12px;
          }

          .zoom-bar {
            width: 60px;
          }

          .picture-wrapper {
            height: calc(100% - 140px);
            padding: 60px 12px 12px 12px;
          }

          .rect-17 {
            width: 100%;
            max-width: 320px;
            height: 100%;
            max-height: 420px;
          }

          .floating-div {
            bottom: 12px;
            padding: 0 8px;
          }

          .input-box {
            padding: 12px;
            gap: 8px;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * ============================================================================
 * SHARED SIDEBAR RAIL COMPONENT (72px)
 * ============================================================================
 */
function Sidebar({ activeRoute }: { activeRoute: string }) {
  return (
    <nav className="side">
      <div className="button">
        <Link href="/app" className="icon" title="Home">
          <div className="rect-8" />
        </Link>
      </div>

      <div className="primary-cats">
        <Link href="/app" className={`nav-button ${activeRoute === 'feed' ? 'active' : ''}`} title="Feed">
          <div className="icon-small"><div className="rect-8-small" /></div>
          <div className="rect-9-indicator" />
        </Link>

        <Link href="/app/agent" className={`nav-button ${activeRoute === 'agent' ? 'active' : ''}`} title="Agent">
          <div className="icon-small"><div className="rect-8-small" /></div>
          <div className="rect-9-indicator" />
        </Link>

        <Link href="/app/assets" className={`nav-button ${activeRoute === 'assets' ? 'active' : ''}`} title="Assets">
          <div className="icon-small"><div className="rect-8-small" /></div>
          <div className="rect-9-indicator" />
        </Link>

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

      <style jsx>{`
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

        .rect-8 {
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

        @media (max-width: 900px) {
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

          .rect-8 {
            width: 36px;
            height: 36px;
          }

          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
            gap: 8px;
          }

          :global(.nav-button) {
            width: 48px;
            height: 48px;
            padding: 4px;
            margin-bottom: 0;
          }

          .rect-9-indicator {
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
    </nav>
  );
}
