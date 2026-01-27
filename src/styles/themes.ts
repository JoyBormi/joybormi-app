// theme.config.ts
import { vars } from 'nativewind';

export type ThemeName = 'light' | 'dark';

export type ThemeColors = Record<keyof typeof vars, string>;
export type ThemeColorMap = Record<ThemeName, ThemeColors>;
export type ThemeHex = Record<
  ThemeName,
  {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  }
>;

// 1. Raw HSL values (no rgb(...) wrapper)
export const THEME_COLORS: ThemeColorMap = {
  light: vars({
    /* Base */
    '--background': '270 25% 98%',
    '--foreground': '270 12% 12%',

    /* Surfaces */
    '--card': '0 0% 100%',
    '--card-foreground': '270 12% 15%',

    /* Brand / Primary CTA */
    '--primary': '280 45% 52%', // soft orchid purple
    '--primary-foreground': '0 0% 100%',

    /* Secondary UI */
    '--secondary': '270 22% 92%',
    '--secondary-foreground': '270 12% 28%',

    /* Muted */
    '--muted': '270 18% 88%',
    '--muted-foreground': '270 10% 45%',

    /* Accent (selected dates, chips) */
    '--accent': '285 35% 92%',
    '--accent-foreground': '280 45% 42%',

    /* Status */
    '--success': '145 50% 40%',
    '--warning': '38 85% 55%',
    '--destructive': '0 75% 55%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '270 14% 80%',
    '--input': '270 18% 94%',
    '--ring': '280 45% 52%',
  }),
  dark: vars({
    /* Base */
    '--background': '270 18% 8%',
    '--foreground': '0 0% 95%',

    /* Surfaces */
    '--card': '270 16% 12%',
    '--card-foreground': '0 0% 92%',

    /* Brand / Primary */
    '--primary': '280 45% 60%',
    '--primary-foreground': '270 20% 10%',

    /* Secondary */
    '--secondary': '270 14% 18%',
    '--secondary-foreground': '0 0% 95%',

    /* Muted */
    '--muted': '270 12% 22%',
    '--muted-foreground': '270 10% 65%',

    /* Accent */
    '--accent': '285 25% 22%',
    '--accent-foreground': '285 45% 65%',

    /* Status */
    '--success': '145 45% 45%',
    '--warning': '38 80% 55%',
    '--destructive': '0 70% 55%',
    '--destructive-foreground': '0 0% 100%',

    /* Borders & inputs */
    '--border': '270 12% 22%',
    '--input': '270 14% 18%',
    '--ring': '280 45% 60%',
  }),
};

// 2. Status bar styles
export const STATUSBAR_COLORS = {
  light: { style: 'dark', background: '#f7f6f2' },
  dark: { style: 'light', background: '#1c1c1f' },
};

// 3. HEX Theme Colors
export const THEMES_HEX: ThemeHex = {
  light: {
    dark: false,
    colors: {
      primary: '#dbc9eb',
      background: '#f7f6f2',
      card: '#f9f5e8',
      text: '#1c1c1f',
      border: '#ddd5e2',
      notification: '#f39191',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#c1a8db',
      background: '#1c1c1f',
      card: '#292931',
      text: '#f2f2f2',
      border: '#38383f',
      notification: '#db5757',
    },
  },
};
