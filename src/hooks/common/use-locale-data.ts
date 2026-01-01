import { useTranslation } from 'react-i18next';

import { useLocaleStore } from '@/stores/use-locale-store';
import { Locale } from 'i18n.config';

/**
 * Hook to access locale data from the Zustand store.
 * This provides a convenient way to get localized month and day names
 * without depending on react-native-calendars directly.
 *
 * @example
 * ```tsx
 * const { monthNames, dayNamesShort, getMonthName } = useLocaleData();
 * const januaryName = getMonthName(0); // "January" in current locale
 * ```
 */
export function useLocaleData(locale?: Locale) {
  const { i18n } = useTranslation();
  const {
    getLocaleData,
    getLocaleDataFor,
    getMonthName,
    getMonthNameShort,
    getDayName,
    getDayNameShort,
  } = useLocaleStore();

  const localeData = locale ? getLocaleDataFor(locale) : getLocaleData();

  return {
    /**
     * Current active locale
     */
    locale: i18n.language,

    /**
     * Full month names (January, February, etc.)
     */
    monthNames: localeData.monthNames,

    /**
     * Short month names (Jan, Feb, etc.)
     */
    monthNamesShort: localeData.monthNamesShort,

    /**
     * Full day names (Monday, Tuesday, etc.)
     */
    dayNames: localeData.dayNames,

    /**
     * Short day names (Mon, Tue, etc.)
     */
    dayNamesShort: localeData.dayNamesShort,

    /**
     * Get month name by index (0-11)
     */
    getMonthName: (index: number) =>
      getMonthName(index, i18n.language as Locale),

    /**
     * Get short month name by index (0-11)
     */
    getMonthNameShort: (index: number) =>
      getMonthNameShort(index, i18n.language as Locale),

    /**
     * Get day name by index (0-6, Monday-Sunday)
     */
    getDayName: (index: number) => getDayName(index, i18n.language as Locale),

    /**
     * Get short day name by index (0-6, Monday-Sunday)
     */
    getDayNameShort: (index: number) =>
      getDayNameShort(index, i18n.language as Locale),
  };
}
