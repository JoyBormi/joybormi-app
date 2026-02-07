import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorCodes } from '@/constants/error-codes';
import { ApiError } from '@/lib/agent';
import { storage } from '@/lib/mmkv';
import { queryClient } from '@/lib/tanstack-query';
import { toast } from '@/providers/toaster';
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
              ? t('common.errors.sessionExpired')
              : t('common.errors.unauthorized');

          // Show alert to inform user
          alert({
            title,
            subtitle: message,
            confirmLabel: t('common.buttons.logout'),
            onConfirm: handleLogout,
            cancelLabel: null,
          });
          return;
        }

        if (status === 0) {
          return alert({
            title: t('common.errors.ohNo'),
            subtitle: t('common.errors.somethingWentWrong'),
            confirmLabel: t('common.buttons.ok'),
            cancelLabel: null,
          });
        }

        // Show error message from backend (backend provides localized messages)
        toast.error({
          title: message ?? t('common.errors.somethingWentWrong'),
        });

        return;
      }

      // If it's not an ApiError, show a generic error
      alert({
        title: t('common.errors.ohNo'),
        subtitle: error.message ?? t('common.errors.somethingWentWrong'),
        confirmLabel: t('common.buttons.ok'),
        cancelLabel: null,
      });
    },
    [t, handleLogout],
  );

  return { errorHandler };
};
