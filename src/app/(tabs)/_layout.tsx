import { useRouter, useSegments } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/shared/tab-button';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

const SCREENS_WITHOUT_TAB = ['[date]'];

export default function TabLayout() {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { appType, isLoggedIn } = useUserStore();

  const segments = useSegments() as string[];
  const router = useRouter();

  const isTabBarHidden = SCREENS_WITHOUT_TAB.some((s) => segments.includes(s));

  // ────────────────── Memos ────────────────── //
  const isOnBrandProfile = useMemo(
    () => segments.includes('brand-profile'),
    [segments],
  );
  const isOnWorkerProfile = useMemo(
    () => segments.includes('worker-profile'),
    [segments],
  );

  useEffect(() => {
    if (appType === EUserType.CREATOR && isOnWorkerProfile) {
      router.replace(routes.tabs.brand.brand_profile);
      return;
    }

    if (appType === EUserType.WORKER && isOnBrandProfile) {
      router.replace(routes.tabs.brand.worker_profile);
    }
  }, [appType, isOnBrandProfile, isOnWorkerProfile, router]);

  return (
    <Tabs key={appType}>
      <TabSlot />
      <TabList
        className={cn(
          'absolute self-center flex-row justify-evenly bg-foreground/30 rounded-full transition-all duration-300 drop-shadow-2xl backdrop-blur-3xl',
          isTabBarHidden
            ? 'opacity-0 pointer-events-none translate-y-6'
            : 'opacity-100 pointer-events-auto translate-y-0',
        )}
        style={{ bottom: insets.bottom + 5 }}
      >
        <TabTrigger name="Home" href="/" asChild>
          <TabButton icon="Home">{t('common.tabs.home')}</TabButton>
        </TabTrigger>
        {appType !== EUserType.CREATOR && isLoggedIn && (
          <Fragment>
            <TabTrigger name="second" href="/(calendar)/month" asChild>
              <TabButton icon="Calendar">{t('common.tabs.calendar')}</TabButton>
            </TabTrigger>
            <TabTrigger name="reservations" href="/reservations" asChild>
              <TabButton icon="List">{t('common.tabs.reservations')}</TabButton>
            </TabTrigger>
          </Fragment>
        )}
        {appType === EUserType.CREATOR && isLoggedIn && (
          <TabTrigger
            name="brand"
            href={routes.tabs.brand.brand_profile}
            asChild
          >
            <TabButton icon="Store">{t('common.tabs.store')}</TabButton>
          </TabTrigger>
        )}
        {appType === EUserType.WORKER && isLoggedIn && (
          <TabTrigger
            name="worker"
            href={routes.tabs.brand.worker_profile}
            asChild
          >
            <TabButton icon="Users">{t('common.tabs.profile')}</TabButton>
          </TabTrigger>
        )}
        <TabTrigger name="settings" href={routes.tabs.profile} asChild>
          <TabButton icon="Settings">{t('common.tabs.settings')}</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
