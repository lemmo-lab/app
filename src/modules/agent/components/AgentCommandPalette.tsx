'use client';

import React, { useEffect, useRef } from 'react';
import {
  Scissors,
  AiMagicWand01,
  Brush02,
  Sun01,
  LayersThree,
  Crop01,
  Sparks,
} from 'synthline/react';
import { AgentCommandItem } from '../data/agentCommands';

interface AgentCommandPaletteProps {
  commands: AgentCommandItem[];
  selectedIndex: number;
  onSelectCommand: (command: AgentCommandItem) => void;
  onHoverIndex: (index: number) => void;
  locale: string;
}

export function AgentCommandIcon({
  iconName,
  size = 15,
  strokeWidth = 2,
  color = 'currentColor',
}: {
  iconName: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  switch (iconName) {
    case 'Scissors':
      return <Scissors size={size} strokeWidth={strokeWidth} color={color} />;
    case 'AiMagicWand01':
      return <AiMagicWand01 size={size} strokeWidth={strokeWidth} color={color} />;
    case 'Brush02':
      return <Brush02 size={size} strokeWidth={strokeWidth} color={color} />;
    case 'Sun01':
      return <Sun01 size={size} strokeWidth={strokeWidth} color={color} />;
    case 'LayersThree':
      return <LayersThree size={size} strokeWidth={strokeWidth} color={color} />;
    case 'Crop01':
      return <Crop01 size={size} strokeWidth={strokeWidth} color={color} />;
    default:
      return <Sparks size={size} strokeWidth={strokeWidth} color={color} />;
  }
}

export function AgentCommandPalette({
  commands,
  selectedIndex,
  onSelectCommand,
  onHoverIndex,
  locale,
}: AgentCommandPaletteProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep selected item in view if list is scrollable
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(
        `[data-command-index="${selectedIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (commands.length === 0) {
    return (
      <div className="agent-command-palette empty" role="listbox">
        <div className="command-palette-empty">
          <span>{locale === 'fa' ? 'دستوری یافت نشد' : 'No commands found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-command-palette" role="listbox" ref={listRef}>
      <div className="command-items-scroll">
        {commands.map((cmd, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={cmd.id}
              type="button"
              data-command-index={idx}
              className={`command-item-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCommand(cmd)}
              onMouseEnter={() => onHoverIndex(idx)}
              role="option"
              aria-selected={isSelected}
            >
              <div className="command-item-start">
                <div className="command-icon-wrapper">
                  <AgentCommandIcon
                    iconName={cmd.iconName}
                    size={14}
                    strokeWidth={2}
                    color={
                      isSelected
                        ? 'var(--lemmo-surface-brand-background, #d1fe17)'
                        : 'var(--lemmo-text-secondary, #b5b6b8)'
                    }
                  />
                </div>
                <div className="command-item-text">
                  <div className="command-name-row">
                    <span className="command-syntax">{cmd.command}</span>
                    <span className="command-human-title">
                      {locale === 'fa' ? cmd.nameFa : cmd.name}
                    </span>
                  </div>
                  <span className="command-item-desc">
                    {locale === 'fa' ? cmd.descriptionFa : cmd.description}
                  </span>
                </div>
              </div>

              <div className="command-item-end">
                <span className="command-category-badge">
                  {locale === 'fa' ? cmd.badgeFa : cmd.badge}
                </span>
                <span className="command-credit-cost">
                  {locale === 'fa' ? `${cmd.credits} ک` : `${cmd.credits}c`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
