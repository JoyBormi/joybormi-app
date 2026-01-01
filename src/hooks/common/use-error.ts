import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorCodes } from '@/constants/error-codes';
import { ApiError } from '@/lib/agent';
import { storage } from '@/lib/mmkv';
import { queryClient } from '@/lib/tanstack-query';
import { useUserStore } from '@/stores';
import { alert } from '@/stores/use-alert-store';
import { EUserType } from '@/types/user.type';

export const useError = () => {
  const { t } = useTranslation();
  const { setUser, setIsLoggedIn, setAppType } = useUserStore();

  const handleLogout = useCallback(() => {
    storage.removeItem('auth_token');
    setUser(null);
    setIsLoggedIn(false);
    setAppType(EUserType.GUEST);
    queryClient.clear();
  }, [setUser, setIsLoggedIn, setAppType]);

  const errorHandler = useCallback(
    (error: Error) => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`[USE-ERROR.TS] 👉:`, JSON.stringify(error, null, 2));
      }

      if (error instanceof ApiError) {
        const { message, code, status } = error;

        // Handle ALL 401 errors as session expiration/unauthorized
        // Logout immediately, then show alert
        if (status === 401) {
          // Determine title based on error code
          const title =
            code === ErrorCodes.AUTH_SESSION_EXPIRED
              ? t('common.error.sessionExpired')
              : t('common.error.unauthorized');

          // Show alert to inform user
          alert({
            title,
            subtitle: message,
            confirmLabel: t('common.buttons.ok'),
            onConfirm: handleLogout,
            cancelLabel: null,
          });
          return;
        }

        // Show error message from backend (backend provides localized messages)
        alert({
          title: t('common.error.title'),
          subtitle: message,
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
    [t, handleLogout],
  );

  return { errorHandler };
};
