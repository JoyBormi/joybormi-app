import dayjs from 'dayjs';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { useColorScheme } from '@/hooks/common';
import { useLocaleData } from '@/hooks/common/use-locale-data';
import Icons from '@/lib/icons';
import { StackHeader } from '@/views/calendars';

export default function CalendarLayout() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { getMonthName } = useLocaleData();
  const enMonthNames = useLocaleData('en').monthNames;
  const { date, month } = useGlobalSearchParams<{
    date: string;
    month?: string;
  }>();

  // month from param (ALWAYS ENGLISH)
  const monthIndexFromParam =
    typeof month === 'string' ? enMonthNames.indexOf(month) : -1;

  // fallback to date
  const monthIndex =
    monthIndexFromParam >= 0 ? monthIndexFromParam : dayjs(date).month();

  const monthName = getMonthName(monthIndex);

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
            <Pressable onPress={() => router.back()}>
              <Icons.ChevronLeft size={24} className="text-primary" />
            </Pressable>
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
