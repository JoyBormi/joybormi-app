import dayjs from 'dayjs';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';

import { Text } from '@/components/ui';
import { useColorScheme } from '@/hooks/common';

const TimelineEvent: FC<PackedEvent> = ({
  title,
  start,
  end,
  color,
  summary,
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const textColor = isDarkColorScheme ? '#000000' : '#FFFFFF';

  const durationMinutes = dayjs(end).diff(dayjs(start), 'minute');

  const showTime = durationMinutes >= 30;
  const showSummary = durationMinutes >= 60 && !!summary;

  return (
    <View style={{ backgroundColor: color }}>
      <Text
        className="font-semibold text-sm"
        style={{ color: textColor }}
        numberOfLines={2}
      >
        {title}
      </Text>
      {showTime && (
        <Text
          className="text-xs my-0.5"
          style={{ color: textColor, opacity: 0.9 }}
        >
          {dayjs(start).format('HH:mm')} - {dayjs(end).format('HH:mm')}
        </Text>
      )}
      {summary && showSummary && (
        <Text
          className="text-xs"
          style={{ color: textColor, opacity: 0.8 }}
          numberOfLines={2}
        >
          {summary}
        </Text>
      )}
    </View>
  );
};

export { TimelineEvent };
