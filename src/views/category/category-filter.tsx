import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScrollSheet } from '@/components/bottom-sheet';
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

    useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);

    const activeFiltersCount = useMemo(() => {
      let count = 0;
      if (localFilters.search.trim().length > 0) count += 1;
      if (localFilters.rating.length > 0) count += 1;
      if (localFilters.distance !== 20) count += 1;
      if (localFilters.sortBy !== 'distance') count += 1;
      return count;
    }, [
      localFilters.distance,
      localFilters.rating.length,
      localFilters.search,
      localFilters.sortBy,
    ]);

    const toggleRating = useCallback((rating: number) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        rating: prev.rating.includes(rating)
          ? prev.rating.filter((r) => r !== rating)
          : [...prev.rating, rating],
      }));
    }, []);

    const setDistance = useCallback((distance: number) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        distance,
      }));
    }, []);

    const setSortBy = useCallback((sortBy: CategoryFilters['sortBy']) => {
      Feedback.light();
      setLocalFilters((prev) => ({
        ...prev,
        sortBy,
      }));
    }, []);

    const handleApply = useCallback(() => {
      Feedback.success();
      onApply(localFilters);
      onClose();
    }, [localFilters, onApply, onClose]);

    const handleReset = useCallback(() => {
      Feedback.medium();
      const resetFilters: CategoryFilters = {
        search: '',
        priceRange: { min: 0, max: 1000 },
        rating: [],
        distance: 20,
        sortBy: 'distance',
      };
      setLocalFilters(resetFilters);
    }, []);

    const handleSearchChange = useCallback((text: string) => {
      setLocalFilters((prev) => ({ ...prev, search: text }));
    }, []);

    return (
      <ScrollSheet
        ref={ref}
        snapPoints={['80%', '95%']}
        index={0}
        scrollConfig={{
          keyboardShouldPersistTaps: 'handled',
          contentContainerStyle: {
            paddingBottom: 24,
          },
        }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl text-foreground font-heading tracking-tight flex-1">
            Filters
          </Text>
          {activeFiltersCount > 0 ? (
            <View className="mr-3 rounded-full bg-primary/15 px-2.5 py-1">
              <Text className="text-xs font-semibold text-primary">
                {activeFiltersCount} active
              </Text>
            </View>
          ) : null}
          <Pressable onPress={handleReset}>
            <Text className="text-primary font-subtitle">Reset</Text>
          </Pressable>
        </View>

        <View className="flex-1">
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
              onChangeText={handleSearchChange}
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
        </View>

        <View className="pt-4 border-t border-border/10 mt-4">
          <Pressable
            className="bg-primary h-14 rounded-2xl items-center justify-center shadow-md"
            onPress={handleApply}
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </ScrollSheet>
    );
  },
);

CategoryFilterSheet.displayName = 'CategoryFilterSheet';
