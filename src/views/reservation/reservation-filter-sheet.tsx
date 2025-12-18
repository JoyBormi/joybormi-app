import { useColorScheme } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ReservationFilters, ReservationStatus } from './types';

interface Props {
  filters: ReservationFilters;
  onApply: (filters: ReservationFilters) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: ReservationStatus[] = [
  'confirmed',
  'pending',
  'cancelled',
];
const TYPE_OPTIONS = [
  'Haircut',
  'Coloring',
  'Styling',
  'Treatment',
  'Consultation',
];

export const ReservationFilterSheet = forwardRef<BottomSheetModal, Props>(
  ({ filters, onApply, onClose }, ref) => {
    const { colors } = useColorScheme();
    const [localFilters, setLocalFilters] =
      useState<ReservationFilters>(filters);

    const snapPoints = useMemo(() => ['70%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsAt={-1}
          appearsAt={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const toggleStatus = (status: ReservationStatus) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        statuses: prev.statuses.includes(status)
          ? prev.statuses.filter((s) => s !== status)
          : [...prev.statuses, status],
      }));
    };

    const toggleType = (type: string) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        types: prev.types.includes(type)
          ? prev.types.filter((t) => t !== type)
          : [...prev.types, type],
      }));
    };

    const handleApply = () => {
      Feedback.success();
      onApply(localFilters);
      onClose();
    };

    const handleReset = () => {
      Feedback.medium();
      const resetFilters: ReservationFilters = {
        dateRange: {
          start: dayjs().format('YYYY-MM-DD'),
          end: dayjs().add(1, 'month').format('YYYY-MM-DD'),
        },
        statuses: [],
        types: [],
      };
      setLocalFilters(resetFilters);
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
        detached={true}
        bottomInset={46}
        style={{ marginHorizontal: 16 }}
      >
        <BottomSheetView className="flex-1 p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl text-foreground font-bold">Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-primary font-medium">Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Date Range Summary */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Date Range
              </Text>
              <View className="bg-muted/30 p-4 rounded-2xl flex-row items-center justify-between">
                <View>
                  <Text className="text-xs text-muted-foreground">From</Text>
                  <Text className="text-foreground font-bold">
                    {dayjs(localFilters.dateRange.start).format('MMM D, YYYY')}
                  </Text>
                </View>
                <Icons.ChevronRight className="text-muted-foreground w-4 h-4" />
                <View className="items-end">
                  <Text className="text-xs text-muted-foreground">To</Text>
                  <Text className="text-foreground font-bold">
                    {dayjs(localFilters.dateRange.end).format('MMM D, YYYY')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Statuses */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Status
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => toggleStatus(status)}
                    className={cn(
                      'px-4 py-2 rounded-full border border-border',
                      localFilters.statuses.includes(status) &&
                        'bg-primary border-primary',
                    )}
                  >
                    <Text
                      className={cn(
                        'capitalize font-medium',
                        localFilters.statuses.includes(status)
                          ? 'text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Event Types */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Event Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {TYPE_OPTIONS.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleType(type)}
                    className={cn(
                      'px-4 py-2 rounded-full border border-border',
                      localFilters.types.includes(type) &&
                        'bg-primary border-primary',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-medium',
                        localFilters.types.includes(type)
                          ? 'text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary h-14 rounded-2xl items-center justify-center mt-4"
            onPress={handleApply}
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Apply Filters
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ReservationFilterSheet.displayName = 'ReservationFilterSheet';
