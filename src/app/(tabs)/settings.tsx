import { LanguageToggle } from '@/components/shared/language-toggle';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Text } from '@/components/ui';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreeen: React.FC = () => {
  return (
    <SafeAreaView className="safe-area">
      <View className="main-area gap-y-10 items-center">
        <ThemeToggle />
        <LanguageToggle />
        <Link href="/(auth)/login" className="text-center">
          <Text className="text-pretty text-purple-600">Go to Auth</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreeen;
