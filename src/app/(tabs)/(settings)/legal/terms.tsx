import React from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsPlaceholderScreen } from '@/views/settings';

export default function TermsScreen() {
  const { t } = useTranslation();

  return (
    <SettingsPlaceholderScreen
      title={t('settings.pages.terms.title')}
      description={t('settings.pages.terms.description')}
    />
  );
}
