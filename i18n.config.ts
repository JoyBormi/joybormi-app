import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod/v4';

import { storage } from '@/lib/mmkv';
import { uzLocale } from '@/utils/uz.zod';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

export type Locale = 'en' | 'ru' | 'uz';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
};

let initialized = false;

function normalizeLocale(value?: string): Locale {
  if (!value) return 'ru';
  const base = value.split('-')[0];
  if (base === 'en' || base === 'ru' || base === 'uz') return base;
  return 'ru';
}

export async function initI18n() {
  if (initialized) return i18next;

  const device =
    Localization.getLocales()[0]?.languageCode ??
    Localization.getLocales()[0]?.languageTag;

  const stored = storage.getItem('language');
  const lng = normalizeLocale((stored as string) ?? device);

  await i18next.use(initReactI18next).init({
    lng,
    fallbackLng: 'en',
    resources,
    interpolation: { escapeValue: false },
  });

  applyZodLocale(lng);

  initialized = true;
  return i18next;
}

export async function changeLanguage(lng: Locale) {
  const normalized = normalizeLocale(lng);
  storage.setItem('language', normalized);

  if (!initialized) {
    await initI18n();
  }

  await i18next.changeLanguage(normalized);
  applyZodLocale(normalized);
}

function applyZodLocale(lng: Locale) {
  try {
    if (lng === 'uz') {
      z.config({ localeError: uzLocale() });
    } else if (z.locales?.[lng]) {
      z.config(z.locales[lng]());
    } else if (z.locales?.en) {
      z.config(z.locales.en());
    } else {
      z.config({ localeError: undefined });
    }
  } catch {
    // do nothing — never crash app startup
  }
}

export { i18next as i18n };
