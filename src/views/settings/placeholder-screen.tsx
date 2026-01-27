import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsPlaceholderScreenProps {
  title: string;
  description: string;
}

export const SettingsPlaceholderScreen: React.FC<
  SettingsPlaceholderScreenProps
> = ({ title, description }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="main-area"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 gap-3">
        <Text className="text-2xl font-heading text-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground font-body">
          {description}
        </Text>
      </View>
    </ScrollView>
  );
};
