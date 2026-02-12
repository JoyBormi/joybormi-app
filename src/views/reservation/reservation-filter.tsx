import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CustomBottomSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

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
    const [localFilters, setLocalFilters] =
      useState<ReservationFilters>(filters);

    useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);

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
      <CustomBottomSheet
        ref={ref}
        snapPoints={['80%', '95%']}
        index={0}
        enablePanDownToClose
        enableDismissOnClose
        scrollEnabled
        scrollConfig={{ className: 'flex-1' }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl text-foreground font-heading tracking-tight">
            Filters
          </Text>
          <Pressable onPress={handleReset}>
            <Text className="text-primary font-subtitle">Reset</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 -mx-6 px-6"
        >
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
                <Pressable
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
                </Pressable>
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
                <Pressable
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
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="pt-4 border-t border-border/10 mt-4">
          <Pressable
            activeOpacity={0.8}
            className="bg-primary h-14 rounded-2xl items-center justify-center"
            onPress={handleApply}
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </CustomBottomSheet>
    );
  },
);

ReservationFilterSheet.displayName = 'ReservationFilterSheet';
