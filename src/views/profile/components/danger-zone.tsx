import React from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';

type DangerZoneProps = {
  title?: string;
  description: string;
  actionTitle: string;
  actionDescription: string;
  actionLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

export const DangerZone: React.FC<DangerZoneProps> = ({
  title = 'Danger Zone',
  description,
  actionTitle,
  actionDescription,
  actionLabel,
  onPress,
  disabled = false,
}) => {
  return (
    <View className="px-6 pt-2">
      <View className="rounded-3xl border border-destructive/25 bg-destructive/5 p-5">
        <View className="h-1.5 w-16 rounded-full bg-destructive/70 mb-4" />
        <Text className="font-title text-lg text-destructive">{title}</Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          {description}
        </Text>

        <View className="mt-5 rounded-2xl border border-border/40 bg-background/80 px-4 py-4">
          <Text className="font-subtitle text-foreground">{actionTitle}</Text>
          <Text className="mt-1 text-xs text-muted-foreground">
            {actionDescription}
          </Text>
          <Button
            variant="destructive"
            className="mt-4"
            onPress={onPress}
            disabled={disabled}
          >
            <Text>{actionLabel}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
