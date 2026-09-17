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
  const [activeTab, setActiveTab] = useState(0);
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
              <Link href="/app/tools" style={{ textDecoration: 'none', width: '100%' }}>
                <button
                  type="button"
                  className="rect-button"
                  title="Create New Canvas"
                  aria-label="Create New Canvas"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Workflow & Projects Section */}
        <section className="workflow-section">
          {/* Action Bar (Tabs on Left, Search & Filter on Right) */}
          <div className="action-section">
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

            <div className="action">
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
              <button
                type="button"
                className="filter-box"
                title="Filter projects"
                aria-label="Filter projects"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects">
            {projects.map((project) =>
              project.isNew ? (
                /* New Project / Plus Card */
                <Link
                  key={project.id}
                  href="/app/tools"
                  className="project-card create-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  title="Create New Canvas"
                >
                  <div className="project-cover dark">
                    <div className="plus-icon" />
                  </div>
                  <div className="meta-project">
                    <div className="project-name" />
                    <div className="project-meta-line" />
                  </div>
                </Link>
              ) : (
                /* Regular Project Card */
                <Link
                  key={project.id}
                  href="/app/tools"
                  className="project-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  title="Open Canvas"
                >
                  <div className="project-cover" />
                  <div className="meta-project">
                    <div className="project-name" />
                    <div className="project-meta-line" />
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      </main>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .canvas-index {
          position: relative;
          width: 100%;
          min-height: 100%;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          align-items: stretch;
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
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 24px;
          width: 100%;
          padding: 8px 0 40px 0;
        }

        /* Project Card */
        :global(.project-card) {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 272px;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.15s ease;
          outline: none;
        }

        :global(.project-card:hover) {
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

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        @media (max-width: 900px) {
          .main-body {
            max-width: 100%;
            padding: 16px 16px 84px 16px;
          }

          .cover {
            padding: 20px 16px;
            min-height: 190px;
            gap: 16px;
            border-radius: 16px;
            align-items: stretch;
            justify-content: center;
          }

          .title-subtitle {
            gap: 10px;
            width: 100%;
          }

          .rect-title {
            width: 180px;
            height: 22px;
          }

          .rect-subtitle {
            width: 100%;
            max-width: 280px;
            height: 12px;
          }

          .button-new {
            width: 100%;
            height: 44px;
            margin-top: 4px;
          }

          .rect-button {
            height: 44px;
          }

          /* MOBILE ACTION HIERARCHY: Search & Filter first, Tabs underneath */
          .action-section {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .action {
            order: 1;
            width: 100%;
            gap: 10px;
          }

          .search-box-wrap {
            height: 42px;
          }

          .filter-box {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
          }

          .tabs {
            order: 2;
            overflow-x: auto;
            flex-wrap: nowrap;
            width: 100%;
            padding-bottom: 4px;
            scrollbar-width: none;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
          }

          .tabs::-webkit-scrollbar {
            display: none;
          }

          .tab-item {
            flex: 0 0 76px;
            height: 36px;
          }

          .projects {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            width: 100%;
          }

          :global(.project-card) {
            width: 100%;
          }

          .project-cover {
            height: 125px;
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
}
