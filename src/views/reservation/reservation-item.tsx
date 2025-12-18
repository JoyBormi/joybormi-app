import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Reservation } from './types';

interface Props {
  reservation: Reservation;
  onPress: (r: Reservation) => void;
  index: number;
}

const STATUS_STYLES: Record<
  string,
  { dot: string; pill: string; text: string }
> = {
  confirmed: {
    dot: 'bg-green-500',
    pill: 'bg-green-500/15',
    text: 'text-green-600',
  },
  pending: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/15',
    text: 'text-amber-600',
  },
  cancelled: {
    dot: 'bg-red-500',
    pill: 'bg-red-500/15',
    text: 'text-red-600',
  },
  completed: {
    dot: 'bg-green-500',
    pill: 'bg-green-500/15',
    text: 'text-green-600',
  },
  rejected: {
    dot: 'bg-red-500',
    pill: 'bg-red-500/15',
    text: 'text-red-600',
  },
};

export const ReservationItem = ({ reservation, onPress, index }: Props) => {
  const startTime = dayjs(reservation.start).format('h:mm A');
  const duration = dayjs(reservation.end).diff(
    dayjs(reservation.start),
    'minute',
  );

  const status = STATUS_STYLES[reservation.status] ?? {
    dot: 'bg-muted',
    pill: 'bg-muted/20',
    text: 'text-muted-foreground',
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12, scale: 0.96 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        delay: index * 40,
        type: 'timing',
        duration: 360,
      }}
      className="mb-3"
    >
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          Feedback.light();
          onPress(reservation);
        }}
        className="flex-row overflow-hidden rounded-3xl border border-border/20 bg-card/70"
      >
        {/* Time rail */}
        <View className="w-1/4 items-center justify-center bg-muted/40">
          <Text className="text-[15px] font-bold text-foreground">
            {startTime}
          </Text>
          <Text className="mt-1 text-[11px] font-medium text-muted-foreground">
            {duration} min
          </Text>
        </View>

        {/* Main content */}
        <View className="flex-1 p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: reservation.avatar }}
                className="h-12 w-12 rounded-xl bg-muted"
                contentFit="cover"
                transition={200}
              />

              <View className="ml-3">
                <Text
                  numberOfLines={1}
                  className="text-[16px] font-bold text-foreground"
                >
                  {reservation.name}
                </Text>
                <Text
                  numberOfLines={1}
                  className="mt-0.5 text-[13px] font-medium text-muted-foreground"
                >
                  {reservation.service}
                </Text>
              </View>
            </View>

            {/* Status pill */}
            <View className={cn('rounded-full px-2.5 py-1', status.pill)}>
              <Text
                className={cn(
                  'text-[11px] font-bold uppercase tracking-wide',
                  status.text,
                )}
              >
                {reservation.status}
              </Text>
            </View>
          </View>

          {/* Footer meta */}
          <View className="mt-3 flex-row items-center justify-start">
            <Text className="text-xs font-medium text-muted-foreground">
              {reservation.summary}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};
