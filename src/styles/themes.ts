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
    '--background': '40 20% 97%',
    '--foreground': '240 10% 10%',
    '--card': '45 25% 96%',
    '--card-foreground': '240 8% 20%',
    '--primary': '280 30% 80%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '260 10% 94%',
    '--secondary-foreground': '240 10% 25%',
    '--muted': '260 12% 90%',
    '--muted-foreground': '260 10% 30%',
    '--accent': '270 8% 96%',
    '--accent-foreground': '240 10% 25%',
    '--destructive': '0 85% 72%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '260 8% 82%',
    '--input': '260 8% 93%',
    '--ring': '280 30% 70%',
    '--success': '140 50% 45%',
    '--warning': '40 90% 55%',
  }),
  dark: vars({
    '--background': '240 6% 10%',
    '--foreground': '0 0% 95%',
    '--card': '240 8% 14%',
    '--card-foreground': '0 0% 90%',
    '--primary': '280 30% 72%',
    '--primary-foreground': '0 0% 10%',
    '--secondary': '260 8% 20%',
    '--secondary-foreground': '0 0% 95%',
    '--muted': '260 10% 24%',
    '--muted-foreground': '260 8% 65%',
    '--accent': '270 6% 22%',
    '--accent-foreground': '0 0% 95%',
    '--destructive': '0 72% 60%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '260 6% 22%',
    '--input': '260 6% 18%',
    '--ring': '280 30% 62%',
    '--success': '140 45% 40%',
    '--warning': '40 85% 50%',
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
