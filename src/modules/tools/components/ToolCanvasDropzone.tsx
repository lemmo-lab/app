import React from 'react';
import Link from 'next/link';
import { FolderUpload, ChevronLeft, ChevronRight } from 'synthline/react';
import { ToolItem } from '../types';

interface ToolCanvasDropzoneProps {
  selectedTool?: ToolItem;
  locale: string;
  isRtl: boolean;
}

export function ToolCanvasDropzone({
  selectedTool,
  locale,
  isRtl,
}: ToolCanvasDropzoneProps) {
  return (
    <div className="canvas-center-workspace">
      <div className="canvas-dropzone-box">
        <div className="dropzone-icon-ring">
          <FolderUpload
            size={28}
            strokeWidth={2}
            color="var(--lemmo-surface-brand-background, #d1fe17)"
          />
        </div>
        <h3 className="dropzone-title">
          {locale === 'fa'
            ? 'فضای تعاملی ابزارهای بوم'
            : 'Interactive Tool Sandbox'}
        </h3>
        <p className="dropzone-subtitle">
          {locale === 'fa'
            ? `ابزار «${selectedTool ? selectedTool.nameFa : ''}» آماده اجراست. برای ایجاد پروژه کامل، بوم را باز کنید.`
            : `Tool "${selectedTool ? selectedTool.name : ''}" is ready. Launch Canvas to chain and edit layers.`}
        </p>
        <Link href="/app/canvas" className="dropzone-launch-btn">
          <span>{locale === 'fa' ? 'ایجاد پروژه در بوم' : 'Open in Canvas'}</span>
          {isRtl ? (
            <ChevronLeft size={14} strokeWidth={2.2} color="currentColor" />
          ) : (
            <ChevronRight size={14} strokeWidth={2.2} color="currentColor" />
          )}
        </Link>
      </div>
    </div>
  );
}
