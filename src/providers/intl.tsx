import { uzLocale } from '@/utils/uz.zod';
import { i18n, initI18n, type Locale } from 'i18n.config';
import { PropsWithChildren, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { z } from 'zod/v4';

function applyZodLocale(lng: string) {
  const base = lng.split('-')[0] as Locale;

  try {
    if (base === 'uz') {
      z.config({ localeError: uzLocale() });
      return;
    }

    if (z.locales?.[base]) {
      z.config(z.locales[base]());
      return;
    }

    if (z.locales?.en) {
      z.config(z.locales.en());
      return;
    }

    z.config({ localeError: undefined });
  } catch {
    // never crash the app because of locale config
  }
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    initI18n().then(() => {
      // Apply once after init
      applyZodLocale(i18n.language);

      // Apply on every language change
      const handler = (lng: string) => applyZodLocale(lng);
      i18n.on('languageChanged', handler);

      unsub = () => i18n.off('languageChanged', handler);

      setReady(true);
    });

    return () => {
      unsub?.();
    };
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
