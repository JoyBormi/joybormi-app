import React from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsPlaceholderScreen } from '@/views/settings';

export default function HelpScreen() {
  const { t } = useTranslation();

  return (
    <SettingsPlaceholderScreen
      title={t('settings.pages.help.title')}
      description={t('settings.pages.help.description')}
    />
  );
}
