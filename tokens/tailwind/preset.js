/**
 * @lemmo-lab/tokens (v2) - Tailwind CSS Preset
 */

export default {
  theme: {
    extend: {
      colors: {
        page: {
          primary: 'var(--lemmo-page-background)',
          foreground: 'var(--lemmo-page-foreground)',
        },
        surface: {
          primary: 'var(--lemmo-surface-primary-background)',
          secondary: 'var(--lemmo-surface-secondary-background)',
          tertiary: 'var(--lemmo-surface-tertiary-background)',
          elevated: 'var(--lemmo-surface-elevated-background)',
          brand: 'var(--lemmo-surface-brand-background)',
        },
        brand: {
          lime: '#d1fe17',
          limeContrast: '#386b00',
          pink: '#ff005b',
          blue: '#0256fe',
        }
      },
      borderRadius: {
        control: 'var(--lemmo-radius-control, 0.5rem)',
        card: 'var(--lemmo-radius-card, 0.75rem)',
        badge: 'var(--lemmo-radius-badge, 0.375rem)',
      },
      fontFamily: {
        body: ['var(--lemmo-font-body)', 'sans-serif'],
        heading: ['var(--lemmo-font-heading)', 'sans-serif'],
        display: ['var(--lemmo-font-display)', 'sans-serif'],
        numeric: ['var(--lemmo-font-numeric)', 'sans-serif'],
      }
    }
  }
};
