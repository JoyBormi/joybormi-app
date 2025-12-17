import { Text } from '@/components/ui';
import { useColorScheme, useLanguage } from '@/hooks/common';
import Icons from '@/lib/icons';
import { StackHeader } from '@/views/calendars';
import dayjs from 'dayjs';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';

export default function CalendarLayout() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { currentLanguage } = useLanguage();
  const { date, month } = useGlobalSearchParams<{
    date: string;
    month?: string;
  }>();

  const locale =
    LocaleConfig.locales[currentLanguage] ?? LocaleConfig.locales.en;

  const enLocale = LocaleConfig.locales.en;

  // month from param (ALWAYS ENGLISH)
  const monthIndexFromParam =
    typeof month === 'string' ? enLocale.monthNames.indexOf(month) : -1;

  // fallback to date
  const monthIndex =
    monthIndexFromParam >= 0 ? monthIndexFromParam : dayjs(date).month();

  const monthName = locale.monthNames[monthIndex];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        keyboardHandlingEnabled: true,
        headerBackButtonMenuEnabled: false,
        headerTransparent: false,
      }}
    >
      <Stack.Screen
        name="month"
        options={{
          headerShown: true,
          autoHideHomeIndicator: true,
          header: ({ options }) => <StackHeader options={options} />,
        }}
      />

      <Stack.Screen
        name="(week)/[date]"
        options={{
          headerShown: true,
          headerBackTitle: monthName,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Icons.ChevronLeft size={24} className="text-primary" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View className="min-w-fit">
              <Text className="font-subtitle text-center truncate">
                {monthName}
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
