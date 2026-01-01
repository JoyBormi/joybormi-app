import React from 'react';
import { View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import Icons, { Icon } from '@/lib/icons';

type FeatureItemProps = {
  title: string;
  description: string;
  icon: Icon;
};

export const FeatureItem = ({ title, description, icon }: FeatureItemProps) => {
  const Icon = Icons[icon as Icon];
  return (
    <Animated.View
      entering={SlideInRight.springify()}
      className="flex-row items-start gap-4"
    >
      <View className="p-2 bg-primary/10 rounded-xl">
        <Icon size={28} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold mb-1">{title}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
    </Animated.View>
  );
};
