import React, { useState } from 'react';
import { Discord, Twitter, Instagram, Tiktok, Globe01, Copy01, Check01 } from 'synthline/react';
import { LemmoLogo } from '../icons/LemmoLogo';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('support@lemmo.ai');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className={styles.footerWrapper} role="contentinfo">
      <div className={styles.inner}>
        {/* Top Section: Brand + Links */}
        <div className={styles.topGrid}>
          {/* Brand Info & Socials */}
          <div className={styles.brandCol}>
            <LemmoLogo size={30} />
            <p className={styles.brandDesc}>
              Next-generation AI creative studio merging generative power with infinite canvas
              manipulation. Create multimodal images, videos, and graphics in one studio.
            </p>

            {/* Social Links */}
            <div className={styles.socialRow}>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialIconBtn}
                aria-label="Join our Discord community"
                title="Discord"
              >
                <Discord size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialIconBtn}
                aria-label="Follow us on X (Twitter)"
                title="X"
              >
                <Twitter size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialIconBtn}
                aria-label="Follow us on Instagram"
                title="Instagram"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialIconBtn}
                aria-label="Follow us on TikTok"
                title="TikTok"
              >
                <Tiktok size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialIconBtn}
                aria-label="Visit our GitHub"
                title="GitHub"
              >
                <Globe01 size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links Grid matching Kling AI 5-column architecture */}
          <nav className={styles.linksGrid} aria-label="Footer Navigation">
            {/* 1. Creative Studio */}
            <div className={styles.linkGroup}>
              <span className={styles.groupHeading}>Creative Studio</span>
              <a href="#canvas" className={styles.footerLink}>
                Infinite Canvas
              </a>
              <a href="#video" className={styles.footerLink}>
                AI Video Generator
              </a>
              <a href="#omni" className={styles.footerLink}>
                Omni Generation
              </a>
              <a href="#motion" className={styles.footerLink}>
                Motion Control
              </a>
              <a href="#manual" className={styles.footerLink}>
                Manual Studio
              </a>
            </div>

            {/* 2. AI Tools */}
            <div className={styles.linkGroup}>
              <span className={styles.groupHeading}>AI Tools</span>
              <a href="#tools" className={styles.footerLink}>
                Background Removal
              </a>
              <a href="#tools" className={styles.footerLink}>
                4K Upscaler
              </a>
              <a href="#tools" className={styles.footerLink}>
                Style Transfer
              </a>
              <a href="#tools" className={styles.footerLink}>
                Text to Icon
              </a>
              <a href="#tools" className={styles.footerLink}>
                All AI Tools
              </a>
            </div>

            {/* 3. Resources */}
            <div className={styles.linkGroup}>
              <span className={styles.groupHeading}>Resources</span>
              <a href="#releases" className={styles.footerLink}>
                Release History (v2.0)
              </a>
              <a href="#quickstart" className={styles.footerLink}>
                Quick Start
              </a>
              <a href="#docs" className={styles.footerLink}>
                Documentation
              </a>
              <a href="#tokens" className={styles.footerLink}>
                Design Tokens
              </a>
              <a href="#blog" className={styles.footerLink}>
                Engineering Blog
              </a>
            </div>

            {/* 4. API & Platform */}
            <div className={styles.linkGroup}>
              <span className={styles.groupHeading}>API & Platform</span>
              <a href="#api" className={styles.footerLink}>
                API Platform
              </a>
              <a href="#token-system" className={styles.footerLink}>
                Token Compute
              </a>
              <a href="#pricing" className={styles.footerLink}>
                Pricing Plans
              </a>
              <a href="#status" className={styles.footerLink}>
                System Status
              </a>
            </div>

            {/* 5. About Us */}
            <div className={styles.linkGroup}>
              <span className={styles.groupHeading}>About Us</span>
              <button
                type="button"
                className={styles.contactEmailLink}
                onClick={handleCopyEmail}
                title="Click to copy email address"
              >
                <span>support@lemmo.ai</span>
                {copiedEmail ? (
                  <Check01 size={12} strokeWidth={1.5} color="var(--lemmo-surface-brand-background)" />
                ) : (
                  <Copy01 size={12} strokeWidth={1.5} />
                )}
              </button>
              <a href="#talent" className={styles.footerLink}>
                Talent Network
              </a>
              <a href="#affiliate" className={styles.footerLink}>
                Affiliate Program
              </a>
              <a href="#terms" className={styles.footerLink}>
                Terms of Use
              </a>
              <a href="#privacy" className={styles.footerLink}>
                Privacy Policy
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom Copyright & Platform Availability */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© 2024–2026 LEMMO AI Studio. All rights reserved.</span>
          </div>

          <div className={styles.platformsRow}>
            <a href="#download" className={styles.platformPill}>
              <span>iOS</span>
            </a>
            <a href="#download" className={styles.platformPill}>
              <span>Android</span>
            </a>
            <a href="#download" className={styles.platformPill}>
              <span>macOS</span>
            </a>
            <a href="#download" className={styles.platformPill}>
              <span>Windows</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
