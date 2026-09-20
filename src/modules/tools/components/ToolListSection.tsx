import React from 'react';
import { ToolItem } from '../types';
import { ToolCard } from './ToolCard';

interface ToolListSectionProps {
  title: string;
  count: number;
  tools: ToolItem[];
  selectedToolId: string;
  onHoverTool: (tool: ToolItem) => void;
  onClickTool: (tool: ToolItem) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  locale: string;
  isRtl: boolean;
  showEmptyState?: boolean;
  onResetAllFilters?: () => void;
}

export function ToolListSection({
  title,
  count,
  tools,
  selectedToolId,
  onHoverTool,
  onClickTool,
  registerRef,
  locale,
  isRtl,
  showEmptyState = false,
  onResetAllFilters,
}: ToolListSectionProps) {
  return (
    <div className="tools-section-block">
      <div className="section-label-header">
        <span className="section-label-title">{title}</span>
        <span className="section-label-count">{count}</span>
      </div>

      {showEmptyState && tools.length === 0 ? (
        <div className="tools-empty-filter">
          <p className="empty-filter-text">
            {locale === 'fa'
              ? 'هیچ ابزاری با مشخصات انتخابی یافت نشد.'
              : 'No tools match your active filter.'}
          </p>
          {onResetAllFilters && (
            <button
              type="button"
              className="empty-filter-reset-btn"
              onClick={onResetAllFilters}
            >
              {locale === 'fa' ? 'نمایش همه ابزارها' : 'Show all tools'}
            </button>
          )}
        </div>
      ) : (
        <div className="tools-cards-list">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              ref={(el) => registerRef(tool.id, el)}
              tool={tool}
              isSelected={selectedToolId === tool.id}
              onHover={() => onHoverTool(tool)}
              onClick={() => onClickTool(tool)}
              locale={locale}
              isRtl={isRtl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
