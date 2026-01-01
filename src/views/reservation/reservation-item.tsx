import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { STATUS_STYLES } from './reservation.utils';
import { Reservation } from './types';

interface Props {
  reservation: Reservation;
  onPress: (r: Reservation) => void;
  index: number;
}

export const ReservationItem = ({ reservation, onPress, index }: Props) => {
  const startTime = dayjs(reservation.start_time).format('h:mm A');
  const endTime = dayjs(reservation.end_time).format('h:mm A');
  const duration = dayjs(reservation.end_time).diff(
    dayjs(reservation.start_time),
    'minute',
  );

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const statusStyle = STATUS_STYLES[reservation.status] ?? {
    bgColor: 'bg-muted/50',
    textColor: 'text-muted-foreground',
    icon: Icons.Info,
  };

  const StatusIcon = statusStyle.icon;

  // Status-based gradient colors
  const getGradientColors = (): [string, string] => {
    switch (reservation.status) {
      case 'approved':
      case 'confirmed':
        return ['rgba(34, 197, 94, 0.08)', 'rgba(34, 197, 94, 0.02)'];
      case 'pending':
        return ['rgba(251, 191, 36, 0.08)', 'rgba(251, 191, 36, 0.02)'];
      case 'rejected':
      case 'cancelled':
        return ['rgba(239, 68, 68, 0.08)', 'rgba(239, 68, 68, 0.02)'];
      case 'completed':
        return ['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0.02)'];
      default:
        return ['rgba(170, 0, 170, 0.08)', 'rgba(170, 0, 170, 0.02)'];
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.96 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        delay: index * 50,
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      className="mb-4"
    >
      <Pressable
        activeOpacity={0.8}
        onPress={() => {
          Feedback.light();
          onPress(reservation);
        }}
        className="overflow-hidden rounded-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        {/* Glassy background with status-based gradient */}
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border dark:border-border/20"
        >
          {/* Accent color glow */}
          {reservation.color && (
            <View
              className="absolute top-0 left-0 right-0 h-24 opacity-20"
              style={{
                backgroundColor: reservation.color,
                shadowColor: reservation.color,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
              }}
            />
          )}

          <View className="p-5">
            {/* Header: Title + Status */}
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-4">
                <Text className="text-xl text-foreground font-title tracking-tight leading-tight mb-1.5">
                  {reservation.title}
                </Text>
                <Text className="text-sm text-muted-foreground/80 font-body">
                  {reservation.brand_name}
                </Text>
              </View>

              {/* Floating status badge */}
              <MotiView
                from={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 50 + 100, type: 'spring' }}
              >
                <View
                  className={cn(
                    'flex-row items-center gap-1.5 px-3.5 py-2 rounded-full backdrop-blur-sm',
                    statusStyle.bgColor,
                  )}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  }}
                >
                  <StatusIcon
                    className={cn('w-3.5 h-3.5', statusStyle.textColor)}
                  />
                  <Text
                    className={cn(
                      'text-xs font-medium capitalize',
                      statusStyle.textColor,
                    )}
                  >
                    {reservation.status}
                  </Text>
                </View>
              </MotiView>
            </View>

            {/* Service card - elevated micro-card */}
            <View className="flex-1 flex-row items-center gap-2">
              <Text className="text-base text-foreground font-semibold leading-tight">
                {reservation.service}
              </Text>
              <Text className="text-xs text-muted-foreground/70 font-body">
                with {reservation.worker_name}
              </Text>
            </View>

            {/* Time section - horizontal layout */}
            <View className="flex-row items-center justify-between border-t border-border/50 dark:border-border/20 pt-2">
              {/* Duration badge */}
              <View className="flex-row items-center gap-2 px-1.5 py-1 rounded-xl bg-border/30 dark:bg-black/10 border border-border/20  dark:border-border/20">
                <Icons.CalendarDays className="text-muted-foreground/70 w-2.5 h-2.5" />
                <Text className="text-xs text-foreground font-medium tracking-tight">
                  {durationText}
                </Text>
              </View>
              {/* Time range */}
              <View>
                <Text className="text-xs text-muted-foreground/60 self-end font-body mb-0.5">
                  Time
                </Text>
                <Text className="text-sm text-foreground font-medium tracking-tight">
                  {startTime} - {endTime}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </MotiView>
  );
};
