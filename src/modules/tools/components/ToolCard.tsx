import React, { forwardRef } from 'react';
import { ChevronLeft, ChevronRight } from 'synthline/react';
import { ToolItem } from '../types';
import { ToolIcon } from './ToolIcon';

interface ToolCardProps {
  tool: ToolItem;
  isSelected: boolean;
  onHover: () => void;
  onClick: () => void;
  locale: string;
  isRtl: boolean;
}

export const ToolCard = forwardRef<HTMLDivElement, ToolCardProps>(
  function ToolCard(
    { tool, isSelected, onHover, onClick, locale, isRtl },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`tool-card-item ${isSelected ? 'selected' : ''}`}
        onMouseEnter={onHover}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="tool-card-icon-box">
          <ToolIcon iconName={tool.iconName} />
        </div>
        <div className="tool-card-details">
          <div className="tool-card-title-row">
            <span className="tool-card-name">
              {locale === 'fa' ? tool.nameFa : tool.name}
            </span>
            <span className="tool-card-rating">
              {tool.rating} ★
            </span>
          </div>
          <div className="tool-card-meta-row">
            <span className="tool-card-category-tag">
              {locale === 'fa' ? tool.categoryLabelFa : tool.categoryLabel}
            </span>
            <span className="tool-card-dot" />
            <span className="tool-card-version">{tool.version}</span>
          </div>
        </div>
        <div className="tool-card-indicator" aria-hidden="true">
          {isRtl ? (
            <ChevronLeft size={13} strokeWidth={2.2} color="currentColor" />
          ) : (
            <ChevronRight size={13} strokeWidth={2.2} color="currentColor" />
          )}
        </div>
      </div>
    );
  }
);
