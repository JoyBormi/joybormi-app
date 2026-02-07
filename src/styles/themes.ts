// theme.config.ts
import { vars } from 'nativewind';

export type ThemeName = 'light' | 'dark';

export const THEME_COLORS = {
  light: vars({
    /* Base */
    '--background': '0 0% 100%',
    '--foreground': '220 16% 10%',

    /* Surfaces */
    '--card': '0 0% 98%',
    '--card-foreground': '220 16% 10%',

    /* Brand */
    '--primary': '268 55% 48%', // purple
    '--primary-foreground': '0 0% 100%',

    /* Secondary (neutral only) */
    '--secondary': '220 12% 96%',
    '--secondary-foreground': '220 16% 12%',

    /* Muted */
    '--muted': '220 10% 94%',
    '--muted-foreground': '220 10% 42%',

    /* Accent = Primary */
    '--accent': '268 55% 48%',
    '--accent-foreground': '0 0% 100%',

    /* Status */
    '--success': '152 52% 34%',
    '--warning': '38 92% 50%',
    '--destructive': '0 70% 50%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '220 12% 88%',
    '--input': '220 12% 96%',
    '--ring': '268 55% 48%',

    '--radius': '14px',
  }),

  dark: vars({
    /* Base */
    '--background': '220 18% 7%',
    '--foreground': '0 0% 96%',

    /* Surfaces */
    '--card': '220 14% 10%',
    '--card-foreground': '0 0% 96%',

    /* Brand */
    '--primary': '268 60% 62%',
    '--primary-foreground': '0 0% 100%',

    /* Secondary */
    '--secondary': '220 12% 14%',
    '--secondary-foreground': '0 0% 96%',

    /* Muted */
    '--muted': '220 10% 16%',
    '--muted-foreground': '220 10% 65%',

    /* Accent = Primary */
    '--accent': '268 60% 62%',
    '--accent-foreground': '222 35% 8%',

    /* Status */
    '--success': '152 45% 45%',
    '--warning': '38 92% 60%',
    '--destructive': '0 65% 55%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '220 10% 22%',
    '--input': '220 10% 14%',
    '--ring': '268 60% 62%',

    '--radius': '14px',
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
      primaryForeground: '#ffffff',
      background: '#ffffff',
      card: '#fafafa',
      text: '#12151a',
      muted: '#6f7682',
      border: '#e6e8ee',
      success: '#1f7a4f',
      warning: '#f59e0b',
      destructive: '#e5484d',
      notification: '#6b3fd6',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#9b7bff',
      primaryForeground: '#ffffff',
      background: '#0a0a0a',
      card: '#13141a',
      text: '#f5f5f5',
      muted: '#9aa3b2',
      border: '#2a2d36',
      success: '#3aa76d',
      warning: '#fbbf24',
      destructive: '#ef5a60',
      notification: '#9b7bff',
    },
  },
};
