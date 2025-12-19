import { useYScroll } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import React, { Fragment, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReservationItem } from './reservation-item';
import { Reservation, ReservationFilters } from './types';

interface ReservationSection {
  title: string;
  date: string;
  data: Reservation[];
}

interface Props {
  reservations: Reservation[];
  onReservationPress: (r: Reservation) => void;
  onFilterPress: () => void;
  filters: ReservationFilters;
  isLoading: boolean;
  onLoadMore: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ReservationList = ({
  reservations,
  onReservationPress,
  onFilterPress,
  filters,
  isLoading,
  onLoadMore,
  isRefreshing,
  onRefresh,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { onScroll } = useYScroll();

  // Group reservations by date
  const sections = useMemo(() => {
    const grouped = reservations.reduce(
      (acc, reservation) => {
        const date = dayjs(reservation.start_time).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(reservation);
        return acc;
      },
      {} as Record<string, Reservation[]>,
    );

    return Object.entries(grouped)
      .map(([date, data]) => ({
        title: dayjs(date).format('dddd, MMMM D'),
        date,
        data,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [reservations]);

  const renderHeader = useCallback(() => {
    const activeFiltersCount = filters.statuses.length + filters.types.length;

    return (
      <View className="mb-4 mt-4" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-4xl text-foreground font-heading tracking-tight">
              Reservations
            </Text>
            <Text className="text-muted-foreground font-body mt-1.5">
              {dayjs(filters.dateRange.start).format('MMM D')} -{' '}
              {dayjs(filters.dateRange.end).format('MMM D')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Feedback.light();
              onFilterPress();
            }}
            className={cn(
              'w-12 h-12 rounded-2xl items-center justify-center border backdrop-blur-sm',
              activeFiltersCount > 0
                ? 'bg-primary border-primary'
                : 'bg-card/50 border-border/20',
            )}
          >
            <Icons.SlidersHorizontal
              className={cn(
                'w-5 h-5',
                activeFiltersCount > 0
                  ? 'text-primary-foreground'
                  : 'text-foreground',
              )}
            />
            {activeFiltersCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-destructive w-5 h-5 rounded-full items-center justify-center border-2 border-background">
                <Text className="text-[10px] text-white font-subtitle">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Filter Chips */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full border border-primary/20"
          >
            <Text className="text-primary font-subtitle text-xs">Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-card/50 px-4 py-2 rounded-full border border-border/20 backdrop-blur-sm"
          >
            <Text className="text-muted-foreground font-subtitle text-xs">
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [filters, onFilterPress, insets.top]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: ReservationSection }) => {
      const isToday = dayjs(section.date).isSame(dayjs(), 'day');
      const isTomorrow = dayjs(section.date).isSame(
        dayjs().add(1, 'day'),
        'day',
      );

      let displayTitle = section.title;
      if (isToday) displayTitle = 'Today';
      else if (isTomorrow) displayTitle = 'Tomorrow';

      return (
        <View
          className="bg-background/30 backdrop-blur-xl py-3 mb-3"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row items-center gap-3 px-1">
            <View className="h-px flex-1 bg-border/40" />
            <View className="bg-card/60 dark:bg-card/40 px-6 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
              <Text className=" text-foreground font-caption tracking-tight">
                {displayTitle}
              </Text>
            </View>
            <View className="h-px flex-1 bg-border/40" />
          </View>
        </View>
      );
    },
    [insets.top],
  );

  const renderFooter = useCallback(() => {
    if (!isLoading) return <View style={{ height: 40 }} />;
    return (
      <View className="py-8 items-center">
        <ActivityIndicator color="hsl(var(--primary))" />
      </View>
    );
  }, [isLoading]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-muted/30 rounded-full items-center justify-center mb-6">
          <Icons.Calendar className="text-muted-foreground w-10 h-10 opacity-50" />
        </View>
        <Text className="text-xl text-foreground font-bold">
          No reservations found
        </Text>
        <Text className="text-muted-foreground text-center mt-2 px-10">
          Try adjusting your filters to find what youre looking for.
        </Text>
        <TouchableOpacity
          onPress={onFilterPress}
          className="mt-8 bg-primary/10 px-6 py-3 rounded-2xl"
        >
          <Text className="text-primary font-bold">Clear Filters</Text>
        </TouchableOpacity>
      </View>
    );
  }, [isLoading, onFilterPress]);

  return (
    <Fragment>
      {/* Animated floating header on scroll */}
      {/* <MotiView
        animate={{
          translateY: scrollY > 100 ? 0 : -100,
          opacity: scrollY > 100 ? 1 : 0,
        }}
        transition={{ type: 'timing', duration: 200 }}
        className="absolute top-0 -left-10 right-0 z-50"
        style={{
          paddingTop: insets.top,
        }}
      >
        <View className="bg-background backdrop-blur-xl border-b border-border/20 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Icons.Calendar className="text-muted-foreground w-4 h-4" />
              <Text className="text-sm text-foreground font-subtitle">
                {dayjs(filters.dateRange.start).format('MMM D')} -{' '}
                {dayjs(filters.dateRange.end).format('MMM D')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Feedback.light();
                onFilterPress();
              }}
              className="w-9 h-9 rounded-xl bg-card/50 items-center justify-center border border-border/20"
            >
              <Icons.Settings className="text-foreground w-4.5 h-4.5" />
            </TouchableOpacity>
          </View>
        </View>
      </MotiView> */}

      <SectionList
        scrollEventThrottle={16}
        onScroll={onScroll}
        sections={sections}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item, index }) => (
          <ReservationItem
            reservation={item}
            onPress={onReservationPress}
            index={index % 10}
          />
        )}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        className="flex-1"
      />
    </Fragment>
  );
};
