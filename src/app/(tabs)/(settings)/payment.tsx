import React from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsPlaceholderScreen } from '@/views/settings';

export default function PaymentScreen() {
  const { t } = useTranslation();

  return (
    <SettingsPlaceholderScreen
      title={t('settings.pages.payment.title')}
      description={t('settings.pages.payment.description')}
    />
  );
}
