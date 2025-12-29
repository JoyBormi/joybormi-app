import { ApiError } from '@/lib/agent';
import { alert } from '@/stores/use-alert-store';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useError = () => {
  const { t } = useTranslation();

  const errorHandler = useCallback(
    (error: Error) => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(
          `Mutation Error, use-error.ts 👉:`,
          JSON.stringify(error, null, 2),
        );
      }
      if (error instanceof ApiError) {
        const { message } = error;
        // if (status === 401 && code === '90001') {
        //   alert({
        //     title: t('common.error.unauthorized'),
        //     subtitle: t('common.error.unauthorizedSubtitle'),
        //     confirmLabel: t('common.buttons.backToLogin'),
        //     cancelLabel: null,
        //   });
        //   return;
        // }

        alert({
          title: t('common.error.title'),
          subtitle: message ?? t('common.error.subtitle'),
          confirmLabel: t('common.buttons.ok'),
          cancelLabel: null,
        });
        return;
      }

      // If it's not an ApiError, show a generic error
      alert({
        title: t('common.error.title'),
        subtitle: t('common.error.subtitle'),
        confirmLabel: t('common.buttons.ok'),
        cancelLabel: null,
      });
    },
    [t],
  );

  return { errorHandler };
};
