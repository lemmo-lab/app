'use client';

import React from 'react';
import { Sparks } from 'synthline/react';
import { AgentStylePreset } from '../types';
import { AGENT_STYLE_PRESETS } from '../data/mockAgentData';

interface AgentStyleDeckProps {
  onSelectStyle: (preset: AgentStylePreset) => void;
  locale: string;
}

export function AgentStyleDeck({ onSelectStyle, locale }: AgentStyleDeckProps) {
  return (
    <div className="agent-style-deck-container">
      <div className="agent-deck-header">
        <div className="deck-eyebrow-badge">
          <Sparks size={13} strokeWidth={2.2} color="var(--lemmo-surface-brand-background, #d1fe17)" />
          <span>{locale === 'fa' ? 'پیشنهادهای استایل هوش مصنوعی' : 'Creative Style Discovery'}</span>
        </div>
        <h2 className="deck-main-title">
          {locale === 'fa'
            ? 'یک استایل را انتخاب کنید یا پرامپت دلخواه خود را بنویسید'
            : 'Select a signature style or enter your prompt below'}
        </h2>
      </div>

      {/* Fanned / Tilted Cards Stage */}
      <div className="agent-fanned-deck">
        {AGENT_STYLE_PRESETS.map((preset, index) => {
          return (
            <div
              key={preset.id}
              className={`agent-style-card card-${index + 1}`}
              onClick={() => onSelectStyle(preset)}
              role="button"
              tabIndex={0}
              title={locale === 'fa' ? preset.titleFa : preset.titleEn}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStyle(preset);
                }
              }}
            >
              {/* Cover Media */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preset.coverImage}
                alt={preset.titleEn}
                className="style-card-cover-img"
              />
              <div className="style-card-gradient-overlay" />

              {/* Card Meta Content */}
              <div className="style-card-meta">
                <span className="style-card-badge">
                  {locale === 'fa' ? preset.categoryFa : preset.categoryEn}
                </span>
                <h3 className="style-card-title">
                  {locale === 'fa' ? preset.titleFa : preset.titleEn}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
