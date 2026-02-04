// theme.config.ts
import { vars } from 'nativewind';

export type ThemeName = 'light' | 'dark';

export const THEME_COLORS = {
  light: vars({
    /* Base */
    '--background': '0 0% 100%',
    '--foreground': '222 25% 12%',

    /* Surfaces */
    '--card': '0 0% 98%',
    '--card-foreground': '222 25% 12%',

    /* Brand */
    '--primary': '268 55% 48%', // purple
    '--primary-foreground': '0 0% 100%',

    /* Secondary (neutral only) */
    '--secondary': '0 0% 96%',
    '--secondary-foreground': '222 20% 20%',

    /* Muted */
    '--muted': '0 0% 94%',
    '--muted-foreground': '222 10% 45%',

    /* Accent = Primary */
    '--accent': '268 55% 48%',
    '--accent-foreground': '0 0% 100%',

    /* Status */
    '--success': '222 20% 20%',
    '--warning': '222 20% 20%',
    '--destructive': '0 70% 50%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '0 0% 88%',
    '--input': '0 0% 96%',
    '--ring': '268 55% 48%',

    '--radius': '10px',
  }),

  dark: vars({
    /* Base */
    '--background': '222 30% 6%',
    '--foreground': '0 0% 96%',

    /* Surfaces */
    '--card': '222 25% 10%',
    '--card-foreground': '0 0% 96%',

    /* Brand */
    '--primary': '268 60% 62%',
    '--primary-foreground': '222 35% 8%',

    /* Secondary */
    '--secondary': '222 18% 14%',
    '--secondary-foreground': '0 0% 96%',

    /* Muted */
    '--muted': '222 14% 18%',
    '--muted-foreground': '0 0% 65%',

    /* Accent = Primary */
    '--accent': '268 60% 62%',
    '--accent-foreground': '222 35% 8%',

    /* Status */
    '--success': '0 0% 70%',
    '--warning': '0 0% 70%',
    '--destructive': '0 65% 55%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '222 14% 20%',
    '--input': '222 14% 14%',
    '--ring': '268 60% 62%',

    '--radius': '10px',
  }),
};

export const STATUSBAR_COLORS = {
  light: { style: 'dark', background: '#ffffff' },
  dark: { style: 'light', background: '#0a0a0a' },
};
export const THEMES_HEX = {
  light: {
    dark: false,
    colors: {
      primary: '#6b3fd6',
      background: '#ffffff',
      card: '#fafafa',
      text: '#1b1f23',
      muted: '#6b7280',
      border: '#e5e7eb',
      notification: '#6b3fd6',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#9b7bff',
      background: '#0a0a0a',
      card: '#111111',
      text: '#f5f5f5',
      muted: '#9ca3af',
      border: '#262626',
      notification: '#9b7bff',
    },
  },
};
