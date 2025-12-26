import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import dayjs, { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import weekday from 'dayjs/plugin/weekday';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLocaleData } from '@/hooks/common/use-locale-data';

/* dayjs setup */
extend(localeData);
extend(weekday);
extend(localizedFormat);

interface CalendarRef {
  current: {
    scrollToDay?: (date: string) => void;
  };
}

interface CustomNavigationOptions extends NativeStackNavigationOptions {
  calendarRef?: CalendarRef;
}

interface IStackHeaderProps {
  options: CustomNavigationOptions;
}

export const StackHeader: React.FC<IStackHeaderProps> = ({ options }) => {
  const { t } = useTranslation();
  const { dayNamesShort, getMonthName } = useLocaleData();
  const enMonthNames = useLocaleData('en').monthNames;

  const calendarRef = options.calendarRef;

  // fallback in-case options is undefined
  const date = new Date();
  const yearFallback = date.getFullYear();
  const monthIndexFallback = date.getMonth();

  const rawYear = Number(options.headerBackTitle);
  const year = Number.isNaN(rawYear) ? yearFallback : rawYear;

  const monthIndexFromTitle =
    typeof options.title === 'string'
      ? enMonthNames.indexOf(options.title)
      : -1;

  const monthIndex =
    monthIndexFromTitle >= 0 ? monthIndexFromTitle : monthIndexFallback;

  const title = getMonthName(monthIndex);

  return (
    <View className="bg-background border-b border-border">
      <SafeAreaView edges={['top']} className="px-6 pt-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-caption text-xs text-muted-foreground">
              {year}
            </Text>
            <Text className="text-primary font-heading capitalize">
              {title}
            </Text>
          </View>

          <Button
            size="sm"
            onPress={() =>
              calendarRef?.current?.scrollToDay?.(dayjs().format('YYYY-MM-DD'))
            }
          >
            <Text className="text-primary-foreground font-medium">
              {t('common.labels.today')}
            </Text>
          </Button>
        </View>
      </SafeAreaView>

      <View className="flex-row justify-between py-2 px-8 gap-1">
        {dayNamesShort.map((day: string) => (
          <Text
            key={day}
            className="text-caption capitalize text-muted-foreground"
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};
