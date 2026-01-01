import { platformSelect } from 'nativewind/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
        },
      },
      fontFamily: {
        regular: platformSelect({
          ios: 'Montserrat-Regular',
          android: 'Montserrat-Regular',
          default: 'sans-serif',
        }),
        medium: platformSelect({
          ios: 'Montserrat-Medium',
          android: 'Montserrat-Medium',
          default: 'sans-serif',
        }),
        bold: platformSelect({
          ios: 'Montserrat-Bold',
          android: 'Montserrat-Bold',
          default: 'sans-serif',
        }),
      },
      // fontSize: {
      //   heading: 28,
      //   title: 22,
      //   subtitle: 18,
      //   body: 17,
      //   caption: 13,
      //   base: 12,
      // },
      // lineHeight: {
      //   heading: '36px',
      //   title: '30px',
      //   subtitle: '26px',
      //   body: '26px',
      //   caption: '20px',
      //   base: '12px',
      // },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      spacing: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '16px',
        '4xl': '20px',
      },
      radius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '16px',
        '4xl': '20px',
      },
    },
  },
  plugins: [],
};
