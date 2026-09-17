/**
 * Canvas Index Wireframe — /app/canvas
 * Responsive implementation of canvas-index.html wireframe:
 * - Desktop: 1920px max layout with 72px sticky sidebar rail
 * - Hero Cover Banner:
 *   - Dark rounded hero card (353535) with title, subtitle pill, and 'Create New' button
 * - Workflow Section:
 *   - Action bar: Filter box, search bar, and 4 tab items with active selection
 *   - Projects Grid:
 *     - New project card with dark cover and centered plus icon
 *     - Multiple project cards with preview cover and metadata pills
 * - Full Mobile/Tablet Responsiveness:
 *   - Banner adapts fluidly with responsive typography/pills
 *   - Filter, search, and tabs wrap gracefully
 *   - Fluid project cards grid with auto-fill minmax(240px, 1fr)
 *   - Mobile bottom navigation rail
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CanvasProject {
  id: string;
  isNew?: boolean;
}

export default function CanvasIndexPage() {
  const [activeTab, setActiveTab] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const projects: CanvasProject[] = [
    { id: 'new', isNew: true },
    { id: 'p1' },
    { id: 'p2' },
    { id: 'p3' },
    { id: 'p4' },
    { id: 'p5' },
  ];

  return (
    <div className="canvas-index">
      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="main-body">
        {/* Page Head / Hero Banner */}
        <section className="page-head">
          <div className="cover">
            <div className="title-subtitle">
              <div className="rect-title" />
              <div className="rect-subtitle" />
            </div>

            <div className="button-new">
              <button
                type="button"
                className="rect-button"
                title="Create New Canvas"
                aria-label="Create New Canvas"
              />
            </div>
          </div>
        </section>

        {/* Workflow & Projects Section */}
        <section className="workflow-section">
          {/* Action Bar (Filter, Search & Tabs) */}
          <div className="action-section">
            <div className="action">
              <button
                type="button"
                className="filter-box"
                title="Filter projects"
                aria-label="Filter projects"
              />
              <div className="search-box-wrap">
                <input
                  type="text"
                  className="search-box"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search canvas projects"
                />
              </div>
            </div>

            {/* 4 Tabs */}
            <div className="tabs">
              {[0, 1, 2, 3].map((tabIdx) => (
                <button
                  key={tabIdx}
                  type="button"
                  className={`tab-item ${activeTab === tabIdx ? 'active' : ''}`}
                  onClick={() => setActiveTab(tabIdx)}
                  title={`Canvas tab ${tabIdx + 1}`}
                  aria-label={`Canvas tab ${tabIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects">
            {projects.map((project) =>
              project.isNew ? (
                /* New Project / Plus Card */
                <div key={project.id} className="project-card create-card" tabIndex={0} role="button">
                  <div className="project-cover dark">
                    <div className="plus-icon" />
                  </div>
                  <div className="meta-project">
                    <div className="project-name" />
                    <div className="project-meta-line" />
                  </div>
                </div>
              ) : (
                /* Regular Project Card */
                <div key={project.id} className="project-card" tabIndex={0} role="button">
                  <div className="project-cover" />
                  <div className="meta-project">
                    <div className="project-name" />
                    <div className="project-meta-line" />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* ===== SIDEBAR RAIL (72px) ===== */}
      <nav className="side">
        <div className="button">
          <Link href="/app" className="icon" title="Home">
            <div className="icon-box-large" />
          </Link>
        </div>

        <div className="primary-cats">
          {/* Feed */}
          <Link href="/app" className="nav-btn" title="Feed">
            <div className="icon" />
            <div className="label-line" />
          </Link>

          {/* Agent */}
          <Link href="/app/agent" className="nav-btn" title="Agent">
            <div className="icon" />
            <div className="label-line" />
          </Link>

          {/* Assets */}
          <Link href="/app/assets" className="nav-btn" title="Assets">
            <div className="icon" />
            <div className="label-line" />
          </Link>

          {/* Canvas (Active) */}
          <Link href="/app/canvas" className="nav-btn active" title="Canvas">
            <div className="icon" />
            <div className="label-line" />
          </Link>
        </div>

        <div className="tools-section">
          {/* Tools */}
          <Link href="/app/tools" className="nav-btn" title="Tools">
            <div className="icon" />
            <div className="label-line" />
          </Link>
        </div>

        <div className="footer-sidebar">
          <Link href="/gallery" className="nav-btn" title="Gallery">
            <div className="icon" />
            <div className="label-line" />
          </Link>
          <div className="button">
            <Link href="/settings/billing" className="icon" title="Settings">
              <div className="icon-box-large" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .canvas-index {
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

        /* Main Body Wrapper */
        .main-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 48px;
          background: #0A0A0A;
          min-height: 100dvh;
          box-sizing: border-box;
        }

        /* Page Head */
        .page-head {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-bottom: 48px;
          width: 100%;
        }

        /* Hero Banner Cover */
        .cover {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 48px;
          gap: 40px;
          width: 100%;
          min-height: 380px;
          background: #353535;
          border-radius: 32px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .title-subtitle {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          max-width: 532px;
          width: 100%;
        }

        .rect-title {
          width: 290px;
          max-width: 100%;
          height: 28px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .rect-subtitle {
          width: 532px;
          max-width: 100%;
          height: 14px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .button-new {
          display: flex;
          width: 276px;
          max-width: 100%;
          height: 40px;
        }

        .rect-button {
          width: 100%;
          height: 40px;
          background: #D9D9D9;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .rect-button:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        /* Workflow Section */
        .workflow-section {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          gap: 24px;
        }

        /* Action Bar */
        .action-section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 24px;
          flex-wrap: wrap;
        }

        .action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          flex: 1;
          max-width: 512px;
        }

        .filter-box {
          width: 115px;
          min-width: 115px;
          height: 40px;
          background: #D9D9D9;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .filter-box:hover {
          opacity: 0.85;
        }

        .search-box-wrap {
          flex: 1;
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
          outline: none;
          color: #111111;
          box-sizing: border-box;
        }

        .tabs {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tab-item {
          width: 105px;
          height: 40px;
          background: #464646;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-item.active {
          background: #D9D9D9;
        }

        .tab-item:hover {
          opacity: 0.9;
        }

        /* Projects Grid */
        .projects {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
          width: 100%;
          padding: 8px 0 40px 0;
        }

        /* Project Card */
        .project-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.15s ease;
          outline: none;
        }

        .project-card:hover {
          transform: translateY(-4px);
        }

        .project-cover {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 181px;
          background: #AEAEAE;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: background 0.15s ease;
        }

        .project-cover.dark {
          background: #2C2C2C;
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .project-card:hover .project-cover.dark {
          border-color: rgba(255, 255, 255, 0.4);
          background: #333333;
        }

        .plus-icon {
          width: 32px;
          height: 32px;
          background: #D9D9D9;
          border-radius: 999px;
          transition: transform 0.15s ease;
        }

        .create-card:hover .plus-icon {
          transform: scale(1.1);
        }

        .meta-project {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
        }

        .project-name {
          width: 81px;
          height: 18px;
          background: #D9D9D9;
          border-radius: 99px;
        }

        .project-meta-line {
          width: 164px;
          height: 14px;
          background: #575757;
          border-radius: 99px;
        }

        /* ===== SIDEBAR RAIL (72px) ===== */
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

        .icon-box-large {
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

        :global(.nav-btn) {
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

        :global(.nav-btn.active) {
          background: #453D3D;
        }

        :global(.nav-btn .icon) {
          width: 20px;
          height: 20px;
          background: #D9D9D9;
          border-radius: 4px;
        }

        :global(.nav-btn .label-line) {
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
          .canvas-index {
            flex-direction: column;
          }

          .main-body {
            max-width: 100%;
            padding: 20px 16px 90px 16px;
          }

          .cover {
            padding: 24px;
            min-height: 280px;
            gap: 24px;
            border-radius: 20px;
          }

          .title-subtitle {
            gap: 12px;
          }

          .action-section {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .action {
            max-width: 100%;
          }

          .tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
          }

          .tab-item {
            flex: none;
          }

          .projects {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }

          .project-cover {
            height: 130px;
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

          .icon-box-large {
            width: 36px;
            height: 36px;
          }

          .primary-cats {
            flex-direction: row;
            padding: 0;
            width: auto;
            gap: 8px;
          }

          :global(.nav-btn) {
            width: 48px;
            height: 48px;
            padding: 4px;
            margin-bottom: 0;
          }

          :global(.nav-btn .label-line) {
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
