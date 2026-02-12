import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { Feedback } from '@/lib/haptics';
import {
  CategoryFooter,
  CategorySelector,
  ServiceGrid,
} from '@/views/category';
import {
  CategoryFilterSheet,
  CategoryFilters,
} from '@/views/category/category-filter';

export default function CategoryScreen() {
  const { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const categoryValue = useMemo(() => category || 'all', [category]);

  const [filters, setFilters] = useState<CategoryFilters>({
    search: query || '',
    priceRange: { min: 0, max: 1000 },
    rating: [],
    distance: 20,
    sortBy: 'distance',
  });

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      router.replace(
        routes.category.view(newCategory === 'all' ? 'all' : newCategory),
      );
    },
    [router],
  );

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const handleApplyFilters = useCallback((newFilters: CategoryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleChangeSearch = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, search: text }));
  }, []);

  const handleSubmitSearch = useCallback(() => {
    if (!filters.search.trim()) return;
    Feedback.light();
    router.replace(routes.category.view(categoryValue));
  }, [categoryValue, filters.search, router]);

  return (
    <SafeAreaView className="safe-area relative" edges={['top']}>
      <CategorySelector
        selectedCategory={categoryValue}
        onCategoryChange={handleCategoryChange}
      />
      <Animated.ScrollView
        bounces={false}
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={16}
        contentInset={{ bottom: insets.bottom }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <ServiceGrid
          category={categoryValue}
          searchQuery={query}
          filters={filters}
        />
      </Animated.ScrollView>
      <CategoryFooter
        value={filters.search}
        onFilterPress={handleFilterPress}
        onChangeText={handleChangeSearch}
        onSubmitEditing={handleSubmitSearch}
        bottomInset={insets.bottom}
      />
      <CategoryFilterSheet
        ref={filterSheetRef}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => filterSheetRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}
