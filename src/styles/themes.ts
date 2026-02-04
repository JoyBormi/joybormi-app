// theme.config.ts
import { vars } from 'nativewind';

export type ThemeName = 'light' | 'dark';

export const THEME_COLORS = {
  light: vars({
    /* Base */
    '--background': '0 0% 100%',
    '--foreground': '0 0% 8%',

    /* Surfaces */
    '--card': '0 0% 98%',
    '--card-foreground': '0 0% 10%',

    /* Brand / Primary */
    '--primary': '268 55% 48%', // premium purple
    '--primary-foreground': '0 0% 100%',

    /* Secondary (neutral only) */
    '--secondary': '0 0% 94%',
    '--secondary-foreground': '0 0% 22%',

    /* Muted */
    '--muted': '0 0% 90%',
    '--muted-foreground': '0 0% 45%',

    /* Accent = Primary (no extra color) */
    '--accent': '268 55% 48%',
    '--accent-foreground': '0 0% 100%',

    /* Status (kept neutral-dominant) */
    '--success': '0 0% 20%',
    '--warning': '0 0% 35%',
    '--destructive': '0 70% 50%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '0 0% 85%',
    '--input': '0 0% 96%',
    '--ring': '268 55% 48%',

    // Radius
    '--radius': '12px',
  }),

  dark: vars({
    /* Base */
    '--background': '0 0% 0%',
    '--foreground': '0 0% 96%',

    /* Surfaces */
    '--card': '0 0% 6%',
    '--card-foreground': '0 0% 94%',

    /* Brand / Primary */
    '--primary': '268 60% 62%',
    '--primary-foreground': '0 0% 6%',

    /* Secondary */
    '--secondary': '0 0% 12%',
    '--secondary-foreground': '0 0% 96%',

    /* Muted */
    '--muted': '0 0% 16%',
    '--muted-foreground': '0 0% 65%',

    /* Accent = Primary */
    '--accent': '268 60% 62%',
    '--accent-foreground': '0 0% 6%',

    /* Status */
    '--success': '0 0% 70%',
    '--warning': '0 0% 55%',
    '--destructive': '0 65% 55%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '0 0% 18%',
    '--input': '0 0% 14%',
    '--ring': '268 60% 62%',

    // Radius
    '--radius': '12px',
  }),
};

export const STATUSBAR_COLORS = {
  light: { style: 'dark', background: '#ffffff' },
  dark: { style: 'light', background: '#000000' },
};
export const THEMES_HEX = {
  light: {
    dark: false,
    colors: {
      primary: '#6b3fd6',
      background: '#ffffff',
      card: '#fafafa',
      text: '#141414',
      border: '#d9d9d9',
      notification: '#6b3fd6',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#9b7bff',
      background: '#000000',
      card: '#0f0f0f',
      text: '#f5f5f5',
      border: '#262626',
      notification: '#9b7bff',
    },
  },
};
