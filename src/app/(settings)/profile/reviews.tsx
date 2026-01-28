import React from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsPlaceholderScreen } from '@/views/settings';

export default function ReviewsScreen() {
  const { t } = useTranslation();

  return (
    <SettingsPlaceholderScreen
      title={t('settings.pages.reviews.title')}
      description={t('settings.pages.reviews.description')}
    />
  );
}
