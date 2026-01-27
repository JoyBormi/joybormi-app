import React from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsPlaceholderScreen } from '@/views/settings';

export default function SecurityScreen() {
  const { t } = useTranslation();

  return (
    <SettingsPlaceholderScreen
      title={t('settings.pages.security.title')}
      description={t('settings.pages.security.description')}
    />
  );
}
