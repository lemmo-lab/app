import React, { useState } from 'react';
import { Play, Copy01, Check01, AiMagicWand01, ArrowRight } from 'synthline/react';
import styles from './Hero.module.css';

interface ShowcasePrompt {
  id: string;
  category: string;
  prompt: string;
  badge: string;
  image: string;
}

const PROMPT_EXAMPLES: ShowcasePrompt[] = [
  {
    id: 'cinematic',
    category: 'Video 3.0 Omni',
    prompt: 'In-car POV, handheld shot through neon rain, cinematic golden reflections on wet asphalt.',
    badge: '4K Native',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'vector',
    category: 'Canvas Generative Fill',
    prompt: 'Surreal levitating architectural glass pavilion in desert dunes, warm sunset rim lighting.',
    badge: 'Canvas Edit',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'studio',
    category: 'Style Transfer & Icon',
    prompt: 'Futuristic geometric brand mascot, holographic metallic finish, isolated vector studio lighting.',
    badge: 'Vector SVG',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  },
];

export const Hero: React.FC = () => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeExample = PROMPT_EXAMPLES[activePromptIndex] ?? PROMPT_EXAMPLES[0]!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeExample.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.heroSection} aria-labelledby="hero-title">
      {/* Background Visual Atmospheres */}
      <div className={styles.heroBackground}>
        <div className={styles.gridOverlay} />
        <div className={styles.glowLime} />
        <div className={styles.glowCyan} />
        <div className={styles.glowViolet} />
      </div>

      {/* Top Spacer / Tag */}
      <div style={{ zIndex: 1, marginTop: 'var(--lemmo-space-400, 1rem)' }}>
        <div className={styles.tagBadge}>
          <span className={styles.badgeDot} />
          <span>All-New LEMMO 2.0 Studio Series</span>
        </div>
      </div>

      {/* Center Cinematic Typography & CTAs (Kling AI Inspired) */}
      <div className={styles.centerContent}>
        <h1 id="hero-title" className={styles.mainTitle}>
          All-in-One, One for All
        </h1>

        <p className={styles.subHeadline}>
          Bridging Generative AI & Infinite Canvas Control
        </p>

        <p className={styles.description}>
          Experience an integrated creative suite where generative AI models and manual pixel-level
          precision coexist. Generate, blend, and edit multimodal assets on an infinite canvas.
        </p>

        <div className={styles.ctaRow}>
          <a href="#create" className={styles.primaryHeroBtn}>
            <span>Create Now</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </a>

          <a href="#demo" className={styles.secondaryHeroBtn}>
            <Play size={16} strokeWidth={1.5} />
            <span>Watch Demo</span>
          </a>
        </div>
      </div>

      {/* Signature Kling-Style Prompt Bar Showcase */}
      <div className={styles.promptBarWrapper}>
        <div className={styles.promptCard}>
          <div className={styles.promptLeft}>
            {/* Thumbnail Preview */}
            <div className={styles.thumbnailPreview}>
              <img
                src={activeExample.image}
                alt={activeExample.prompt}
                className={styles.thumbnailImg}
                loading="eager"
              />
              <span className={styles.thumbnailBadge}>{activeExample.badge}</span>
            </div>

            {/* Prompt details */}
            <div className={styles.promptTextContent}>
              <span className={styles.promptTag}>
                <AiMagicWand01 size={12} strokeWidth={1.5} />
                {activeExample.category}
              </span>
              <span className={styles.promptText} title={activeExample.prompt}>
                {activeExample.prompt}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.promptRight}>
            <button
              type="button"
              className={styles.promptActionBtn}
              onClick={handleCopy}
              aria-label="Copy prompt text"
              title="Copy prompt"
            >
              {copied ? (
                <>
                  <Check01 size={14} strokeWidth={1.5} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy01 size={14} strokeWidth={1.5} />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>

            <a href="#canvas" className={styles.promptTryBtn}>
              <span>Generate on Canvas</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Prompt Category Switcher Tabs */}
        <div className={styles.promptTabsRow} role="tablist">
          {PROMPT_EXAMPLES.map((item, idx) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={idx === activePromptIndex}
              type="button"
              className={`${styles.promptTab} ${
                idx === activePromptIndex ? styles.promptTabActive : ''
              }`}
              onClick={() => {
                setActivePromptIndex(idx);
                setCopied(false);
              }}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
