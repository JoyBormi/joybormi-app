import React from 'react';
import { ScrollView } from 'react-native';

import { Text } from '@/components/ui';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProfileTabItem<T extends string> = {
  value: T;
  label: string;
};

interface ProfileTabsBarProps<T extends string> {
  tabs: readonly ProfileTabItem<T>[];
}

export function ProfileTabsBar<T extends string>({
  tabs,
}: ProfileTabsBarProps<T>) {
  return (
    <TabsList className="bg-background/95 backdrop-blur-xl border-b border-border mt-4 mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-6"
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <Text>{tab.label}</Text>
          </TabsTrigger>
        ))}
      </ScrollView>
    </TabsList>
  );
}
