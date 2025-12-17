import { TabButton } from '@/components/shared/tab-button';
import { cn } from '@/lib/utils';
import { useScrollStore } from '@/stores/use-scroll-store';
import { useSegments } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SCREENS_WITHOUT_TAB = ['[date]'];

export default function TabLayout() {
  const { t } = useTranslation();

  const isScrollingDown = useScrollStore((s) => s.isScrollingDown);

  const segments = useSegments() as string[];

  const isTabBarHidden = SCREENS_WITHOUT_TAB.some((s) => segments.includes(s));

  return (
    <Tabs>
      <TabSlot />
      <TabList
        className={cn(
          'absolute bottom-9 self-center flex-row justify-evenly rounded-full transition-all duration-300 drop-shadow-2xl backdrop-blur-3xl',
          isScrollingDown ? 'bg-foreground/5' : 'bg-foreground/10',
          isTabBarHidden
            ? 'opacity-0 pointer-events-none translate-y-6'
            : 'opacity-100 pointer-events-auto translate-y-0',
        )}
      >
        <TabTrigger name="Home" href="/" asChild>
          <TabButton icon="Home">{t('common.tabs.home')}</TabButton>
        </TabTrigger>
        <TabTrigger name="second" href="/(calendar)/month" asChild>
          <TabButton icon="Calendar">{t('common.tabs.calendar')}</TabButton>
        </TabTrigger>
        <TabTrigger name="store" href="/(store)/set-up" asChild>
          <TabButton icon="Store">{t('common.tabs.store')}</TabButton>
        </TabTrigger>
        <TabTrigger name="third" href="/third" asChild>
          <TabButton icon="Settings">{t('common.tabs.settings')}</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
