/**
 * Tools Index Wireframe — /app/tools
 * Responsive and interactive implementation of tools-index.html wireframe:
 * - Desktop: 1920px max layout with 72px sticky sidebar rail
 * - Canvas: Spacious interactive workspace area
 * - Tools Drawer Panel (346px):
 *   - Config header pill
 *   - Search box with interactive query state
 *   - Tag filter pills with active selection
 *   - Tutorial hero banner
 *   - Recents section with interactive tool cards
 *   - All Tools section with transparent tool cards
 * - Interactive Preview Popup Card:
 *   - Desktop: Floats neatly to the side of the tools drawer with smooth enter animation
 *   - Mobile: Responsive modal bottom-sheet with dark backdrop and close button
 *   - Displays cover image, title, owner, description lines, and action footer
 * - Full Mobile/Tablet Responsiveness:
 *   - Fluid drawer adapting to mobile view
 *   - Mobile bottom navigation rail
 *   - Drawer tab/toggle to switch between Canvas and Tools on mobile
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ToolItem {
  id: string;
  name: string;
  category: string;
  rating: string;
  version: string;
  isRecent?: boolean;
}

const SAMPLE_TOOLS: ToolItem[] = [
  { id: 't1', name: 'Background Remover', category: 'AI Vision', rating: '4.9', version: 'v2.1', isRecent: true },
  { id: 't2', name: 'Vector Upscaler', category: 'Upscale', rating: '4.8', version: 'v1.4', isRecent: true },
  { id: 't3', name: 'Color Matcher', category: 'Color', rating: '4.7', version: 'v3.0' },
  { id: 't4', name: 'Object Segmenter', category: 'Segmentation', rating: '4.9', version: 'v2.0' },
  { id: 't5', name: 'Lighting Synthesizer', category: 'Lighting', rating: '4.6', version: 'v1.2' },
  { id: 't6', name: 'Depth Map Generator', category: '3D & Depth', rating: '4.8', version: 'v2.5' },
];

const TAGS = ['All', 'AI Models', 'Generative', 'Editing', 'Export'];

export default function ToolsIndexPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(SAMPLE_TOOLS[0]);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'tools' | 'canvas'>('tools');

  const recentTools = SAMPLE_TOOLS.filter((t) => t.isRecent);
  const allTools = SAMPLE_TOOLS.filter((t) => !t.isRecent);

  const handleToolClick = (tool: ToolItem) => {
    setSelectedTool(tool);
    setPreviewOpen(true);
  };

  return (
    <div className="tools-index">
      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="main-body">
        {/* Interactive Canvas Workspace */}
        <section className={`canvas ${mobileTab === 'canvas' ? 'mobile-active' : ''}`}>
          <div className="canvas-grid-bg" />
          
          <div className="canvas-center-placeholder">
            <div className="canvas-icon-placeholder" />
            <div className="canvas-title-pill" />
            <div className="canvas-desc-pill" />
            
            {/* Quick Action to open tools on mobile */}
            <button
              type="button"
              className="open-drawer-pill"
              onClick={() => setMobileTab('tools')}
            >
              Browse Tools Drawer &rarr;
            </button>
          </div>
        </section>

        {/* Tools Drawer Side Panel */}
        <aside className={`tools-side ${mobileTab === 'tools' ? 'mobile-active' : ''}`}>
          {/* Mobile view switcher tab */}
          <div className="mobile-view-tabs">
            <button
              type="button"
              className={`mobile-tab-btn ${mobileTab === 'tools' ? 'active' : ''}`}
              onClick={() => setMobileTab('tools')}
            >
              Tools Drawer
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${mobileTab === 'canvas' ? 'active' : ''}`}
              onClick={() => setMobileTab('canvas')}
            >
              Canvas Board
            </button>
          </div>

          {/* Floating Tool Preview Popup Modal */}
          {previewOpen && selectedTool && (
            <>
              {/* Mobile overlay backdrop */}
              <div
                className="preview-backdrop"
                onClick={() => setPreviewOpen(false)}
                aria-hidden="true"
              />

              <div className="tools-preview-popup" role="dialog" aria-label="Tool preview">
                <div className="tools-preview-card">
                  {/* Close Preview Button */}
                  <button
                    type="button"
                    className="close-preview-btn"
                    onClick={() => setPreviewOpen(false)}
                    title="Close Preview"
                    aria-label="Close Preview"
                  >
                    &times;
                  </button>

                  <div className="preview-head">
                    <div className="file-cover">
                      <div className="cover-badge">{selectedTool.category}</div>
                    </div>
                    <div className="preview-title-row">
                      <div className="preview-title" />
                      <span className="rating-badge">{selectedTool.rating} ★</span>
                    </div>
                  </div>

                  <div className="preview-owner">
                    <div className="owner-avatar" />
                    <div className="owner-name" />
                  </div>

                  <div className="preview-description">
                    <div className="desc-line" />
                    <div className="desc-line" />
                    <div className="desc-line short" />
                  </div>

                  <div className="preview-footer">
                    <div className="footer-item">
                      <div className="footer-text" />
                      <div className="footer-icon" />
                    </div>
                    <div className="footer-item">
                      <button
                        type="button"
                        className="use-tool-btn"
                        onClick={() => {
                          setPreviewOpen(false);
                          setMobileTab('canvas');
                        }}
                      >
                        Add to Canvas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Scrollable Tools Panel Content */}
          <div className="tools-scroll-area">
            {/* Canvas Name & Config Header */}
            <div className="canvas-name-config">
              <div className="config-pill" />
              <button
                type="button"
                className="toggle-preview-pill"
                onClick={() => setPreviewOpen(!previewOpen)}
                title="Toggle Tool Preview"
              >
                {previewOpen ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {/* Search & Action Tools */}
            <div className="items-container">
              <div className="action_tools">
                <div className="search-box-wrap">
                  <input
                    type="text"
                    className="search-box"
                    placeholder=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search tools"
                  />
                  <div className="search-box-placeholder-shape" />
                </div>

                {/* Tag Filters */}
                <div className="tag-dropdown">
                  {TAGS.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-item ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <div className="tag-shape" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tutorials Banner */}
              <div className="tutorials-tools">
                <div className="tutorial-banner">
                  <div className="tutorial-banner-inner" />
                </div>
              </div>
            </div>

            {/* Recents Section */}
            <div className="tools-recents">
              <div className="section-label" />
              <div className="list">
                {recentTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`tools-card ${selectedTool?.id === tool.id ? 'active-card' : ''}`}
                    onClick={() => handleToolClick(tool)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="card-thumb" />
                    <div className="details">
                      <div className="name-tools" />
                      <div className="meta-tools">
                        <div className="meta-rect-1" />
                        <div className="meta-line" />
                        <div className="meta-rect-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Tools Section */}
            <div className="tools-all">
              <div className="section-label" />
              <div className="list">
                {allTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`tools-card transparent ${selectedTool?.id === tool.id ? 'active-card' : ''}`}
                    onClick={() => handleToolClick(tool)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="card-thumb" />
                    <div className="details">
                      <div className="name-tools wide" />
                      <div className="meta-tools">
                        <div className="meta-rect-1" />
                        <div className="meta-line" />
                        <div className="meta-rect-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .tools-index {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          overflow-x: hidden;
          direction: ltr;
        }

        /* Main Content Body */
        .main-body {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          flex: 1;
          min-height: 100dvh;
          background: #0A0A0A;
          position: relative;
        }

        /* Canvas Workspace Area */
        .canvas {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          min-height: 100dvh;
          background: #0E0F11;
          position: relative;
          overflow: hidden;
        }

        .canvas-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .canvas-center-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          z-index: 1;
          text-align: center;
          padding: 24px;
        }

        .canvas-icon-placeholder {
          width: 64px;
          height: 64px;
          background: #232528;
          border-radius: 16px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .canvas-title-pill {
          width: 160px;
          height: 16px;
          background: #2C2E33;
          border-radius: 999px;
        }

        .canvas-desc-pill {
          width: 240px;
          height: 12px;
          background: #1F2124;
          border-radius: 999px;
        }

        .open-drawer-pill {
          display: none;
          margin-top: 12px;
          padding: 8px 16px;
          background: #D9D9D9;
          color: #0A0A0A;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Tools Side Drawer Panel */
        .tools-side {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 346px;
          min-width: 346px;
          min-height: 100dvh;
          background: #1D1D1D;
          box-shadow: -8px 0 24px rgba(0, 0, 0, 0.4);
          z-index: 20;
          overflow: visible;
        }

        .tools-scroll-area {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          height: 100dvh;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .mobile-view-tabs {
          display: none;
        }

        /* Canvas Name / Header */
        .canvas-name-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 64px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .config-pill {
          width: 107px;
          height: 16px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        .toggle-preview-pill {
          background: rgba(255, 255, 255, 0.08);
          color: #aaaaaa;
          border: none;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .toggle-preview-pill:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        /* Search & Tags */
        .items-container {
          display: flex;
          flex-direction: column;
          padding: 0 0 16px;
          gap: 12px;
        }

        .action_tools {
          display: flex;
          flex-direction: column;
          padding: 12px 16px 0;
          gap: 12px;
        }

        .search-box-wrap {
          position: relative;
          width: 100%;
          height: 40px;
        }

        .search-box {
          width: 100%;
          height: 40px;
          background: #D9D9D9;
          border-radius: 8px;
          border: none;
          padding: 0 12px;
          font-size: 14px;
          color: #111111;
          box-sizing: border-box;
          outline: none;
        }

        .tag-dropdown {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .tag-item {
          flex: 1;
          height: 26px;
          background: #383838;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }

        .tag-item.active {
          background: #D9D9D9;
        }

        .tag-shape {
          width: 60%;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 999px;
        }

        .tag-item.active .tag-shape {
          background: #222222;
        }

        /* Tutorials Banner */
        .tutorials-tools {
          display: flex;
          padding: 0 16px;
        }

        .tutorial-banner {
          width: 100%;
          height: 137px;
          background: #D9D9D9;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .tutorial-banner:hover {
          transform: translateY(-2px);
        }

        .tutorial-banner-inner {
          position: absolute;
          bottom: 12px;
          left: 12px;
          width: 120px;
          height: 14px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 999px;
        }

        /* Tools Recents & All */
        .tools-recents,
        .tools-all {
          display: flex;
          flex-direction: column;
          padding: 8px 16px;
          gap: 12px;
        }

        .section-label {
          width: 43px;
          height: 12px;
          background: #5B5B5B;
          border-radius: 99px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .tools-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 8px 12px;
          gap: 12px;
          width: 100%;
          min-height: 58px;
          background: #4B4B4B;
          border-radius: 12px;
          cursor: pointer;
          box-sizing: border-box;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .tools-card:hover {
          background: #555555;
          transform: translateX(-2px);
        }

        .tools-card.active-card {
          border-color: #D9D9D9;
          background: #555555;
        }

        .tools-card.transparent {
          background: rgba(75, 75, 75, 0.25);
        }

        .tools-card.transparent:hover {
          background: rgba(75, 75, 75, 0.5);
        }

        .card-thumb {
          width: 42px;
          height: 42px;
          min-width: 42px;
          background: #D9D9D9;
          border-radius: 8px;
        }

        .details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          flex: 1;
        }

        .name-tools {
          width: 89px;
          height: 12px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .name-tools.wide {
          width: 120px;
        }

        .meta-tools {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          height: 18px;
        }

        .meta-rect-1 {
          width: 39px;
          height: 18px;
          background: #3F3F3F;
          border-radius: 99px;
        }

        .meta-line {
          width: 1px;
          height: 12px;
          background: #555555;
        }

        .meta-rect-2 {
          width: 18px;
          height: 18px;
          background: #3F3F3F;
          border-radius: 4px;
        }

        /* ===== FLOATING PREVIEW POPUP ===== */
        .preview-backdrop {
          display: none;
        }

        .tools-preview-popup {
          position: absolute;
          right: calc(100% + 20px);
          top: 120px;
          display: flex;
          flex-direction: column;
          width: 345px;
          height: 430px;
          z-index: 30;
          animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .tools-preview-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          width: 345px;
          height: 430px;
          background: #303030;
          border-radius: 18px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7);
          box-sizing: border-box;
          position: relative;
        }

        .close-preview-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.5);
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 18px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.15s ease;
        }

        .close-preview-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .preview-head {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .file-cover {
          width: 100%;
          height: 182px;
          background: #E5E5E5;
          border-radius: 14px;
          position: relative;
          padding: 12px;
          box-sizing: border-box;
        }

        .cover-badge {
          display: inline-block;
          background: #111111;
          color: #D9D9D9;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .preview-title-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .preview-title {
          width: 200px;
          height: 18px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        .rating-badge {
          color: #F5A623;
          font-size: 12px;
          font-weight: bold;
        }

        .preview-owner {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
        }

        .owner-avatar {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .owner-name {
          width: 96px;
          height: 14px;
          background: #D9D9D9;
          border-radius: 999px;
        }

        .preview-description {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 4px 0;
        }

        .desc-line {
          width: 100%;
          height: 12px;
          background: #D9D9D9;
          border-radius: 999px;
          opacity: 0.8;
        }

        .desc-line.short {
          width: 65%;
        }

        .preview-footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .footer-text {
          width: 60px;
          height: 12px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .footer-icon {
          width: 18px;
          height: 18px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        .use-tool-btn {
          background: #D9D9D9;
          color: #111111;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .use-tool-btn:hover {
          opacity: 0.9;
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        @media (max-width: 1024px) {
          .tools-preview-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            right: auto;
            transform: translate(-50%, -50%);
            z-index: 60;
            max-width: 90vw;
          }

          .preview-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 55;
            backdrop-filter: blur(4px);
          }
        }

        @media (max-width: 768px) {
          .main-body {
            flex-direction: column;
            width: 100%;
          }

          .mobile-view-tabs {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 48px;
            background: #171717;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .mobile-tab-btn {
            flex: 1;
            height: 100%;
            background: transparent;
            color: #888888;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.15s ease;
          }

          .mobile-tab-btn.active {
            color: #ffffff;
            border-bottom-color: #D9D9D9;
            background: rgba(255, 255, 255, 0.03);
          }

          .canvas {
            display: none;
            min-height: calc(100dvh - 112px);
          }

          .canvas.mobile-active {
            display: flex;
          }

          .open-drawer-pill {
            display: inline-block;
          }

          .tools-side {
            display: none;
            width: 100%;
            min-width: 100%;
            padding-bottom: 90px;
          }

          .tools-side.mobile-active {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
