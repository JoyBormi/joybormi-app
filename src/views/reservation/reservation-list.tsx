import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReservationItem } from './reservation-item';
import { Reservation, ReservationFilters } from './types';

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

  const renderHeader = useCallback(() => {
    const activeFiltersCount = filters.statuses.length + filters.types.length;

    return (
      <View className="mb-6 mt-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-4xl text-foreground font-bold tracking-tight">
              Reservations
            </Text>
            <Text className="text-muted-foreground font-medium mt-1">
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
              'w-12 h-12 rounded-2xl items-center justify-center border border-border',
              activeFiltersCount > 0 ? 'bg-primary border-primary' : 'bg-card',
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
                <Text className="text-[10px] text-white font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Filter Chips (Optional/Creative) */}
        <View className="flex-row items-center gap-2">
          <View className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Text className="text-primary font-bold text-xs">Today</Text>
          </View>
          <View className="bg-muted/30 px-4 py-2 rounded-full border border-border/50">
            <Text className="text-muted-foreground font-bold text-xs">
              Upcoming
            </Text>
          </View>
        </View>
      </View>
    );
  }, [filters, onFilterPress]);

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
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <ReservationItem
          reservation={item}
          onPress={onReservationPress}
          index={index % 10} // Reset animation delay for large lists
        />
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100,
      }}
      className="flex-1"
    />
  );
};
