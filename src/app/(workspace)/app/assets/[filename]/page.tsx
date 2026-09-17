/**
 * Single Asset Details Wireframe — /app/assets/[filename]
 * Responsive implementation of assets-single-page.html:
 * - Details panel (450px):
 *   - Quick actions (copy, share, delete) + label
 *   - Dark prompt card with text skeleton lines
 *   - Created date row (value + sub-label + date-icon)
 *   - Dimensions row (value + sub-label + dimensions-icon)
 *   - Model/Tools row (tag-model badge + tools-name + tools-icon)
 *   - Regrenerate / Action button (418x40px rounded pill)
 * - Content area:
 *   - Large preview rectangle (#d9d9d9)
 *   - Close / Back button to /app/assets
 * - Mobile / Tablet responsive adaptation
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AssetSinglePage() {
  const params = useParams();
  const filename = (params?.['file-name'] || params?.filename || 'asset-01') as string;

  return (
    <div className="single-asset-app">
      <div className="main-body">
        <div className="content">
          {/* 1. Left Details Panel */}
          <aside className="details-content">
            <div className="promp">
              {/* Primary Section */}
              <div className="primary-section">
                <div className="top_section">
                  <div className="quick-action">
                    <div className="copy-button" title="Copy" />
                    <div className="share-button" title="Share" />
                    <div className="delete-button" title="Delete" />
                  </div>
                  <div className="label" />
                </div>

                <div className="promp_card">
                  <div className="text" />
                  <div className="text" />
                  <div className="text" />
                  <div className="text" />
                  <div className="text" />
                  <div className="text" />
                  <div className="text" />
                  <div className="text short" />
                </div>
              </div>

              {/* Result Section 1: Created Date */}
              <div className="result_section">
                <div className="lable-row">
                  <div className="value" />
                  <div className="sub-lable">
                    <div className="created-date" />
                    <div className="date-icon" />
                  </div>
                </div>
              </div>

              {/* Result Section 2: Dimensions */}
              <div className="result_section">
                <div className="lable-row">
                  <div className="value" />
                  <div className="sub-lable">
                    <div className="dimensions" />
                    <div className="dimensions-icon" />
                  </div>
                </div>
              </div>

              {/* Result Section 3: Model / Tool */}
              <div className="result_section">
                <div className="lable-row">
                  <div className="tag-model" />
                  <div className="sub-lable">
                    <div className="tools-name" />
                    <div className="tools-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Base Button */}
            <div className="action_base">
              <div className="regreat-button" />
            </div>
          </aside>

          {/* 2. Central Media Content Preview Area */}
          <div className="content-area">
            <Link href="/app/assets" className="close-button" title="Close / Back to Assets">
              <div className="close-icon" />
            </Link>
            <div className="pic-fill" />
          </div>
        </div>
      </div>

      {/* Scoped CSS faithful to assets-single-page.html */}
      <style jsx>{`
        .single-asset-app {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 100dvh;
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow-x: hidden;
        }

        .main-body {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 3rem;
          width: 100%;
          min-height: 100dvh;
        }

        .content {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: flex-start;
          width: 100%;
          gap: 3rem;
          min-height: calc(100dvh - 6rem);
        }

        /* ---- Details Content Panel ---- */
        .details-content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 1.5rem 1rem;
          gap: 1rem;
          width: 450px;
          max-width: 100%;
          background: #383838;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .promp {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 1 1 0;
        }

        .primary-section {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-bottom: 1rem;
          gap: 1rem;
          width: 100%;
        }

        .top_section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 18px;
        }

        .quick-action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          height: 18px;
        }

        .copy-button, .share-button, .delete-button {
          width: 18px;
          height: 18px;
          background: #d9d9d9;
          border-radius: 4px;
          cursor: pointer;
        }

        .top_section .label {
          width: 89px;
          height: 14px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .promp_card {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 10px;
          width: 100%;
          background: #272525;
          border-radius: 16px;
        }

        .promp_card .text {
          width: 100%;
          height: 12px;
          background: #484848;
          border-radius: 99px;
        }

        .promp_card .text.short {
          width: 92px;
        }

        /* Result Sections */
        .result_section {
          display: flex;
          flex-direction: column;
          padding-block: 8px 16px;
          gap: 8px;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .lable-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 24px;
        }

        .value {
          width: 40px;
          height: 12px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .sub-lable {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .created-date, .dimensions, .tools-name {
          width: 78px;
          height: 12px;
          background: #d9d9d9;
          border-radius: 99px;
        }

        .date-icon, .dimensions-icon, .tools-icon {
          width: 24px;
          height: 24px;
          background: #d9d9d9;
          border-radius: 8px;
        }

        .tag-model {
          width: 71px;
          height: 24px;
          background: #d9d9d9;
          border-radius: 4px;
        }

        /* Action Base */
        .action_base {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 40px;
          margin-top: auto;
        }

        .regreat-button {
          width: 100%;
          height: 40px;
          background: #d9d9d9;
          border-radius: 999px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .regreat-button:hover {
          opacity: 0.9;
        }

        /* ---- Content Area ---- */
        .content-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #111111;
          border-radius: 16px;
          flex: 1 1 0;
          min-width: 0;
          height: calc(100dvh - 6rem);
          position: relative;
          padding: 2rem;
        }

        .close-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          cursor: pointer;
          text-decoration: none;
          z-index: 5;
        }

        .close-icon {
          width: 32px;
          height: 32px;
          background: #d9d9d9;
          border-radius: 6px;
        }

        .pic-fill {
          width: 100%;
          max-width: 756px;
          height: 85%;
          background: #d9d9d9;
          border-radius: 4px;
        }

        /* ===== RESPONSIVENESS ===== */
        @media (max-width: 1024px) {
          .main-body {
            padding: 1.5rem;
          }
          .content {
            gap: 1.5rem;
          }
          .details-content {
            width: 360px;
          }
        }

        @media (max-width: 768px) {
          .main-body {
            padding: 1rem;
          }
          .content {
            flex-direction: column-reverse;
            align-items: stretch;
            gap: 1.5rem;
            height: auto;
          }
          .content-area {
            height: 450px;
            width: 100%;
          }
          .pic-fill {
            height: 360px;
          }
          .details-content {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}
