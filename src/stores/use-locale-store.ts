import { Locale } from 'i18n.config';
import { create } from 'zustand';

/**
 * Locale configuration interface matching react-native-calendars structure
 */
export interface LocaleData {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
}

/**
 * All supported locales with their calendar data
 */
const LOCALE_DATA: Record<Locale, LocaleData> = {
  en: {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    dayNames: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  ru: {
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    monthNamesShort: [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ],
    dayNames: [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ],
    dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  },
  uz: {
    monthNames: [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentyabr',
      'Oktyabr',
      'Noyabr',
      'Dekabr',
    ],
    monthNamesShort: [
      'Yan',
      'Fev',
      'Mar',
      'Apr',
      'May',
      'Iyn',
      'Iyl',
      'Avg',
      'Sen',
      'Okt',
      'Noy',
      'Dek',
    ],
    dayNames: [
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
      'Yakshanba',
    ],
    dayNamesShort: ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Yak'],
  },
};

interface LocaleStore {
  /**
   * Current active locale
   */
  currentLocale: Locale;

  /**
   * Get locale data for the current locale
   */
  getLocaleData: () => LocaleData;

  /**
   * Get locale data for a specific locale
   */
  getLocaleDataFor: (locale: Locale) => LocaleData;

  /**
   * Set the current locale
   */
  setLocale: (locale: Locale) => void;

  /**
   * Get month name by index (0-11)
   */
  getMonthName: (index: number, locale?: Locale) => string;

  /**
   * Get short month name by index (0-11)
   */
  getMonthNameShort: (index: number, locale?: Locale) => string;

  /**
   * Get day name by index (0-6, Monday-Sunday)
   */
  getDayName: (index: number, locale?: Locale) => string;

  /**
   * Get short day name by index (0-6, Monday-Sunday)
   */
  getDayNameShort: (index: number, locale?: Locale) => string;
}

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  currentLocale: 'ru',

  getLocaleData: () => {
    const { currentLocale } = get();
    return LOCALE_DATA[currentLocale];
  },

  getLocaleDataFor: (locale: Locale) => {
    return LOCALE_DATA[locale];
  },

  setLocale: (locale: Locale) => {
    set({ currentLocale: locale });
  },

  getMonthName: (index: number, locale?: Locale) => {
    const targetLocale = locale ?? get().currentLocale;
    const data = LOCALE_DATA[targetLocale];
    return data.monthNames[index] ?? 'Month';
  },

  getMonthNameShort: (index: number, locale?: Locale) => {
    const targetLocale = locale ?? get().currentLocale;
    const data = LOCALE_DATA[targetLocale];
    return data.monthNamesShort[index] ?? 'Mon';
  },

  getDayName: (index: number, locale?: Locale) => {
    const targetLocale = locale ?? get().currentLocale;
    const data = LOCALE_DATA[targetLocale];
    return data.dayNames[index] ?? 'Day';
  },

  getDayNameShort: (index: number, locale?: Locale) => {
    const targetLocale = locale ?? get().currentLocale;
    const data = LOCALE_DATA[targetLocale];
    return data.dayNamesShort[index] ?? 'Day';
  },
}));
