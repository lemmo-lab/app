'use client';

import React from 'react';
import { X01 } from 'synthline/react';
import { AgentCommandItem } from '../data/agentCommands';
import { AgentCommandIcon } from './AgentCommandPalette';

interface AgentActiveToolStripProps {
  tool: AgentCommandItem;
  onRemove: () => void;
  locale: string;
}

export const AgentActiveToolStrip: React.FC<AgentActiveToolStripProps> = ({
  tool,
  onRemove,
  locale,
}) => {
  return (
    <div className="agent-floating-tool-pill" role="status" aria-label="Active Tool">
      <div className="tool-pill-icon">
        <AgentCommandIcon
          iconName={tool.iconName}
          size={13}
          strokeWidth={2.2}
          color="var(--lemmo-surface-brand-background, #d1fe17)"
        />
      </div>

      <span className="tool-pill-name">
        {locale === 'fa' ? tool.nameFa : tool.name}
      </span>

      <button
        type="button"
        className="tool-pill-close-btn"
        onClick={onRemove}
        title={locale === 'fa' ? 'حذف ابزار' : 'Remove tool'}
        aria-label="Remove tool"
      >
        <X01 size={11} strokeWidth={2.4} color="currentColor" />
      </button>
    </div>
  );
};
