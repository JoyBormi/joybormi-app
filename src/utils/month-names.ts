/**
 * This file syncs react-native-calendars LocaleConfig with our Zustand locale store.
 * The Zustand store (useLocaleStore) is the single source of truth for locale data.
 * This file ensures react-native-calendars stays in sync.
 */
import { Locale } from 'i18n.config';
import { LocaleConfig } from 'react-native-calendars';

import { useLocaleStore } from '@/stores/use-locale-store';

/**
 * Initialize LocaleConfig with data from the Zustand store
 */
function initializeLocaleConfig() {
  const locales: Locale[] = ['en', 'ru', 'uz'];

  locales.forEach((locale) => {
    const data = useLocaleStore.getState().getLocaleDataFor(locale);
    LocaleConfig.locales[locale] = data;
  });
}

// Initialize on module load
initializeLocaleConfig();

/**
 * Set the calendar locale and sync with Zustand store
 */
export const setCalendarLocale = (lang: Locale) => {
  LocaleConfig.defaultLocale = lang;
  useLocaleStore.getState().setLocale(lang);
};
