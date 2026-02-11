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
        'montserrat-regular': platformSelect({
          ios: 'Montserrat-Regular',
          android: 'Montserrat-Regular',
          default: 'sans-serif',
        }),
        'montserrat-medium': platformSelect({
          ios: 'Montserrat-Medium',
          android: 'Montserrat-Medium',
          default: 'sans-serif',
        }),
        'montserrat-bold': platformSelect({
          ios: 'Montserrat-Bold',
          android: 'Montserrat-Bold',
          default: 'sans-serif',
        }),
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '56px',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.font-heading': {
          fontSize: '28px',
          lineHeight: '36px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Bold',
            android: 'Montserrat-Bold',
            default: 'sans-serif',
          }),
        },
        '.font-title': {
          fontSize: '20px',
          lineHeight: '28px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Medium',
            android: 'Montserrat-Medium',
            default: 'sans-serif',
          }),
        },
        '.font-subtitle': {
          fontSize: '18px',
          lineHeight: '26px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Medium',
            android: 'Montserrat-Medium',
            default: 'sans-serif',
          }),
        },
        '.font-body': {
          fontSize: '16px',
          lineHeight: '24px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Regular',
            android: 'Montserrat-Regular',
            default: 'sans-serif',
          }),
        },
        '.font-subbody': {
          fontSize: '14px',
          lineHeight: '22px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Light',
            android: 'Montserrat-Light',
            default: 'sans-serif',
          }),
        },
        '.font-caption': {
          fontSize: '12px',
          lineHeight: '20px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Regular',
            android: 'Montserrat-Regular',
            default: 'sans-serif',
          }),
        },
        '.font-base': {
          fontSize: '12px',
          lineHeight: '18px',
          fontFamily: platformSelect({
            ios: 'Montserrat-Light',
            android: 'Montserrat-Light',
            default: 'sans-serif',
          }),
        },
      });
    },
  ],
};
