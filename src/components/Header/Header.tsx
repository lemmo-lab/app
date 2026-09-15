import React, { useState, useEffect } from 'react';
import { Menu02, Globe01, ChevronRight } from 'synthline/react';
import { LemmoLogo } from '../icons/LemmoLogo';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`${styles.headerContainer} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        {/* Left: Logo & Nav items */}
        <div className={styles.leftSection}>
          <a href="#" className={styles.logoLink} aria-label="LEMMO Home">
            <LemmoLogo size={28} />
          </a>

          <nav className={styles.nav} aria-label="Main Navigation">
            <a href="#canvas" className={`${styles.navItem} ${styles.navItemActive}`}>
              Creative Studio
              <span className={styles.badgeNew}>2.0</span>
            </a>

            {/* AI Tools Dropdown */}
            <div
              className={styles.dropdownWrapper}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                type="button"
                className={styles.navItem}
                aria-expanded={toolsDropdownOpen}
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              >
                AI Tools
                <span
                  style={{
                    display: 'inline-block',
                    transform: toolsDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms ease',
                    marginLeft: '2px',
                  }}
                >
                  <ChevronRight size={14} strokeWidth={1.5} />
                </span>
              </button>

              {toolsDropdownOpen && (
                <div className={styles.dropdownMenu} role="menu">
                  <a href="#tools" className={styles.dropdownLink} role="menuitem">
                    <span className={styles.dropdownTitle}>Omni Generation</span>
                    <span className={styles.dropdownDesc}>Text and multimodal prompt to canvas</span>
                  </a>
                  <a href="#tools" className={styles.dropdownLink} role="menuitem">
                    <span className={styles.dropdownTitle}>AI Video & Motion</span>
                    <span className={styles.dropdownDesc}>Cinema-grade generative video clips</span>
                  </a>
                  <a href="#tools" className={styles.dropdownLink} role="menuitem">
                    <span className={styles.dropdownTitle}>Background Removal</span>
                    <span className={styles.dropdownDesc}>Instant precision subject isolation</span>
                  </a>
                  <a href="#tools" className={styles.dropdownLink} role="menuitem">
                    <span className={styles.dropdownTitle}>4K Canvas Upscaler</span>
                    <span className={styles.dropdownDesc}>Ultra-sharp resolution reconstruction</span>
                  </a>
                  <a href="#tools" className={styles.dropdownLink} role="menuitem">
                    <span className={styles.dropdownTitle}>Style Transfer & Vectorizer</span>
                    <span className={styles.dropdownDesc}>Adapt styles and export vector icons</span>
                  </a>
                </div>
              )}
            </div>

            <a href="#manual" className={styles.navItem}>
              Manual Studio
            </a>

            <a href="#command" className={styles.navItem}>
              Command Hub
            </a>

            <a href="#showcase" className={styles.navItem}>
              Showcase
            </a>

            <a href="#api" className={styles.navItem}>
              API & Pricing
            </a>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className={styles.rightSection}>
          <div className={styles.langSelector} title="Language Selection">
            <Globe01 size={16} strokeWidth={1.5} />
            <span>English</span>
          </div>

          <a href="#login" className={styles.signInBtn}>
            Sign In
          </a>

          <a href="#experience" className={styles.ctaBtn}>
            Experience Now
          </a>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            <Menu02 size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-modal="true">
          <div className={styles.mobileNavGroup}>
            <span className={styles.mobileNavTitle}>Platform</span>
            <a
              href="#canvas"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Creative Studio</span>
              <span className={styles.badgeNew}>2.0</span>
            </a>
            <a
              href="#manual"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Manual Studio</span>
              <ChevronRight size={16} strokeWidth={1.5} />
            </a>
            <a
              href="#command"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Command Hub</span>
              <ChevronRight size={16} strokeWidth={1.5} />
            </a>
          </div>

          <div className={styles.mobileDivider} />

          <div className={styles.mobileNavGroup}>
            <span className={styles.mobileNavTitle}>AI Tools</span>
            <a
              href="#tools"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Omni Generation</span>
            </a>
            <a
              href="#tools"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Video & Motion Control</span>
            </a>
            <a
              href="#tools"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Background Removal</span>
            </a>
            <a
              href="#tools"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>4K Upscaler</span>
            </a>
            <a
              href="#tools"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Text to Icon & SVG</span>
            </a>
          </div>

          <div className={styles.mobileDivider} />

          <div className={styles.mobileNavGroup}>
            <a
              href="#showcase"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Community Showcase</span>
            </a>
            <a
              href="#api"
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>API Platform & Tokens</span>
            </a>
          </div>

          <div className={styles.mobileActions}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                color: 'var(--lemmo-text-secondary)',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe01 size={16} strokeWidth={1.5} /> Language
              </span>
              <span style={{ color: 'var(--lemmo-text-primary)', fontWeight: 600 }}>English</span>
            </div>
            <a
              href="#experience"
              className={styles.mobileCtaBtn}
              onClick={() => setMobileMenuOpen(false)}
            >
              Experience Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
