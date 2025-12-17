import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import enLocalization from '@/locales/en.json';
import ruLocalization from '@/locales/ru.json';
import uzLocalization from '@/locales/uz.json';

import { storage } from '@/lib/mmkv';
import { z } from 'zod';
import { makeZodI18nMap, zodI18nMap } from 'zod-i18n-map';

const resources = {
  'en-US': { translation: enLocalization, zod: enLocalization.zod },
  'ru-RU': { translation: ruLocalization, zod: ruLocalization.zod },
  'uz-UZ': { translation: uzLocalization, zod: uzLocalization.zod },
};

export type Locale = keyof typeof resources;

export const initI18n = async () => {
  let savedLanguage = 'en-US';

  try {
    const localeCode = Localization.getLocales()[0]?.languageCode;
    if (Platform.OS !== 'web') {
      const stored = await storage.getItem('language');
      savedLanguage = stored || localeCode || 'en-US';
    } else {
      savedLanguage = localeCode || 'en-US';
    }
  } catch (e) {
    console.warn('Error loading language:', e);
  }

  await i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    lng: savedLanguage,
    fallbackLng: 'en-US',
    ns: ['zod'],
    defaultNS: 'translation',
    resources,
    interpolation: { escapeValue: false },
  });

  try {
    z.setErrorMap(makeZodI18nMap({ t: i18next.t, ns: ['zod'] }));
  } catch (err) {
    console.warn(err);
    z.setErrorMap(zodI18nMap); // fallback
  }

  return i18next;
};

export default i18next;
