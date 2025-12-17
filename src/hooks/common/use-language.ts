import { storage } from '@/lib/mmkv';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] ?? 'en-US'; // normalize

  useEffect(() => {
    const loadLanguage = () => {
      const savedLanguage = storage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage((savedLanguage as string) ?? 'en-US');
      }
    };
    loadLanguage();
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    storage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };

  return {
    currentLanguage,
    changeLanguage,
  };
}
