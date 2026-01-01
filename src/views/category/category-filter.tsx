import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Input } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

export interface CategoryFilters {
  search: string;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number[];
  distance: number;
  sortBy: 'distance' | 'rating' | 'price';
}

interface Props {
  filters: CategoryFilters;
  onApply: (filters: CategoryFilters) => void;
  onClose: () => void;
}

const RATING_OPTIONS = [5, 4, 3, 2, 1];
const DISTANCE_OPTIONS = [1, 3, 5, 10, 20];
const SORT_OPTIONS: { value: CategoryFilters['sortBy']; label: string }[] = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'price', label: 'Price' },
];

export const CategoryFilterSheet = forwardRef<BottomSheetModal, Props>(
  ({ filters, onApply, onClose }, ref) => {
    const [localFilters, setLocalFilters] = useState<CategoryFilters>(filters);

    const toggleRating = (rating: number) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        rating: prev.rating.includes(rating)
          ? prev.rating.filter((r) => r !== rating)
          : [...prev.rating, rating],
      }));
    };

    const setDistance = (distance: number) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        distance,
      }));
    };

    const setSortBy = (sortBy: CategoryFilters['sortBy']) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        sortBy,
      }));
    };

    const handleApply = () => {
      Feedback.success();
      onApply(localFilters);
      onClose();
    };

    const handleReset = () => {
      Feedback.medium();
      const resetFilters: CategoryFilters = {
        search: '',
        priceRange: { min: 0, max: 1000 },
        rating: [],
        distance: 20,
        sortBy: 'distance',
      };
      setLocalFilters(resetFilters);
    };

    return (
      <CustomBottomSheet
        ref={ref}
        snapPoints={['75%', '95%']}
        index={0}
        enablePanDownToClose
        enableDismissOnClose
        scrollEnabled
        scrollConfig={{ className: 'flex-1' }}
      >
        <View>
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
            {/* Sort By */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Sort By
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setSortBy(option.value)}
                    className={cn(
                      'px-4 py-2.5 rounded-2xl border',
                      localFilters.sortBy === option.value
                        ? 'bg-primary border-primary'
                        : 'bg-card border-border',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        localFilters.sortBy === option.value
                          ? 'text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Search */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Search
              </Text>
              <Input
                placeholder="Search"
                value={localFilters.search}
                onChangeText={(text) =>
                  setLocalFilters({ ...localFilters, search: text })
                }
                className="border border-border rounded-2xl px-4 py-2 bg-card"
              />
            </View>

            {/* Rating */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Minimum Rating
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {RATING_OPTIONS.map((rating) => (
                  <Pressable
                    key={rating}
                    onPress={() => toggleRating(rating)}
                    className={cn(
                      'px-4 py-2.5 rounded-2xl border',
                      localFilters.rating.includes(rating)
                        ? 'bg-primary border-primary'
                        : 'bg-card border-border',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        localFilters.rating.includes(rating)
                          ? 'text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {rating}+ ⭐
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Distance */}
            <View className="mb-8">
              <Text className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-3">
                Maximum Distance
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DISTANCE_OPTIONS.map((distance) => (
                  <Pressable
                    key={distance}
                    onPress={() => setDistance(distance)}
                    className={cn(
                      'px-4 py-2.5 rounded-2xl border',
                      localFilters.distance === distance
                        ? 'bg-primary border-primary'
                        : 'bg-card border-border',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        localFilters.distance === distance
                          ? 'text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {distance} km
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
        </View>
      </CustomBottomSheet>
    );
  },
);

CategoryFilterSheet.displayName = 'CategoryFilterSheet';
