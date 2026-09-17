/**
 * Single Image / Feed Detail Wireframe — /app/feed/[filename]
 * Responsive implementation of Single-image-web.html & Single-image-mobile.html:
 * - Desktop:
 *   - Sidebar (sticky 72px)
 *   - Little Gallery Thumbnail strip (64px vertical strip of focus-pic items)
 *   - Details Content (Prompt card, tags, references, regenerate button)
 *   - Main Content Area (Back button + main preview rectangle #D9D9D9)
 * - Mobile / Tablet:
 *   - Back button top
 *   - Content area (preview rectangle) on top
 *   - Details content (prompt, tags, references, action button) stacked below
 *   - Little gallery hidden on small screens per mobile spec
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SingleImageFeedPage() {
  const params = useParams();
  const filename = params?.filename as string || 'image-01';

  // 14 little gallery focus pics matching wireframe
  const focusPics = Array.from({ length: 14 });

  return (
    <div className="single-image-app">
      {/* ===== MAIN BODY ===== */}
      <div className="main-body">
        <div className="content">
          {/* 1. Little Gallery Strip (Left on Desktop, Hidden on Mobile) */}
          <div className="little-gallery">
            {focusPics.map((_, i) => (
              <div key={i} className="focus-pic">
                <div className={`rect-14 ${i === 0 ? 'active' : ''}`} />
              </div>
            ))}
          </div>

          {/* 2. Details Content (Prompt, Metadata, Actions) */}
          <div className="details-content">
            {/* Top info & prompt container */}
            <div className="promp">
              {/* Quick action header */}
              <div className="top_section">
                <div className="quick-action">
                  <div className="copy-button" title="Copy" />
                  <div className="share-button" title="Share" />
                </div>
                <div className="label" />
              </div>

              {/* Prompt card with text skeleton bars */}
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

              {/* Tag Container */}
              <div className="tag-container">
                <div className="tag-box"><div className="tag_" /></div>
                <div className="tag-box"><div className="tag_" /></div>
              </div>

              {/* Reference Section */}
              <div className="refrance">
                <div className="label-box" />
                <div className="refrances">
                  <div className="ref-item"><div className="refrance-image" /></div>
                  <div className="ref-item"><div className="refrance-image" /></div>
                </div>
              </div>
            </div>

            {/* Bottom Action Base (Regenerate / Primary Action) */}
            <div className="action_base">
              <div className="regreat-button" />
            </div>
          </div>

          {/* 3. Central Media Content Area */}
          <div className="content-area">
            <Link href="/app" className="back-button" title="Back to App Index">
              <div className="rect-11" />
            </Link>
            <div className="rect-17" />
          </div>
        </div>
      </div>

      {/* Scoped CSS based on Single-image-web.html and Single-image-mobile.html */}
      <style jsx>{`
        .single-image-app {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 100%;
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ===== MAIN BODY ===== */
        .main-body {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 3rem;
          flex: 1 1 0;
          min-width: 0;
        }

        .content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 3rem;
          width: 100%;
          min-height: calc(100dvh - 6rem);
        }

        /* ---- Little Gallery Strip ---- */
        .little-gallery {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 64px;
          height: calc(100dvh - 6rem);
          flex-shrink: 0;
          overflow-y: auto;
        }

        .focus-pic {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
        }

        .rect-14 {
          width: 58px;
          height: 58px;
          background: #474747;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .rect-14.active, .rect-14:hover {
          background: #dedede;
        }

        /* ---- Details Content ---- */
        .details-content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
          width: 450px;
          max-width: 100%;
          flex-shrink: 0;
        }

        .promp {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
          flex: 1 1 0;
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

        .copy-button, .share-button {
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

        .tag-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 28px;
        }

        .tag-box {
          display: flex;
          width: 106px;
          height: 28px;
        }

        .tag_ {
          width: 106px;
          height: 28px;
          background: #464646;
          border-radius: 4px;
          cursor: pointer;
        }

        .refrance {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .label-box {
          width: 65px;
          height: 12px;
          background: #424242;
          border-radius: 99px;
        }

        .refrances {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 48px;
        }

        .ref-item {
          width: 48px;
          height: 48px;
        }

        .refrance-image {
          width: 48px;
          height: 48px;
          background: #464646;
          border-radius: 8px;
        }

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
          transition: opacity 0.15s;
        }
        .regreat-button:hover {
          opacity: 0.9;
        }

        /* ---- Central Content Area ---- */
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
        }

        .back-button {
          position: absolute;
          top: 1.5rem;
          inset-inline-start: 1.5rem;
          display: flex;
          width: 32px;
          height: 32px;
          cursor: pointer;
          text-decoration: none;
        }

        .rect-11 {
          width: 32px;
          height: 32px;
          background: #d9d9d9;
          border-radius: 6px;
        }

        .rect-17 {
          width: 100%;
          max-width: 450px;
          height: 80%;
          background: #d9d9d9;
          border-radius: 4px;
        }

        /* ===== RESPONSIVENESS (MOBILE / TABLET) ===== */
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
          .single-image-app {
            flex-direction: column;
            width: 100%;
          }
          .little-gallery {
            display: none;
          }
          .main-body {
            padding: 12px 16px 80px 16px;
            width: 100%;
          }
          .content {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            min-height: auto;
            width: 100%;
          }
          /* MOBILE UX REORDER: Hero Media First, then Metadata/Prompt */
          .content-area {
            order: 1;
            width: 100%;
            height: auto;
            border-radius: 14px;
            background: #111111;
            position: relative;
            padding: 14px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .back-button {
            position: relative;
            top: auto;
            inset-inline-start: auto;
            width: 32px;
            height: 32px;
            align-self: flex-start;
            z-index: 10;
          }
          .rect-17 {
            width: 100%;
            max-width: 100%;
            height: 380px;
            border-radius: 8px;
            align-self: center;
          }
          .details-content {
            order: 2;
            width: 100%;
            max-width: 100%;
            gap: 16px;
            padding: 0;
          }
          .promp_card {
            padding: 14px;
            border-radius: 12px;
          }
          .tag-container {
            flex-wrap: wrap;
            height: auto;
          }
          .refrances {
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .action_base {
            position: sticky;
            bottom: 72px;
            z-index: 20;
            background: rgba(10, 10, 10, 0.9);
            backdrop-filter: blur(8px);
            padding: 8px 0;
            border-radius: 999px;
            margin-top: 12px;
          }
          .regreat-button {
            height: 44px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
